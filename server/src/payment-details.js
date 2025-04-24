const axios = require('axios');

module.exports.handler = async (event) => {
  try {
    const details = JSON.parse(event.body);
    console.log("checking details",details)

    const response = await axios.post('https://checkout-test.adyen.com/v67/payments/details', details, {
      headers: {
        'X-API-Key': "AQEhhmfuXNWTK0Qc+iSUk3A1pupZNdNLVX9b+/OqECHiZa+nEMFdWw2+5HzctViMSCJMYAc=-FcJnHAWUSzpm7p93WCMJdnU6LzIVnUbQjH8SqCJOJew=-i1idy)9&>sEpQxI75en",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (err) {
    console.error('Error handling payment details:', err.response?.data || err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Details failed' }),
    };
  }
};
