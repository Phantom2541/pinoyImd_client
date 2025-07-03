import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TableLoading from "../../../../components/tableLoading";
import Header from "./header";
import Body from "./body";
import Legend from "./legend";

const Index = () => {
  const isLoading = false;

  return (
    <MDBAnimation type="bounceInDown">
      <MDBCard narrow className="pb-3 px-3" style={{ minHeight: "600px" }}>
        <Header />
        <div
          className="template-schedule-container"
          style={{ width: "100%", minHeight: "400px" }}
        >
          {isLoading ? (
            <TableLoading />
          ) : (
            <>
              <Body />
            </>
          )}
        </div>
        <Legend />
      </MDBCard>
    </MDBAnimation>
  );
};

export default Index;
