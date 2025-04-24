const axios = require('axios');

module.exports.handler = async (event) => {
  try {

    // console.log(`body data ~~~~~~~`, JSON.parse(event.body));

    const { amount, currency } = JSON.parse(event.body);

    const response = await axios.post('https://checkout-test.adyen.com/v71/payments', {
      amount: { value: amount, currency },
      merchantAccount: 'DatmanECOM',
      channel: 'Web',
    }, {
      headers: {
        // 'X-API-Key': process.env.ADYEN_API_KEY,
        'X-API-Key':"AQEhhmfuXNWTK0Qc+iSUk3A1pupZNdNLVX9b+/OqECHiZa+nEMFdWw2+5HzctViMSCJMYAc=-FcJnHAWUSzpm7p93WCMJdnU6LzIVnUbQjH8SqCJOJew=-i1idy)9&>sEpQxI75en"
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ paymentMethods: response.data }),
    };
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

/**
 * transaction table
 * payment_status 0 => 1
 * => 2
 */
