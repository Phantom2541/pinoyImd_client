import { useSelector } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TableLoading from "../../../../../../components/tableLoading";
import Header from "./header";
import Body from "./body";

const Index = () => {
  const { isLoading } = useSelector(({ providers }) => providers);

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        </MDBCard>
      </MDBAnimation>
    </>
  );
};

export default Index;
