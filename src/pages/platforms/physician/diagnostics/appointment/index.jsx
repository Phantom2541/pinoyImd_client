import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBCardBody, MDBAnimation } from "mdbreact";

import TableLoading from "../../../../../components/tableLoading";
import { CHECKUP } from "../../../../../services/redux/slices/diagnostics/clinic/appointments";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import ResultsModal from "../../../clinical/appointment/results";
import Modal from "../../../clinical/appointment/modal/modalEmr";
import VitalSign from "../../../clinical/appointment/modal/vitalsigns";
const Collapsable = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { isLoading } = useSelector(({ appointments }) => appointments),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token && auth) {
      dispatch(
        CHECKUP({
          token,
          data: {
            physicianId: auth._id,
          },
        })
      );
    }
  }, [dispatch, token, auth]);

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
          <Footer />
        </MDBCard>
      </MDBAnimation>
      <ResultsModal />
      <Modal />
      <VitalSign />
    </>
  );
};

export default Collapsable;
