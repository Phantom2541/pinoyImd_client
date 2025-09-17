const individual = (menu) => {
  const { srp = 0, qty = 1 } = menu;
  const gross = srp * qty;

  return {
    gross,
    up: srp,
    discount: 0,
  };
};

const computeCP = (menu) => {
  if (!Array.isArray(menu)) return individual(menu);

  const accumulator = {
    gross: 0,
    discount: 0,
  };

  for (const item of menu) {
    const { gross = 0, discount = 0 } = individual(item);
    accumulator.gross += gross;
    accumulator.discount += discount;
  }

  return { ...accumulator, net: accumulator.gross - accumulator.discount };
};

export default computeCP;
