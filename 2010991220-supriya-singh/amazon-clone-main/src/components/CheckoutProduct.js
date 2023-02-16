import { StarIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useState } from "react";

import TopBarProgress from "react-topbar-progress-indicator";

TopBarProgress.config({
  barColors: {
    0: "#ffffff",
    "1.0": "#ffffff",
  },
  shadowBlur: 5,
});

function CheckoutProduct(props) {
  const id = props.id;
  const title = props.title;
  const rating = Math.floor(Math.random() * 5) + 1;
  const price = props.price;
  const description = props.description;
  const category = props.category;
  const image = props.image;

  console.log("props are ", props);

  const [buttonState, setButtonState] = useState("delete");
  const [showTopLoader, setShowTopLoader] = useState(false);
  return (
    <div className="block py-4 sm:grid sm:grid-cols-5 my-16 sm:my-3">
      {showTopLoader && <TopBarProgress />}
      <div className="text-center sm:text-left">
        <Image src={image} width={200} height={200} objectFit="contain" />
      </div>

      {/* Middle */}
      <div className="col-span-3 mx-5 mb-4 sm:mb-0">
        <p className="my-3">{title}</p>
        <div className="flex">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <StarIcon key={i} className="h-5 text-yellow-500" />
            ))}
        </div>
        <p className="text-xs my-2 line-clamp-3">{description}</p>

        <span className="font-bold">₹{price}</span>
      </div>

      {/* Buttons on the right of the products */}
      <div className="flex flex-col space-y-2 my-auto justify-self-end">
        {buttonState == "delete" && (
          <button
            className="mt-auto text-white button  p-2 text-xs md:text-sm bg-gradient-to-b from-red-200 to-red-400 border border-red-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-300 active:from-red-400"
            onClick={async () => {
              setButtonState("deleting");
              setShowTopLoader(true);
              console.log("top loader ", showTopLoader);
              await props.removeFromCart(id);
              setShowTopLoader(false);
            }}
          >
            Remove from Basket
          </button>
        )}

        {buttonState == "deleting" && (
          <button
            disabled
            className="mt-auto cursor-not-allowed text-white button  p-2 text-xs md:text-sm bg-gradient-to-b from-red-200 to-red-400 border border-red-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-300 active:from-red-400"
            onClick={() => {
              props.removeFromCart(id);
            }}
          >
            Removing
          </button>
        )}
      </div>
    </div>
  );
}

export default CheckoutProduct;
