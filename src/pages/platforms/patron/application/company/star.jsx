import React, { useState } from "react";

const StarRating = () => {
  const [rating, setRating] = useState(0); // locked rating
  const [hover, setHover] = useState(null); // hover preview

  const handleMouseMove = (e) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const percent = x / width;
    const value = Math.round(percent * 20) / 4; // round to nearest 0.25
    setHover(value);
  };

  const handleClick = () => {
    if (hover !== null) setRating(hover);
  };

  const displayRating = hover ?? rating;
  const percentage = `${(displayRating / 5) * 100}%`;

  return (
    <div
      className="star-rating"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHover(null)}
      onClick={handleClick}
    >
      <div className="star-back">★★★★★</div>
      <div className="star-front" style={{ width: percentage }}>
        ★★★★★
      </div>
    </div>
  );
};

export default StarRating;
