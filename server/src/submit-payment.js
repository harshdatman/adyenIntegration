const axios = require('axios');

module.exports.handler = async (event) => {
  try {
    const paymentData = JSON.parse(event.body);

    const response = await axios.post('https://checkout-test.adyen.com/v67/payments', {
      ...paymentData,
      merchantAccount: 'DatmanECOM',
      reference: "1uy34u23ggr32r28",
      mode: "hosted",
      themeId: "13063e36-b8a0-4942-9ea8-6df5161a76ed",
      returnUrl: 'http://localhost:5173/',
    }, {
      headers: {
        'X-API-Key': "AQEhhmfuXNWTK0Qc+iSUk3A1pupZNdNLVX9b+/OqECHiZa+nEMFdWw2+5HzctViMSCJMYAc=-FcJnHAWUSzpm7p93WCMJdnU6LzIVnUbQjH8SqCJOJew=-i1idy)9&>sEpQxI75en",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (err) {
    console.error('Error submitting payment:', err.response?.data || err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Payment failed' }),
    };
  }
};
