import { useState, useRef, useEffect, useMemo } from "react";
import Header from "./header";
import Cards from "./cards";
import Description from "./desciption";
import Cart from "./cart";
import "./style.css";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import Modal from "./modal";

// import collections from "./collections";

export default function Stocks() {
  const { collections } = useSelector(({ products }) => products);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  // const [sortType, setSortType] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [lastView, setLastView] = useState(null);
  const [lastCard, setLastCard] = useState(null);
  const cartIconRef = useRef(null);
  const [primarySort, setPrimarySort] = useState(""); // quantity or topSales
  const [priceSort, setPriceSort] = useState(""); // priceLowHigh or priceHighLow
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
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

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleSort = (type) => {
    if (type === "quantity" || type === "topSales") {
      setPrimarySort((prev) => (prev === type ? "" : type));
      if (type === "topSales") {
        setPriceSort(""); // Disable price sort if topSales is toggled on
      }
    } else if (type === "priceLowHigh" || type === "priceHighLow") {
      setPriceSort((prev) => (prev === type ? "" : type));
      // Allow price sort even if primarySort is "topSales" – remove that restriction
    }

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

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (ci) =>
          ci.id === item.id &&
          JSON.stringify(ci.selectedOptions || {}) ===
            JSON.stringify(item.selectedOptions || {})
      );

      if (existing) {
        return prev.map((ci) =>
          ci.id === item.id &&
          JSON.stringify(ci.selectedOptions || {}) ===
            JSON.stringify(item.selectedOptions || {})
            ? { ...ci, quantity: ci.quantity + item.quantity }
            : ci
        );
      } else {
        return [...prev, item];
      }
    });
  };

  const handleBuyNow = (item) => {
    Swal.fire({
      icon: "success",
      title: "Order placed!",
      text: `You've successfully ordered ${item.title}.`,
      confirmButtonColor: "#3085d6",
    });
  };

  const filteredCollections = useMemo(() => {
    let filtered = collections.filter(({ pid }) =>
      pid.name.toLowerCase().includes(searchTerm?.toLowerCase())
    );

    if (primarySort === "topSales") {
      filtered.sort((a, b) => b?.sold - a?.sold);
    } else if (primarySort === "quantity") {
      filtered.sort((a, b) => b?.stock - a?.stock);
    }

    if (priceSort === "priceLowHigh") {
      filtered.sort((a, b) => a?.price - b?.price);
    } else if (priceSort === "priceHighLow") {
      filtered.sort((a, b) => b?.price - a?.price);
    }

    return filtered;
  }, [collections, primarySort, priceSort, searchTerm]);

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
        primarySort={primarySort}
        priceSort={priceSort}
        onCartClick={handleCartClick}
        onBack={selectedCard || showCart ? handleBack : null}
        cartIconRef={cartIconRef}
        cartCount={cartItems.length}
      />

      {showCart ? (
        <Cart cartItems={cartItems} setCartItems={setCartItems} />
      ) : selectedCard ? (
        <Description
          card={selectedCard}
          addToCart={handleAddToCart}
          buyNow={handleBuyNow}
        />
      ) : (
        <Cards
          collections={filteredCollections}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onCardClick={handleCardClick}
        />
      )}
      <Modal />
    </div>
  );
}
