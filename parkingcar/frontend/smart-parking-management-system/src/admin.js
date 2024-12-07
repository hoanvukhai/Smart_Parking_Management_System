const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Đường dẫn tới file JSON bạn vừa tải

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smartparkingmanagementsy-42ed2-default-rtdb.asia-southeast1.firebasedatabase.app" // Thay bằng URL Firebase Realtime Database của bạn
});

module.exports = admin;
