import Razorpay from "razorpay";
const crypto = require("crypto");
const key_id = process.env.key_id;
import shortid from "shortid";
const key_secret = process.env.key_secret;
const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export default async function handler(req, res) {
  console.log("in request");
  const options = {
    amount: parseInt(req.body.amount) * 100, //todo add fixed amount
    currency: "INR",
    receipt: shortid.generate(),
    payment_capture: 1,
  };
  razorpay.orders.create(options, function (err, order) {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      console.log(order);
      res.json({ order, amount: parseInt(req.body.amount) });
    }
  });
}
