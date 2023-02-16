import React, { useEffect, useState } from "react";
import Product from "./Product";

function ProductFeed({ products, addToCart, removeFromCart }) {
  const [productsArray, setProductsArray] = useState([]);
  useEffect(() => {
    const stateSetter = () => {
      setProductsArray(products);
    };
    const dataFetcher = async () => {
      let responseData = await fetch(`/api/cart`);
      responseData = await responseData.json();
      if (responseData.status == true) {
        let productArrayData = products;

        await Promise.all(
          productArrayData.map((product) => {
            if (responseData.data.productIds.includes(product.id)) {
              product.isAdded = true;
            } else {
              product.isAdded = false;
            }
          })
        );

        setProductsArray(productArrayData);
        return;
      }
    };
    stateSetter();
    dataFetcher();
  }, []);

  return (
    <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:-mt-52 mx-auto">
      {productsArray
        .slice(0, 4)
        .map(({ id, title, price, description, category, image, isAdded }) => {
          return (
            <Product
              key={id}
              title={title}
              price={price}
              description={description}
              category={category}
              image={image}
              id={id}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              isAdded={isAdded ? isAdded : false}
            />
          );
        })}

      <img
        className="md:col-span-full"
        src="https://links.papareact.com/dyz"
        alt=""
      />

      <div className="md:col-span-2">
        {productsArray
          .slice(4, 5)
          .map(
            ({ id, title, price, description, category, image, isAdded }) => {
              return (
                <Product
                  key={id}
                  title={title}
                  price={price}
                  description={description}
                  category={category}
                  image={image}
                  id={id}
                  removeFromCart={removeFromCart}
                  addToCart={addToCart}
                  isAdded={isAdded ? isAdded : false}
                />
              );
            }
          )}
      </div>

      {productsArray
        .slice(5, products.length)
        .map(({ id, title, price, description, category, image, isAdded }) => {
          return (
            <Product
              key={id}
              title={title}
              price={price}
              description={description}
              category={category}
              image={image}
              id={id}
              addToCart={addToCart}
              isAdded={isAdded ? isAdded : false}
            />
          );
        })}
    </div>
  );
}

export default ProductFeed;
