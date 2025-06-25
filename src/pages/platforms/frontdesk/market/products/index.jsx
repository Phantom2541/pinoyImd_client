import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import Modal from "./modal";

const Index = () => {
//  

    return (
      
    <MDBAnimation type="bounceInDown">
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <Header />
        <MDBCardBody><Body /></MDBCardBody>
        <Footer />
      </MDBCard>
      <Modal />
    </MDBAnimation>
  );
};

export default Index;
