import { MDBCard } from "mdbreact";
import "./style.css";
import Header from "./header";
import Body from "./body";
import Modal from "./modal";
export default function Schedules() {
  return (
    <MDBCard narrow>
      <Header />
      <Body />
      <Modal />
    </MDBCard>
  );
}
