import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBAnimation } from "mdbreact";

import TableLoading from "../../../../../components/tableLoading";
import Header from "./header";
import Body from "./collapse";
import Footer from "./footer";
const Collapsable = () => {
  const { token } = useSelector(({ auth }) => auth),
    { isLoading } = useSelector(({ appointments }) => appointments);

  console.log("token", token);

  return (
    <MDBAnimation type="bounceInDown">
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <Header />
        <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        <Footer />
      </MDBCard>
    </MDBAnimation>
  );
};

export default Collapsable;
