import { unstable_getServerSession } from "next-auth";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";
export default async function handler(req, res) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    console.log("session is ", session);

    if (session) {
      let { user } = session;

      let ordersData = await prisma.order.findMany({
        where: {
          userId: user.id,
        },
        include: {
          products: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      console.log("orders data is ", ordersData);

      return res.status(200).json({ status: true, data: ordersData });
    } else {
      return res.status(401).json({ status: false, msg: "unauthenticated" });
    }
  } catch (e) {
    console.log("error in getting cart data ", e);
    return res.status(500).json({ status: false, msg: "server error" });
  }
}
