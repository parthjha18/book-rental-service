require('dotenv').config();
const axios = require('axios');

async function testSMS() {
  try {
    const res = await axios.get('https://api.msg91.com/api/v5/otp', {
      params: {
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile: '919326087732', // Added 91 prefix
        authkey: process.env.MSG91_AUTH_KEY,
        otp: '123456'
      }
    });
    console.log('HITS 200 Block!', res.status, res.data);
  } catch (error) {
    console.log('HITS Catch Block!', error.response ? error.response.status : error.message);
  }
}
testSMS();
