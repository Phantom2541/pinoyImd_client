import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody } from "mdbreact";
import TableLoading from "../../../../../../../../components/tableLoading";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import Modal from "./modal";
import ServicesModal from "./services/modal";

const Configure = () => {
  const { isLoading } = useSelector(({ machines }) => machines);

  return (
    <>
      <MDBCard narrow className="pb-3" style={{ minHeight: "500px" }}>
        <Header />
        <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        <Footer />
      </MDBCard>
      <Modal />
      <ServicesModal />
    </>
  );
};

export default Configure;
