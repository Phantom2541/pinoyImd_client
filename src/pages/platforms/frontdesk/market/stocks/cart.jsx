import React, { useEffect, useState } from "react";
import { MDBIcon } from "mdbreact";
import Swal from "sweetalert2";

export default function Cart({ cartItems, setCartItems }) {
  const [tempSelectedOptions, setTempSelectedOptions] = useState({});
  const [openVariationId, setOpenVariationId] = useState(null);

  // Ensure each item has `selected: true` by default
  useEffect(() => {
    const updated = cartItems.map((ci) =>
      ci.selected === undefined ? { ...ci, selected: true } : ci
    );
    if (JSON.stringify(updated) !== JSON.stringify(cartItems)) {
      setCartItems(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Helpers ===
  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((ci) =>
        ci.id === id
          ? {
              ...ci,
              quantity: Math.max(
                1,
                Math.min((ci.quantity || 1) + delta, ci.stock ?? Infinity)
              ),
            }
          : ci
      )
    );
  };

  const toggleSelect = (id) => {
    setCartItems((prev) =>
      prev.map((ci) =>
        ci.id === id ? { ...ci, selected: !(ci.selected !== false) } : ci
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((ci) => ci.id !== id));
  };

  const deleteSelected = () => {
    setCartItems((prev) => prev.filter((ci) => ci.selected === false));
  };

  const deleteAll = () => {
    setCartItems([]);
  };

  const handleTempVariationChange = (id, label, value) => {
    setTempSelectedOptions((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [label]: value,
      },
    }));
  };

  const confirmVariationSelection = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            selectedOptions: {
              ...(item.selectedOptions || {}),
              ...(tempSelectedOptions[id] || {}),
            },
          }
        : item
    );
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));

    setTempSelectedOptions((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  // === Computed Values ===
  const allSelected = cartItems.every((ci) => ci.selected !== false);
  const toggleSelectAll = () =>
    setCartItems((prev) =>
      prev.map((ci) => ({ ...ci, selected: !allSelected }))
    );

  const checkedItems = cartItems.filter((ci) => ci.selected !== false);
  const totalQuantity = checkedItems.reduce(
    (sum, ci) => sum + (ci.quantity || 0),
    0
  );
  const totalPrice = checkedItems.reduce(
    (sum, ci) =>
      sum +
      (ci.price || 0) * (ci.quantity || 1) * (1 - (ci.discount || 0) / 100),
    0
  );
  const totalSaved = checkedItems.reduce(
    (sum, ci) =>
      sum + (ci.price || 0) * (ci.quantity || 1) * ((ci.discount || 0) / 100),
    0
  );

  const handleCheckout = () => {
    Swal.fire({
      icon: "success",
      title: "Order placed!",
      text: "Thank you for your purchase.",
      confirmButtonText: "OK",
    });

    const remaining = cartItems.filter((ci) => ci.selected === false);
    setCartItems(remaining);
    localStorage.setItem("cartItems", JSON.stringify(remaining));
  };

  return (
    <div className="cart-container">
      {/* Header */}
      <div className="cart-header">
        <span>
          <input
            className="cart-checkbox"
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
          />{" "}
          Product
        </span>
        <span>Unit Price</span>
        <span>Quantity</span>
        <span>Total Price</span>
        <span>Actions</span>
      </div>

      {/* Body */}
      {cartItems.map((item) => (
        <div className="cart-body" key={item.id}>
          <div className="cart-item">
            <input
              className="cart-checkbox"
              type="checkbox"
              checked={item.selected !== false}
              onChange={() => toggleSelect(item.id)}
            />
            <img src={item.image?.[0]} alt={item.title} />
            <span className="cart-title">{item.title}</span>

            <div className="cart-variation">
              <span
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setOpenVariationId(
                    openVariationId === item.id ? null : item.id
                  )
                }
              >
                Variation:&nbsp;&nbsp;&nbsp;
                <MDBIcon fas icon="caret-down" />
              </span>
              <span>
                {Object.values(item.selectedOptions || {})
                  .filter(Boolean)
                  .join(", ") || "None"}
              </span>

              {openVariationId === item.id && (
                <div className="cart-variation-options">
                  {["Color", "Size", "Power"].map((label) => {
                    const options = item[label.toLowerCase()];
                    if (!options?.length) return null;

                    return (
                      <div className="cart-variation-btnOptions" key={label}>
                        <span>{label}:</span>
                        {options.map((opt, index) => {
                          const selected =
                            (tempSelectedOptions[item.id]?.[label] ??
                              item.selectedOptions?.[label]) === opt;
                          return (
                            <button
                              key={index}
                              className={selected ? "selected" : ""}
                              onClick={() =>
                                handleTempVariationChange(item.id, label, opt)
                              }
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}

                  <div className="cart-variation-confirm">
                    <button onClick={() => confirmVariationSelection(item.id)}>
                      CONFIRM
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="cart-price">
            <span>${(item.price || 0).toFixed(2)}</span>
          </div>

          <div className="cart-quantity">
            <div className="description-quantity-box">
              <button
                className="description-quantity-btn"
                onClick={() => updateQuantity(item.id, -1)}
                disabled={(item.quantity || 1) <= 1}
              >
                –
              </button>
              <input
                type="text"
                value={item.quantity || 1}
                readOnly
                className="description-quantity-input"
              />
              <button
                className="description-quantity-btn"
                onClick={() => updateQuantity(item.id, 1)}
                disabled={(item.quantity || 1) >= (item.stock || Infinity)}
              >
                +
              </button>
            </div>
          </div>

          <div className="cart-totalPrice">
            <span>
              ₱
              {(
                (item.price || 0) *
                (item.quantity || 1) *
                (1 - (item.discount || 0) / 100)
              ).toFixed(2)}
            </span>
          </div>

          <div className="cart-action">
            <button onClick={() => removeItem(item.id)}>Delete</button>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="cart-footer">
        <div className="cart-selectDelete-all">
          <span>
            <input
              className="cart-checkbox"
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
            />
            Select all ({cartItems.length})
          </span>
          <button className="cart-delete-all" onClick={deleteSelected}>
            Delete selected
          </button>
          <button className="cart-delete-all" onClick={deleteAll}>
            Delete all
          </button>
        </div>

        <div className="cart-checkOut-total">
          <div className="cart-checkOut-total-price">
            <div className="cart-checkOut-total-price-item">
              <span>
                Total ({totalQuantity} item{totalQuantity !== 1 && "s"}):
              </span>
              <span>₱{totalPrice.toFixed(2)}</span>
            </div>
            <div className="cart-checkOut-saved">
              <span>Saved</span>
              <span>₱{totalSaved.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="cart-checkOut-button"
            disabled={checkedItems.length === 0}
            onClick={handleCheckout}
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
