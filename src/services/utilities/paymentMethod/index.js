import cash from "../../../assets/paymentMethods/cash-edited.png";
import transfer from "../../../assets/paymentMethods/transfer.png";
import gcash from "../../../assets/paymentMethods/gcash-edited.png";
import cheque from "../../../assets/paymentMethods/cheque.png";
import voucher from "../../../assets/paymentMethods/voucher.png";
const paymentMethods = [
  {
    text: "Cash",
    img: cash,
    style: { height: "0.7rem" },
  },
  {
    text: "GCash",
    img: gcash,
    style: { height: "0.8rem" },
  },
  {
    text: "Transfer",
    img: transfer,
    style: { height: "2.6rem" },
  },
  { text: "Cheque", img: cheque, style: { height: "1.3rem" } },
  {
    text: "Voucher",
    img: voucher,
    style: { height: "1rem", marginTop: "0.2rem", marginBottom: "0.2rem" },
  },
];

const paymentMethod = {
  getImage: (method) => {
    return paymentMethods.find(
      ({ text }) => text.toLowerCase() === method.toLowerCase()
    );
  },
};

export default paymentMethod;
