import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBAnimation } from "mdbreact";
import Header from "./header";
import TableLoading from "../../../../../components/tableLoading";
import Body from "./body";
import Footer from "./footer";
import Modal from "./modal";
const Index = () => {
  const { isLoading } = useSelector(({ companies }) => companies);

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3 mt-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>{!isLoading ? <Body /> : <TableLoading />}</MDBCardBody>
          <Footer />
        </MDBCard>
      </MDBAnimation>
      <Modal />
    </>
  );
};

export default Index;
