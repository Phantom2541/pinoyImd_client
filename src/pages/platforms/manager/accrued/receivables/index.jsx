import { useSelector } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TableLoading from "../../../../../components/tableLoading";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import PaymentModal from "./payments";

const Index = () => {
  const { isLoading } = useSelector(({ soa }) => soa);

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
          <Footer />
        </MDBCard>
      </MDBAnimation>
      <PaymentModal />
    </>
  );
};

export default Index;
