import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const products = await fetch("https://fakestoreapi.com/products");

  let finalProducts = await products.json();
  let finalData = [];
  finalProducts.map(async (product) => {
    let newProduct = await prisma.product.create({
      data: {
        category: product.category,
        description: product.description,
        image: product.image,
        price: product.price,
        title: product.title,
        rating: {
          create: {
            rate: product.rating.rate,
            count: product.rating.count,
          },
        },
      },
    });

    console.log("new product is ", newProduct);
    finalData.push(newProduct);
  });

  return res.status(200).json({ data: finalData });
}
