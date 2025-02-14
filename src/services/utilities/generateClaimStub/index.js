const generateStub = (sale) => ({
  ...sale,
  customer: {
    fullName: sale.customerId?.fullName,
    address: `${
      sale.customerId?.address?.barangay &&
      `${sale.customerId?.address?.barangay}, `
    }${sale.customerId?.address?.city}`,
  },
  cashier: sale.cashierId?.fullName,
  cart: sale.cart,
});

const generateClaimStub = (selected) => {
  localStorage.setItem("claimStub", JSON.stringify(generateStub(selected)));
  window.open(
    "/printout/claimstub",
    "Claim Stub",
    "top=100px,left=100px,width=550px,height=750px"
  );
};

export default generateClaimStub;
