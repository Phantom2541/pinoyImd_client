import cash from "../../../../../../../assets/paymentMethods/cash.png";
import transfer from "../../../../../../../assets/paymentMethods/transfer.png";
import gcash from "../../../../../../../assets/paymentMethods/gcash.png";
import cheque from "../../../../../../../assets/paymentMethods/cheque.png";
const paymentMethods = [
  {
    text: "Cash",
    img: cash,
    style: { height: "2.6rem" },
  },
  {
    text: "GCash",
    img: gcash,
    style: { height: "2.2rem" },
  },
  {
    text: "Transfer",
    img: transfer,
    style: { height: "2.6rem" },
  },
  { text: "Cheque", img: cheque, style: { height: "1.3rem" } },
];

const utils = {
  paymentMethod: (method) => {
    console.log("method", method);
    return paymentMethods.find(
      ({ text }) => text.toLowerCase() === method.toLowerCase()
    );
  },
};

export default utils;
