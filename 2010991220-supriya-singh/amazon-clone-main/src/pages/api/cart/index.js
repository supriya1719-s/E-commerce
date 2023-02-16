import { unstable_getServerSession } from "next-auth";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";
export default async function handler(req, res) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    console.log("session is ", session);

    if (session) {
      let { user } = session;
      console.log("user is ", user);

      let cart = await prisma.cart.findFirst({
        where: {
          userId: user.id,
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

      console.log("cart in db is ", cart);
      if (cart) {
        return res.status(200).json({ status: true, data: cart });
      } else {
        let newCart = await prisma.cart.create({
          data: {
            user: {
              connect: {
                id: user.id,
              },
            },
          },
          include: {
            _count: true,
          },
        });

        console.log("new cart is ", newCart);

        return res.status(200).json({ status: true, data: newCart });
      }
    } else {
      return res.status(401).json({ status: false, msg: "unauthenticated" });
    }
  } catch (e) {
    console.log("error in getting cart data ", e);
    return res.status(500).json({ status: false, msg: "server error" });
  }
}
