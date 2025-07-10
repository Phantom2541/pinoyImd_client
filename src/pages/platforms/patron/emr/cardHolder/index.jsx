import { useSelector } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TableLoading from "../../../../../components/tableLoading";
import Header from "./header";
import Body from "./body";
// import Footer from "./footer";
// import Modal from "./modal";

const Index = () => {
  const { isLoading } = useSelector(({ cardHolder }) => cardHolder);

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow style={{ minHeight: "500px" }}>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
          {/* <Footer /> */}
        </MDBCard>
      </MDBAnimation>
      {/* <Modal /> */}
    </>
  );
};

export default Index;
