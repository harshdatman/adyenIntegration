require("dotenv").config();
const axios = require("axios");
const { AppDataSource } = require("./datasource/datasource");
const { Payment } = require("./entity/paymentSchema");
const { v4: uuidv4 } = require("uuid");

module.exports.handler = async (event) => {
  try {
    const { amount } = JSON.parse(event.body);

    // Step 1: Generate a unique idempotency key
    const idempotencyKey = uuidv4();
    // console.log("00000",process.env.ADYEN_API_KEY)

    // Step 2: Send request to Adyen API to create payment link
    const response = await axios.post(
      "https://checkout-test.adyen.com/v70/paymentLinks",
      {
        amount: { value: amount*100, currency: "GBP" },
        reference: `ORDER-${Date.now()}`,
        returnUrl: "https://your-domain.com/", // Replace with actual return URL
        merchantAccount: "DatmanECOM",
      },
      {
        headers: {
          "X-API-Key": process.env.ADYEN_API_KEY,
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
      }
    );

    const data = response.data;
    console.log("data is--->", data);

    // Step 4: Initialize DB if not already initialized
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const paymentRepo = AppDataSource.getRepository(Payment);

    // Step 5: Save payment info to the database, including idempotency key
    const payment = {
      transactionId: uuidv4(),
      paymentLinkId: data.id,
      merchantReference: data.reference,
      amount: amount,
      currency: "GBP",
      status: "Pending",
      idempotencyKey, // 💡 Save it here
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await paymentRepo.save(payment);
    console.log("✅ Payment link stored in DB");

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("❌ Error creating session:", error?.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create Adyen session" }),
    };
  }
};
