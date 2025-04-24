// // idempotency key 

require("dotenv").config();
const axios = require("axios");
const { AppDataSource } = require("./datasource/datasource");
const { Payment } = require("./entity/paymentSchema");
const { Refund } = require("./entity/refundSchema");
const { v4: uuidv4 } = require("uuid");

module.exports.handler = async (event) => {
  try {
    const { orderId, refundAmount } = JSON.parse(event.body || "{}");

    if (!orderId || !refundAmount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "orderId and refundAmount are required in the body" }),
      };
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const paymentRepo = AppDataSource.getRepository(Payment);
    const refundRepo = AppDataSource.getRepository(Refund);

    const payment = await paymentRepo.findOne({ where: { merchantReference:orderId } });

    if (!payment) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No payment found for this orderId" }),
      };
    }

    const existingRefund = await refundRepo.findOne({ where: { transactionId: payment.transactionId } });
    if (existingRefund) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          error: "Refund already initiated for this payment",
        }),
      };
    }

    if (refundAmount > payment.amount) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          error: "Refund amount exceeds original sale amount",
        }),
      };
    }

    const refundReference = `REFUND-${Date.now()}`;
    const idempotencyKey = uuidv4();

    const refundResponse = await axios.post(
      `https://checkout-test.adyen.com/v70/payments/${payment.pspReference}/refunds`,
      {
        merchantAccount: "DatmanECOM",
        amount: {
          value: refundAmount*100,
          currency: payment.currency,
        },
        reference: refundReference,
      },
      {
        headers: {
          "X-API-Key": process.env.ADYEN_API_KEY,
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
      }
    );

    const { pspReference: refundId } = refundResponse.data;

    const refundRecord = refundRepo.create({
      paymentLinkId: payment.paymentLinkId,
      pspReference: refundResponse.data.paymentPspReference,
      status: "RefundInitiated",
      refundId: refundResponse.data.reference,
      refundAmount,
      transactionId: payment.transactionId,
      idempotencyKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await refundRepo.save(refundRecord);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Refund initiated successfully",
        refundId,
      }),
    };
  } catch (err) {
    console.error("Refund Error:", err?.response?.data || err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Refund failed",
        details: err?.response?.data || err.message,
      }),
    };
  }
};
