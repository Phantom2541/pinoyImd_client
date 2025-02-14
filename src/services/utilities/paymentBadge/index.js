const paymentBadge = (payment) => {
  const options = {
    cash: 'default',
    gcash: 'primary',
    cheque: 'info',
    credit: 'warning',
  };

  return options[payment];
};

export default paymentBadge;
