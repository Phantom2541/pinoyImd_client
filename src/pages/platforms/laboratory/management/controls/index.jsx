import { MDBCard, MDBContainer } from "mdbreact";
import Header from "./header";
import Body from "./body";
import Modal from "./modal";
import Chart from "./chart";
import Footer from "./footer";

const Controls = () => {
  return (
    <MDBContainer className="d-flex" fluid>
      <div className=" py-1 rounded flex-1 ml-2 px-2">
        <Chart />
      </div>
      <div style={{ width: "350px", marginLeft: "10px" }}>
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <Body />
          <Footer />
        </MDBCard>
      </div>
      <Modal />
    </MDBContainer>
  );
};

export default Controls;
