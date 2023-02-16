import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <div>
      {" "}
      <div className="footer">
        <div className="inner-footer">
          <div className="footer-items">
            <h2>Vartika's Ecommerce</h2>
            <br />
            <p>We are here to help people buy their loved items.</p>
          </div>

          <div className="footer-items">
            <br />
            <h3>Quick Links</h3>
            <div className="border1"></div>
            <ul className="foot-list">
              <Link href={"/"} role="link">
                <li className="cursor-pointer">Home</li>
              </Link>
              <Link href={"/cart"} role="link">
                <li className="cursor-pointer">Cart</li>
              </Link>
              <Link href={"/orders"} role="link">
                <li className="cursor-pointer">Orders</li>
              </Link>
            </ul>
          </div>

          <div className="footer-items">
            <br />
            <h3>Collaborators</h3>
            <div className="border1"></div>
            <ul className="foot-list">
              <a href="#">
                <li>Vartika Sharma</li>
              </a>
            </ul>
          </div>

          <div className="footer-items">
            <br />
            <h3>Contact us</h3>
            <div className="border1"></div>
            <ul className="foot-list">
              <li>Chitkara University</li>
              <li>123456789</li>
              <li>no-reply@amazon-clone.com</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          Made by Vartika Sharma with ❤️ and React(Next JS).
        </div>
      </div>
    </div>
  );
}

export default Footer;
