import { useDispatch, useSelector } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { RESET } from "../../../../../services/redux/slices/finance/journals/soa";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import PaymentModal from "./modal";
import TableLoading from "../../../../../components/tableLoading";

const Index = () => {
  const { isLoading, message, isSuccess } = useSelector(({ soa }) => soa),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  useEffect(() => {
    message &&
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);
  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
          <Footer />
        </MDBCard>
      </MDBAnimation>
      <PaymentModal />
    </>
  );
};

export default Index;
