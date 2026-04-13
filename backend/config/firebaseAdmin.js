const admin = require('firebase-admin');
require('dotenv').config();

try {
  // You need to download your service account JSON from Firebase Console:
  // Project Settings -> Service Accounts -> Generate new private key
  // Save it as 'firebase-service-account.json' in your backend folder
  const serviceAccount = require('../firebase-service-account.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('✅ Firebase Admin Initialized');
} catch (error) {
  console.log('⚠️ Firebase Admin could not be initialized. Please add firebase-service-account.json');
}

module.exports = admin;
