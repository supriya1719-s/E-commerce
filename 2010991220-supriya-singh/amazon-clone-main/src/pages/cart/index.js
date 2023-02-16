import Image from "next/image";
import Header from "../../components/Header";
import CheckoutProduct from "../../components/CheckoutProduct";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { showErrorToast, showSuccessToast } from "../../utils/notification";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Footer from "../../components/Footer";

function Cart() {
  const [items, setItems] = useState([]);
  const session = useSession({ required: true });
  const { status } = session;
  console.log("session is ", session);
  const [cartCount, setCartCount] = useState(0);
  const [cartAmount, setCartAmount] = useState(0);

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const result = await axios.post("/api/payment/order", {
      amount: cartAmount,
    });

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    console.log("result data is ", result.data);
    const { amount, order } = result.data;

    let order_id = order.id;
    const options = {
      key: "rzp_test_EFAYcdLnZmIrmZ", // Enter the Key ID generated from the Dashboard
      amount: (amount * 100).toString(),
      name: "Vartika Ecomm",
      description: "Order Payment",
      //   image: { logo },
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };

        const result = await axios.post("/api/payment/success", data);
        console.log("result from server is ", result);

        if (result.data.status == true) {
          showSuccessToast("Successfully Ordered");
          setCartAmount(0);
          setCartCount(0);
          setItems([]);
        } else {
          showErrorToast("Some Technical Error");
        }
      },
      prefill: {
        name: "Vartika Sharma",
        email: "vartika@gmail.com",
        contact: "9999999999",
      },
      notes: {
        address: "Vartika Sharma, Prayagraj",
      },
      theme: {
        color: "#000000",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  useEffect(() => {
    const dataFetcher = async () => {
      let responseData = await fetch("/api/cart");
      responseData = await responseData.json();
      console.log("response data is ", responseData);
      if (responseData.status == true) {
        console.log("changed cart ");
        setItems(responseData.data.products);
        setCartCount(responseData.data._count.products);
        setCartAmount(responseData.data.amount);
      }
    };
    dataFetcher();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      console.log("removing for product ", productId);
      let response = await fetch(
        `/api/cart/removeProduct?productId=${productId}`
      );
      let data = await response.json();
      if (data.status == true) {
        setItems(data.data.products);
        setCartCount(data.data._count.products);
        setCartAmount(data.data.amount);
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

  return (
    <div className="bg-gray-100">
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

      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/* Left */}
        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="https://links.papareact.com/ikj"
            width={1020}
            height={250}
            objectFit="contain"
          />

          <div className="flex flex-col p-5 space-y-50 bg-white">
            <h1
              className={`text-3xl ${
                items.length > 0 ? "border-b pb-4" : "pb-2"
              }`}
            >
              {items.length === 0
                ? "Your Amazon Basket is empty."
                : "Shopping Basket"}
            </h1>
            <TransitionGroup>
              {items.map((item, i) => {
                console.log("item is ", item);
                return (
                  <CSSTransition
                    key={item.image}
                    timeout={500}
                    classNames="item"
                  >
                    <CheckoutProduct
                      id={item.id}
                      title={item.title}
                      rating={item.rating}
                      price={item.price}
                      description={item.description}
                      category={item.category}
                      image={item.image}
                      removeFromCart={removeFromCart}
                    />
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          </div>
        </div>

        {/* Right */}
        <CSSTransition
          in={items.length > 0}
          timeout={300}
          classNames="disappear"
          unmountOnExit
        >
          <div className="flex flex-col bg-white p-10 shadow-md">
            <h2 className="whitespace-nowrap">
              Subtotal ({items.length} items):{" "}
              <span className="font-bold">
                ₹{Math.round(cartAmount * 100) / 100}
              </span>
            </h2>

            {status == "authenticated" && (
              <button
                onClick={() => {
                  displayRazorpay();
                }}
                className="mt-2 button  p-2 text-xs md:text-sm bg-gradient-to-b from-yellow-200 to-yellow-400 border border-yellow-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 active:from-yellow-500"
              >
                Proceed To Payment
              </button>
            )}
          </div>
        </CSSTransition>
      </main>
      <Footer />
    </div>
  );
}

export default Cart;
