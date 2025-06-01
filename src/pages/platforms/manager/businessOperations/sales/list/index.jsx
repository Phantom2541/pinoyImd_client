import { useSelector } from "react-redux";
import { MDBCard } from "mdbreact";

import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import TableLoading from "../../../../../../components/tableLoading";
import RevertSale from "./revert";
import Discount from "./discount";
export default function Sales() {
  const { isLoading } = useSelector(({ deals }) => deals);
  return (
    <>
      <MDBCard narrow>
        <Header />
        {/* <h5 className="text-right">₱10,880 @ 13 Patient/s</h5> */}
        {isLoading ? <TableLoading /> : <Body />}
        <Footer />
      </MDBCard>
      <RevertSale />
      <Discount />
    </>
  );
}
