const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");

const cors = require("cors");
const app = express();

admin.initializeApp({
  credential: admin.credential.cert("./credentials.json"),
  databaseURL:
    "firebase-adminsdk-5zh4k@base-de-datos-h.iam.gserviceaccount.com",
});

app.get("/hello-world", (req, res) => {
  return res.status(200).json({message: "hello-world"});
});
app.use(cors({
  origin: "http://127.0.0.1:5173",
  credentials: true,
}));
app.use(require("./routes/product.routes"));


exports.app = functions.https.onRequest(app);
