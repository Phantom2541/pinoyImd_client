const Denominations = {
  coins: [1, 5, 10, 20],
  bills: [20, 50, 100, 200, 500, 1000],
};

const billPositions = {
  20: "-2px -3px",
  50: "-302px 0px",
  100: "0px -126px",
  200: "-310px -127px",
  500: "0px -253px",
  1000: "-308px -253px",
};

const coinPositions = {
  1: "-182px -324px",
  5: "-235px -317px",
  10: "-300px -314px",
  20: "-368px -310px",
};

const coinSize = {
  1: "51px",
  5: "60px",
  10: "64px",
  20: "68px",
};

const coinImage = `${process.env.PUBLIC_URL}/assets/denominations.png`;

const Currency = {
  Denominations,

  /**
   * Returns the CSS style object for a bill denomination.
   *
   * @param {number} bill - The denomination of the bill.
   * @returns {object} The style object containing size, background image, position, and other style properties for the bill.
   */

  getBill: (bill) => ({
    width: "300px",
    height: "126px",
    backgroundImage: `url(${coinImage})`,
    backgroundPosition: billPositions[bill] || "0px 0px",
    backgroundSize: "610px auto",
    backgroundRepeat: "no-repeat",
    display: "block",
  }),

  /**
   * Returns the style object for a coin image.
   *
   * @param {number} coin - The denomination of the coin.
   * @returns {object} A style object containing the dimensions, background image,
   * background position, background size, display property, and border radius for the coin.
   */

  getCoin: (coin) => ({
    width: coinSize[coin],
    height: coinSize[coin],
    backgroundImage: `url(${coinImage})`,
    backgroundPosition: coinPositions[coin] || "0px 0px",
    backgroundSize: "500px auto",
    display: "block",
    borderRadius: "50%",
  }),

  /**
   * Format a number as a currency string in the format " 0"
   *
   * @param {number} num - The number to format. Defaults to 0.
   * @returns {string} The formatted string.
   */
  format: (num = 0) => {
    if (!num) return "-";

    return num.toLocaleString("en-US", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  },
};

export default Currency;
