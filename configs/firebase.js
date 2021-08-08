const { storage } = require("firebase-admin");
const admin = require("firebase-admin");
const key = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(key),
  storageBucket: "rentopedia1706.appspot.com",
});

const db = admin.firestore();
const storageBucketRoot = admin.storage().bucket();

exports.db = db;
exports.storageBucketRoot = storageBucketRoot;