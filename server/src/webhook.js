require("dotenv").config();
const querystring = require("querystring");
const { hmacValidator } = require("@adyen/api-library");
const { AppDataSource } = require("./datasource/datasource");
const { Payment } = require("./entity/paymentSchema");
const { Refund } = require("./entity/refundSchema");
const { v4: uuidv4 } = require("uuid");

const hmacKey = process.env.ADYEN_HMAC_KEY;
const validator = new hmacValidator();

module.exports.handler = async (event) => {
  const parsedBody = querystring.parse(event.body || "");

  console.log("📥 Raw Event Body:", event.body);
  console.log("🧾 Parsed Body:", parsedBody);

  const {
    eventCode,
    success,
    pspReference,
    merchantReference,
    paymentLinkId,
    originalReference,
    currency,
    value,
    reason,
    paymentPspReference,
  } = parsedBody;

  const additionalData = {};
  Object.keys(parsedBody).forEach((key) => {
    if (key.startsWith("additionalData.")) {
      additionalData[key.replace("additionalData.", "")] = parsedBody[key];
    }
  });

  const notification = {
    pspReference,
    originalReference: originalReference || "",
    merchantAccountCode: parsedBody.merchantAccountCode,
    merchantReference,
    amount: {
      value: parseInt(value),
      currency,
    },
    eventCode,
    success,
    paymentMethod: parsedBody.paymentMethod || "",
    operations: parsedBody.operations?.split(",") || [],
    additionalData,
  };

  console.log("📦 Structured Notification:", notification);

  const isValid = validator.validateHMAC(notification, hmacKey);

  if (!isValid) {
    console.error("❌ Invalid HMAC signature. Webhook request rejected.");
    return { statusCode: 401, body: "Invalid HMAC signature" };
  }

  console.log("🔐 Valid HMAC signature. Proceeding with processing.");

  if (!eventCode || !pspReference || !merchantReference) {
    console.log("⚠️ Missing required fields in webhook");
    return { statusCode: 400, body: "[accepted]" };
  }

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("✅ DB initialized");
  }

  const paymentRepo = AppDataSource.getRepository(Payment);
  const refundRepo = AppDataSource.getRepository(Refund);

  const workingpaymenttablerow = await paymentRepo.findOne({ where: { merchantReference } });
  const workingrefundtablerow = await refundRepo.findOne({ where: { pspReference: originalReference } });

  console.log("📨 Processing EventCode:", eventCode);

  if (workingpaymenttablerow && eventCode === "RECEIVED" && success === "true") {
    workingpaymenttablerow.status = "Received";
    await paymentRepo.save(workingpaymenttablerow);
    console.log("📩 Payment received");
  }

  if (workingpaymenttablerow && eventCode === "AUTHORISATION" && success === "true") {
    workingpaymenttablerow.status = "Authorized";
    workingpaymenttablerow.refundedFlag = false;
    workingpaymenttablerow.pspReference = pspReference;
    await paymentRepo.save(workingpaymenttablerow);
    console.log("✅ Payment authorised and saved");
  }

  if (workingpaymenttablerow && eventCode === "CAPTURE" && success === "true") {
    workingpaymenttablerow.status = "CAPTURE";
    await paymentRepo.save(workingpaymenttablerow);
    console.log("✅ Payment Captured");
  }

  if (workingpaymenttablerow && eventCode === "SENT_FOR_SETTLEMENT" && success === "true") {
    workingpaymenttablerow.status = "SentForSettle";
    await paymentRepo.save(workingpaymenttablerow);
    console.log("📤 Sent for settlement");
  }

  if (eventCode === "REFUND" && success === "true") {
    console.log("🔄 Processing Refund Event");

    if (workingrefundtablerow) {
      workingrefundtablerow.status = "Refunded";
      await refundRepo.save(workingrefundtablerow);
    }

    const workingpaymenttablerowforrefund = await paymentRepo.findOne({ where: { pspReference: originalReference } });

    if (workingpaymenttablerowforrefund) {
      workingpaymenttablerowforrefund.refundedFlag = true;
      await paymentRepo.save(workingpaymenttablerowforrefund);
    }

    const payment = await paymentRepo.findOne({ where: { pspReference } });

    if (payment) {
      const existingRefund = await refundRepo.findOne({ where: { pspReference } });

      if (!existingRefund) {
        const newRefund = refundRepo.create({
          refundId: merchantReference,
          status: "Refund in Progress",
          refundAmount: parseInt(value),
          currency,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await refundRepo.save(newRefund);
        console.log("💸 Refund saved");
      } else {
        console.log("↩️ Refund already exists");
      }
    }
  }

  if (workingpaymenttablerow && !["RECEIVED", "AUTHORISATION", "CAPTURE", "SENT_FOR_SETTLEMENT", "REFUND"].includes(eventCode)) {
    console.log(`ℹ️ EventCode ${eventCode} received but no status mapping applied`);
  }

  return { statusCode: 200, body: "[accepted]" };
};
