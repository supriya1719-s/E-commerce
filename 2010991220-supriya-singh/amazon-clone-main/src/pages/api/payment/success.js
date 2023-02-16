import crypto from "crypto";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (session) {
      let { user } = session;
      const body =
        req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
      const { data } = req.body;
      console.log(req.body);
      console.log("key is ", process.env.key_secret);
      let expectedSignature = crypto
        .createHmac("sha256", process.env.key_secret)
        .update(body.toString())
        .digest("hex");
      console.log("sig" + req.body.razorpay_signature);
      console.log("sig" + expectedSignature);
      let response = { status: "failure" };
      if (expectedSignature === req.body.razorpay_signature) {
        response = { status: "success" };
      }

      console.log("response is ", response);

      if (response.status == "success") {
        //emptying user cart
        let currCart = await prisma.cart.findFirst({
          where: {
            userId: user.id,
          },
        });

        console.log("curr cart is ", currCart);
        let disArray = [];
        currCart.productIds.map((id) => {
          disArray.push({ id });
        });
        console.log("dis array is ", disArray);
        let updatedCart = await prisma.cart.update({
          data: {
            amount: {
              decrement: currCart.amount,
            },
            products: {
              disconnect: disArray,
            },
          },
          where: {
            id: currCart.id,
          },
          include: {
            _count: true,
            products: {
              include: {
                rating: true,
              },
            },
          },
        });

        console.log("updated cart is ", updatedCart);
        //creating new order

        let newOrder = await prisma.order.create({
          data: {
            amount: currCart.amount,
            userId: user.id,
            products: {
              connect: disArray,
            },
          },
        });
        console.log("new order is ", newOrder);

        return res.status(200).json({ status: true, data: updatedCart });
      } else {
        return res.status(500).json({ status: false });
      }
    }
  } catch (e) {
    console.log("error in verifying payment ", e);
    return res.status(500).json({ status: false });
  }
}
