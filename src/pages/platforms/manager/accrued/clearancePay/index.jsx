import { MDBCard, MDBCardBody } from "mdbreact";
import Body from "./tables";
import Header from "./header";
import Modal from "./modal";
import { useSelector } from "react-redux";
import TableLoading from "../../../../../components/tableLoading";

export default function ClearancePay() {
  const { isLoading } = useSelector(({ personnels }) => personnels);
  return (
    <>
      <MDBCard narrow className="pb-3">
        <Header />
        <MDBCardBody>{!isLoading ? <Body /> : <TableLoading />}</MDBCardBody>
      </MDBCard>
      <Modal />
    </>
  );
}
