import Split from "./split";
import Voucher from "./voucher";

const Payment = ({
  payment,
  refNo,
  chargeAmount = 0,
  isMixed = false,
  setRefNo = () => {},
}) => {
  const paymentMap = {
    mixed: Split,
    voucher: Voucher,
  };
  const Blank = () => <div>{payment} is not available</div>;
  const Component = paymentMap[payment] || Blank;
  return (
    <Component
      refNo={refNo}
      setRefNo={setRefNo}
      isMixed={isMixed}
      chargeAmount={chargeAmount}
    />
  );
};

export default Payment;
