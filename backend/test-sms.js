require('dotenv').config();
const axios = require('axios');

async function testSMS() {
  try {
    const cleanPhone = '919326087732'; // Added 91 prefix
    const otp = '123456';
    console.log(`Sending to MSG91: Phone=${cleanPhone}, Template=${process.env.MSG91_TEMPLATE_ID}`);
    
    // Using axios with full URL to be safe
    const url = `https://api.msg91.com/api/v5/otp?template_id=${process.env.MSG91_TEMPLATE_ID}&mobile=${cleanPhone}&authkey=${process.env.MSG91_AUTH_KEY}&otp=${otp}`;
    
    const res = await axios.get(url, { timeout: 10000 });
    
    console.log('Response Status:', res.status);
    console.log('Response Data:', JSON.stringify(res.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Network/Request Error:', error.message);
    }
  }
}
testSMS();
