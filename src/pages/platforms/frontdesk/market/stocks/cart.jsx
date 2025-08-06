import React from "react";
import Defibrillator from "./../../../../../assets/subscriber/Defibrillator.jpg";

export default function Cart() {
  return (
    <div className="cart-container">
      <div className="cart-header">
        <span>
          <input className="cart-checkbox" type="checkbox" /> Product
        </span>
        <span>Unit Price</span>
        <span>Quantity</span>
        <span>Total Price</span>
        <span>Actions</span>
      </div>
      <div className="cart-body">
        <div className="cart-item">
          <input className="cart-checkbox" type="checkbox" />
          <img src={Defibrillator} alt="cart-img" />
          <span>Cardiac Defibrillator AED Portable Unit</span>
        </div>
        <div className="cart-price">
          <span>$1000</span>
        </div>
        <div className="cart-quantity">
          <div className="description-quantity-box">
            <button
              // onClick={decrease}
              // disabled={quantity <= 1}
              className="description-quantity-btn"
            >
              –
            </button>

            <input
              type="text"
              value={1}
              // onChange={handleChange}
              // onBlur={handleBlur}
              className="description-quantity-input"
            />

            <button
              // onClick={increase}
              // disabled={quantity >= card.stock}
              className="description-quantity-btn"
            >
              +
            </button>
          </div>
        </div>
        <div className="cart-totalPrice">
          <span>$1000</span>
        </div>
        <div className="cart-action">
          <button>Delete</button>
        </div>
      </div>
      <div className="cart-footer">
        <div className="cart-selectDelete-all">
          <span>
            <input className="cart-checkbox" type="checkbox" /> Select all (1)
          </span>
          <button className="cart-delete-all">Delete all</button>
        </div>
        <div className="cart-checkOut-total">
          <div className="cart-checkOut-total-price">
            <div className="cart-checkOut-total-price-item">
              <span>Total(1 item):</span>
              <span>$1000</span>
            </div>
            <div className="cart-checkOut-saved">
              <span>Saved</span>
              <span>$100</span>
            </div>
          </div>
          <button>Check Out</button>
        </div>
      </div>
    </div>
  );
}
