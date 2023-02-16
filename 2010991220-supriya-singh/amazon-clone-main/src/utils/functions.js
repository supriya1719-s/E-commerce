import prisma from "../../lib/prisma";

const getProducts = async () => {
  let productsData = await prisma.product.findMany({
    include: {
      rating: true,
    },
  });

  // console.log("added products are ", addedProducts);

  return productsData;
};

export { getProducts };
