require("dotenv").config();
const axios = require("axios");
const { AppDataSource } = require("./datasource/datasource");
const { Payment } = require("./entity/paymentSchema");
const { v4: uuidv4 } = require("uuid");

module.exports.handler = async (event) => {
  try {
    const { amount } = JSON.parse(event.body);

    const idempotencyKey = uuidv4();

    const response = await axios.post(
      "https://checkout-test.adyen.com/v70/paymentLinks",
      {
        amount: { value: amount*100, currency: "GBP" },
        reference: `ORDER-${Date.now()}`,
        returnUrl: "https://your-domain.com/",
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

  
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const paymentRepo = AppDataSource.getRepository(Payment);

  
    const payment = {
      transactionId: uuidv4(),
      paymentLinkId: data.id,
      merchantReference: data.reference,
      amount: amount,
      currency: "GBP",
      status: "Pending",
      idempotencyKey, 
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
