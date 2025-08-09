import React, { useState } from "react";
import { MDBIcon } from "mdbreact";
import Swal from "sweetalert2";

export default function Description({ card, addToCart, buyNow }) {
  const [mainImage, setMainImage] = useState(card.image[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    Color: null,
    Size: null,
    Power: null,
  });
  const [showVariationError, setShowVariationError] = useState(false);

  const allOptionsSelected = Object.values(selectedOptions).every(Boolean);
  // const incompleteSelections = !allOptionsSelected;

  const handleOptionSelect = (label, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [label]: prev[label] === value ? null : value,
    }));
  };

  const increase = () => {
    if (quantity < card.stock) setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity("");
    } else {
      const num = Math.max(1, Math.min(card.stock, Number(value)));
      if (!isNaN(num)) setQuantity(num);
    }
  };

  const handleBlur = () => {
    if (quantity === "" || quantity < 1) setQuantity(1);
  };

  const generateCartItemId = (productId, selectedOptions) => {
    const variationKey = Object.values(selectedOptions || {}).join("-");
    return `${productId}-${variationKey}`;
  };

  const handleAddToCart = () => {
    if (!allOptionsSelected) {
      setShowVariationError(true);
      return;
    }

    setShowVariationError(false);

    addToCart({
      ...card,
      id: generateCartItemId(card.id, selectedOptions),
      quantity,
      selected: true,
      selectedOptions,
    });

    Swal.fire({
      icon: "success",
      title: "Item has been added to your shopping cart",
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        title: "stock-my-swal-title",
        icon: "stock-my-swal-icon",
      },
    });
  };

  const handleBuyNow = () => {
    if (!allOptionsSelected) {
      setShowVariationError(true);
      return;
    }

    setShowVariationError(false);

    buyNow({
      ...card,
      quantity,
      selected: true,
      selectedOptions,
    });
  };

  return (
    <div className="description-container">
      <div className="description-info-container">
        <div className="description-image-wrapper">
          <img src={mainImage} className="description-image" alt={card.title} />
          <div className="description-images">
            {card.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${card.title} ${index}`}
                onMouseEnter={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="description-details">
          <span className="description-title">{card.title}</span>

          <div className="description-ratingAndSold">
            <div className="description-rating">
              <span>{card.rating}</span>
              <span>★★★★★</span>
            </div>
            <div className="description-sold">
              <span>{card.sold}</span>
              <span>sold</span>
            </div>
          </div>

          <div className="description-price">
            <span>₱{Math.round(card.price * (1 - card.discount / 100))}</span>
            {card.discount > 0 && (
              <>
                <span className="description-price-original">
                  ₱{card.price}
                </span>
                <span className="description-price-discount">
                  {card.discount}% off
                </span>
              </>
            )}
          </div>

          <div className={`mt-2 ${showVariationError ? "incomplete" : ""}`}>
            <div className="description-options">
              {[
                { label: "Color", data: card.color },
                { label: "Size", data: card.size },
                { label: "Power", data: card.power },
              ].map((opt, i) => (
                <div className="description-option-group" key={i}>
                  <span className="description-option-label">{opt.label}</span>
                  <div className="description-option-buttons">
                    {opt.data.map((item, index) => (
                      <button
                        key={index}
                        className={
                          selectedOptions[opt.label] === item ? "selected" : ""
                        }
                        onClick={() => handleOptionSelect(opt.label, item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="description-quantity">
              <span>Quantity</span>
              <div className="description-quantity">
                <div className="description-quantity-box">
                  <button
                    onClick={decrease}
                    disabled={!allOptionsSelected || quantity <= 1}
                    className="description-quantity-btn"
                  >
                    –
                  </button>

                  <input
                    type="text"
                    value={quantity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="description-quantity-input"
                    disabled={!allOptionsSelected}
                  />

                  <button
                    onClick={increase}
                    disabled={!allOptionsSelected || quantity >= card.stock}
                    className="description-quantity-btn"
                  >
                    +
                  </button>
                </div>
                <span className="description-stock-text">
                  {card.stock > 0 ? `IN STOCK (${card.stock})` : "OUT OF STOCK"}
                </span>
              </div>
            </div>

            {showVariationError && !allOptionsSelected && (
              <div className="variation-warning">
                Please select product variation first
              </div>
            )}
          </div>

          <div className="description-btnCartBuy">
            <button
              className="description-btnAddtoCart"
              onClick={handleAddToCart}
            >
              <MDBIcon fas icon="cart-plus" />
              &nbsp;add to cart
            </button>
            <button className="description-btnBuy" onClick={handleBuyNow}>
              <span>Buy with voucher</span>
              <span>
                ₱
                {(
                  card.price *
                  quantity *
                  (1 - (card.discount || 0) / 100)
                ).toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="description-specifications">
        <span className="description-specifications-title">
          Product Specification
        </span>
        <div className="description-specifications-description">
          <span>Description:</span>
          <span>{card.description}</span>
        </div>
        <div className="description-specifications-dimensions">
          <span>Dimensions:</span>
          <span>{card.specifications.dimensions}</span>
        </div>
        <div className="description-specifications-weight">
          <span>Weight:</span>
          <span>{card.specifications.weight}</span>
        </div>
        <div className="description-specifications-warranty">
          <span>Warranty:</span>
          <span>{card.specifications.warranty}</span>
        </div>
      </div>
    </div>
  );
}
