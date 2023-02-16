import prisma from "../../../lib/prisma";

export default async function handler(req, res) {

  

  let productsData = await prisma.product.findMany({
    include: {
      rating: true,
    },
  });

  return res.status(200).json({ data: productsData });
}
