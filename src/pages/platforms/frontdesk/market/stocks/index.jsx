import React, { useState, useRef, useEffect } from "react";
import Header from "./header";
import Cards from "./cards";
import Description from "./desciption";
import Cart from "./cart";
import "./style.css";
import collections from "./collections";

export default function Stocks() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [lastView, setLastView] = useState(null);
  const [lastCard, setLastCard] = useState(null);

  const cartIconRef = useRef(null);

  const handleSort = (type) => {
    setSortType(type);
    setCurrentPage(1);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCartClick = () => {
    setLastView(selectedCard ? "desc" : "list");
    setLastCard(selectedCard);
    setShowCart(true);
  };

  const handleCardClick = (card) => {
    setLastView(showCart ? "cart" : "list");
    setLastCard(null);
    setSelectedCard(card);
    setShowCart(false);
  };

  const handleBack = () => {
    if (showCart) {
      setShowCart(false);
      if (lastView === "desc" && lastCard) {
        setSelectedCard(lastCard);
      }
    } else if (selectedCard) {
      setSelectedCard(null);
    }
  };

  // load cart with quantities
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter((ci) => ci && typeof ci === "object" && ci.id != null)
        .map((ci) => ({
          ...ci,
          quantity: Math.max(1, ci.quantity ?? 1),
        }));
    } catch (e) {
      console.warn("Invalid cartItems in localStorage:", e);
      return [];
    }
  });

  // persist whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // helper to add item (increments quantity if exists)
  const addToCart = (imgRef, item) => {
    handleAddToCartAnimation(imgRef); // ✈️ animate only

    setCartItems((prev) => {
      const existing = prev.find((ci) => ci?.id === item.id);

      if (existing) {
        return prev.map((ci) =>
          ci.id === item.id
            ? {
                ...ci,
                quantity: Math.min(
                  (ci.quantity ?? 1) + 1,
                  item.stock ?? Infinity // cap to stock
                ),
              }
            : ci
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // 💥 Fly to cart animation
  const handleAddToCartAnimation = (imgRef) => {
    if (!imgRef?.current || !cartIconRef?.current) return;

    const img = imgRef.current;
    const cart = cartIconRef.current;
    const imgRect = img.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();

    const clone = img.cloneNode(true);
    clone.classList.add("fly-to-cart");
    clone.style.position = "fixed";
    clone.style.top = `${imgRect.top}px`;
    clone.style.left = `${imgRect.left}px`;
    clone.style.width = `${imgRect.width}px`;
    clone.style.height = `${imgRect.height}px`;
    clone.style.transition = "all 0.8s ease-in-out";
    clone.style.zIndex = 1000;
    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      clone.style.top = `${cartRect.top}px`;
      clone.style.left = `${cartRect.left}px`;
      clone.style.width = "20px";
      clone.style.height = "20px";
      clone.style.opacity = "0.5";
    });

    setTimeout(() => {
      document.body.removeChild(clone);
    }, 800);
  };

  // 🔍 Filtering and sorting...
  let filteredCollections = collections.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  switch (sortType) {
    case "quantity":
      filteredCollections.sort((a, b) => b.stock - a.stock);
      break;
    case "topSales":
      filteredCollections.sort((a, b) => b.sold - a.sold);
      break;
    case "priceLowHigh":
      filteredCollections.sort((a, b) => a.price - b.price);
      break;
    case "priceHighLow":
      filteredCollections.sort((a, b) => b.price - a.price);
      break;
    default:
      break;
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center flex-column"
      style={{
        maxWidth: "77%",
        margin: "0 auto",
        gap: "10px",
        minWidth: "1040px",
      }}
    >
      <Header
        hideSort={!!selectedCard || showCart}
        onSearch={handleSearch}
        onSort={handleSort}
        sortType={sortType}
        onCartClick={handleCartClick}
        onBack={selectedCard || showCart ? handleBack : null}
        cartIconRef={cartIconRef}
        cartCount={cartItems.length}
      />

      {showCart ? (
        <Cart cartItems={cartItems} setCartItems={setCartItems} />
      ) : selectedCard ? (
        <Description card={selectedCard} />
      ) : (
        <Cards
          collections={filteredCollections}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          onCardClick={handleCardClick}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}
