import { unstable_getServerSession } from "next-auth";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    console.log("session is ", session);

    if (session) {
      let { query } = req;
      let currCart = await prisma.cart.findFirst({
        where: {
          userId: session.user && session.user.id,
        },
      });
      let currProduct = await prisma.product.findUnique({
        where: {
          id: query.productId.toString(),
        },
      });
      let updatedCart = await prisma.cart.update({
        where: {
          id: currCart.id,
        },
        data: {
          products: {
            connect: {
              id: query.productId.toString(),
            },
          },

          amount: {
            increment: currProduct.price,
          },
        },
        include: {
          _count: true,
        },
      });

      console.log("updated cart is ", updatedCart);
      return res.status(200).json({ status: true, data: updatedCart });
    } else {
      return res.status(401).json({ status: false });
    }
  } catch (e) {
    console.log("error in adding product to route ", e);
    return res.status(500).json({ status: false });
  }
}
