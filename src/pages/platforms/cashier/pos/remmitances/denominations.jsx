import React, { useState } from "react";
import coinImage from "./path-to-your-image.png"; // Update with correct path
import { Denominations } from "../../../../../services/utilities";

const CoinSelector = () => {
  const [selectedCoin, setSelectedCoin] = useState(null);

  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
  };

  const getCoinStyle = (coin) => {
    const positions = {
      1: "0px 0px", // Adjust based on the actual image slice
      5: "-50px 0px",
      10: "-100px 0px",
      20: "-150px 0px",
    };

    return {
      width: "50px",
      height: "50px",
      backgroundImage: `url(${coinImage})`,
      backgroundPosition: positions[coin] || "0px 0px",
      backgroundSize: "cover",
    };
  };

  return (
    <div>
      <h2>Select a Coin:</h2>
      {Denominations.coins.map((coin) => (
        <button key={coin} onClick={() => handleCoinSelect(coin)}>
          {coin} Peso
        </button>
      ))}

      {selectedCoin && (
        <div style={{ marginTop: "20px" }}>
          <h3>Selected Coin: {selectedCoin} Peso</h3>
          <div style={getCoinStyle(selectedCoin)}></div>
        </div>
      )}
    </div>
  );
};

export default CoinSelector;
