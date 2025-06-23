import { MDBAnimation, MDBCard } from "mdbreact";
// import Header from "./header";
// import Body from "./body";
// import Footer from "./footer";
// import Modal from "./modal";

const Index = () => {
  // const services = useSelector((state) => state.services);
  // const isLoading = services.isLoading;
  // const isSuccess = services.isSuccess;
  // const isError = services.isError;

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          {/* <Header /> */}
          {/* <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody> */}
          {/* <Footer /> */}
        </MDBCard>
      </MDBAnimation>
      {/* <Modal /> */}
    </>
  );
};

export default Index;
