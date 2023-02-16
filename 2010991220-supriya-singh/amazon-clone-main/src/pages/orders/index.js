import Image from "next/image";
import Header from "../../components/Header";
import CheckoutProduct from "../../components/CheckoutProduct";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { showErrorToast, showSuccessToast } from "../../utils/notification";
import "react-toastify/dist/ReactToastify.css";
import OrderProduct from "../../components/OrderProduct";
import moment from "moment";
import Footer from "../../components/Footer";

function Order() {
  const [items, setItems] = useState([]);
  const session = useSession({ required: true });
  const { status } = session;
  console.log("session is ", session);
  const [cartCount, setCartCount] = useState(0);
  const [cartAmount, setCartAmount] = useState(0);

  useEffect(() => {
    const dataFetcher = async () => {
      let responseData = await fetch("/api/order");
      responseData = await responseData.json();
      console.log("order data is ", responseData);
      if (responseData.status == true) {
        console.log("changed orders ");
        setItems(responseData.data);
      }
    };

    const cartDataFetcher = async () => {
      let responseData = await fetch("/api/cart");
      responseData = await responseData.json();
      console.log("response data is ", responseData);
      if (responseData.status == true) {
        console.log("changed cart ");
        setCartCount(responseData.data._count.products);
        setCartAmount(responseData.data.amount);
      }
    };

    dataFetcher();
    cartDataFetcher();
  }, []);

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
            width={1500}
            height={250}
            objectFit="contain"
          />

          <div className="flex flex-col p-5 mt-4 space-y-50 bg-white">
            <h1
              className={`text-3xl ${
                items.length > 0 ? "border-b pb-4" : "pb-2"
              }`}
            >
              {items.length === 0
                ? "Your Amazon Orders are empty."
                : "Your Orders"}
            </h1>
            <div className="space-y-4">
              {items.map((item, index) => {
                console.log("on item", item);
                return (
                  <div className={index == 0 ? "pt-6" : "pt-2"}>
                    <div className="flex flex-row justify-around items-center font-semibold text-xl">
                      <div>
                        Order {index + 1} -{" "}
                        {moment(item.createdAt)
                          .utcOffset("+0530")
                          .format("MMMM Do YYYY")}
                      </div>
                      <div>Total Amount - ₹{item.amount}</div>
                    </div>
                    <TransitionGroup>
                      {item.products.map((product, i) => {
                        console.log("product is ", product);
                        return (
                          <CSSTransition
                            key={product.image}
                            timeout={500}
                            classNames="item"
                          >
                            <OrderProduct
                              id={product.id}
                              title={product.title}
                              rating={product.rating}
                              price={product.price}
                              description={product.description}
                              category={product.category}
                              image={product.image}
                            />
                          </CSSTransition>
                        );
                      })}
                    </TransitionGroup>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Order;
