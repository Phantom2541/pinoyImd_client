import React, { useRef, useEffect, useState } from "react";
import Card from "./card";

export default function Carousel({
  label,
  array = [],
  handleCashRegister,
  handleUpdate,
  handlePatronHistory,
}) {
  const carouselRef = useRef(null);
  const [grabbed, setGrabbed] = useState(false);
  const [startX, setStartX] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalItems = 5;

  useEffect(() => {
    const carouselCurrent = carouselRef.current;

    const handleMouseUp = () => {
      if (!grabbed) return;
      setGrabbed(false);
      carouselCurrent.style.scrollBehavior = "smooth";
    };

    const handleMouseMove = (e) => {
      if (!grabbed) return;
      e.preventDefault();
      const x = e.pageX - carouselCurrent.offsetLeft;
      const walk = (x - startX) * 2;
      carouselCurrent.scrollLeft = scrollLeft - walk;
    };

    const handleScroll = () => {
      const { scrollWidth, clientWidth } = carouselRef.current;
      const newIndex = Math.round(
        (carouselRef.current.scrollLeft / (scrollWidth - clientWidth)) *
          (totalItems - 1)
      );
      setActiveIndex(newIndex);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    carouselCurrent.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
      carouselCurrent.removeEventListener("scroll", handleScroll);
    };
  }, [grabbed, startX, scrollLeft]);

  const handleMouseDown = (e) => {
    setGrabbed(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    carouselRef.current.style.scrollBehavior = "auto";
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
    carouselRef.current.style.scrollBehavior = "smooth";
    carouselRef.current.scrollLeft =
      (index / (totalItems - 1)) *
      (carouselRef.current.scrollWidth - carouselRef.current.clientWidth);
  };

  const renderDots = () => {
    return Array.from({ length: totalItems }, (_, i) => (
      <span
        key={i}
        className={`dot ${i === activeIndex ? "active" : ""}`}
        onClick={() => handleDotClick(i)}
      />
    ));
  };

  return (
    <div className="cashier-carousel my-3">
      <h4 className="mb-0">
        ({array.length}) {label}
      </h4>
      <div
        className="cashier-carousel-box"
        ref={carouselRef}
        onMouseDown={handleMouseDown}
      >
        {array.map((user) => (
          <Card
            key={user?._id}
            user={user}
            handleCashRegister={handleCashRegister}
            handleUpdate={handleUpdate}
            handlePatronHistory={handlePatronHistory}
          />
        ))}
      </div>
      {array.length > 4 && <div className="dots-container">{renderDots()}</div>}
    </div>
  );
}
