import React, { useEffect } from "react";

export default function Cart({ cartItems, setCartItems }) {
  // Ensure every item has selected flag defaulting to true
  useEffect(() => {
    const fixed = cartItems.map((ci) =>
      ci.selected === undefined ? { ...ci, selected: true } : ci
    );
    if (JSON.stringify(fixed) !== JSON.stringify(cartItems)) {
      setCartItems(fixed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helpers
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

  const allSelected = cartItems.every((ci) => ci.selected !== false);
  const toggleSelectAll = () => {
    setCartItems((prev) =>
      prev.map((ci) => ({ ...ci, selected: !allSelected }))
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

  // Only include checked/selected items for totals
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

  return (
    <div className="cart-container">
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
            <span>{item.title}</span>
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
              $
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

      <div className="cart-footer">
        <div className="cart-selectDelete-all">
          <span>
            <input
              className="cart-checkbox"
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
            />{" "}
            Select all ({totalQuantity})
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
                Total ({totalQuantity} item
                {totalQuantity !== 1 && "s"}):
              </span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="cart-checkOut-saved">
              <span>Saved</span>
              <span>${totalSaved.toFixed(2)}</span>
            </div>
          </div>
          <button
            className="cart-checkOut-button"
            disabled={checkedItems.length === 0}
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
