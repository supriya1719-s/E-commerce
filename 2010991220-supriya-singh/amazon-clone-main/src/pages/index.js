import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Banner from "../components/Banner";
import Header from "../components/Header";
import ProductFeed from "../components/ProductFeed";
import { getProducts } from "../utils/functions";
import { showErrorToast, showSuccessToast } from "../utils/notification";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";

export default function Home({ products }) {
  const { status, data } = useSession({
    required: false,
  });

  const [cartCount, setCartCount] = useState(0);

  const addToCart = async (productId) => {
    try {
      console.log("adding for product ", productId);
      let response = await fetch(
        `/api/cart/addProduct?productId=${productId.id}`
      );
      let data = await response.json();
      if (data.status == true) {
        setCartCount(data.data._count.products);
      } else {
      }
      showSuccessToast("Successfully Added To Cart");
      console.log("response data is ", data);
      return;
    } catch (e) {
      showErrorToast("Some Technical Problem");
      console.log("error in adding product to cart ", e);
      return;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      console.log("removing for product ", productId);
      let response = await fetch(
        `/api/cart/removeProduct?productId=${productId}`
      );
      let data = await response.json();
      if (data.status == true) {
        setCartCount(data.data._count.products);
      } else {
      }
      showSuccessToast("Successfully Removed from Cart");
      console.log("response data is ", data);
      return;
    } catch (e) {
      showErrorToast("Some Technical Problem");
      console.log("error in adding product to cart ", e);
      return;
    }
  };

  useEffect(() => {
    const dataFetcher = async () => {
      let responseData = await fetch("/api/cart");
      responseData = await responseData.json();
      console.log("response data is ", responseData);
      if (responseData.status == true) {
        console.log("changed cart ");
        setCartCount(responseData.data._count.products);
      }
    };
    dataFetcher();
  }, []);

  console.log("auth data is ", data);

  return (
    <div className="bg-gray-100">
      <Head>
        <title>Amazon 2.0</title>
      </Head>

      <Header cartCount={cartCount} />
      <ToastContainer
        className={"text-sm font-sans"}
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <main className="max-w-screen-2xl mx-auto">
        <Banner />

        <ProductFeed
          products={products}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticProps(context) {
  let finalProducts;

  finalProducts = await getProducts();

  console.log("final products are ", finalProducts);
  return {
    props: {
      products: finalProducts,
    },
  };
}
