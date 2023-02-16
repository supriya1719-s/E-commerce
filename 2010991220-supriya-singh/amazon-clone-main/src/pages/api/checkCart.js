import { unstable_getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session) {
    const { user } = session;

    let currCart = await prisma.cart.findFirst({
      where: {
        userId: user.id,
      },
    });
    if (currCart) {
      if (currCart.productIds.includes(req.query.productId)) {
        return res.json({ status: true, msg: "Found" });
      } else {
        return res.json({ status: false, msg: "Product Not Found in Cart" });
      }
    } else {
      return res.json({ status: false, msg: "Cart Not Found" });
    }
  } else {
    return res.json({ status: false, msg: "Session Not Found" });
  }
}
