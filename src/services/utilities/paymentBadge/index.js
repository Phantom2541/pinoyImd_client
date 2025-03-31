const paymentBadge = (payment) => {
  const options = {
    cash: "default",
    gcash: "primary",
    cheque: "info",
    credit: "warning",
    voucher: "secondary",
  };

  return options[payment];
};

export default paymentBadge;
