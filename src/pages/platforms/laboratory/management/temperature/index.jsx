import { MDBCard, MDBContainer, MDBAnimation } from "mdbreact";
import Header from "./header";
import Calendar from "./calendar";
import "./style.css";

export default function Temperature() {
  return (
    <MDBAnimation type="bounceInDown">
      <MDBContainer className="d-grid" fluid>
        <MDBCard className="pb-3 " narrow>
          <Header />
          <Calendar />
        </MDBCard>
      </MDBContainer>
    </MDBAnimation>
  );
}
