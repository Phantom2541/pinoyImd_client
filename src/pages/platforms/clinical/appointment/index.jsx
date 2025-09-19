import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TableLoading from "../../../../components/tableLoading";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import Modal from "./modal/modalEmr";
import VitalSign from "./modal/vitalsigns";
import { BROWSE } from "../../../../services/redux/slices/diagnostics/clinic/appointments";
import PatientModal from "./patient";
import ResultsModal from "./results";
import TransactionModal from "./transaction";

const Index = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { isLoading } = useSelector(({ appointments }) => appointments),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token && activePlatform) {
      const physicianIds =
        activePlatform.branch.physicians?.map(({ _id }) => _id) || [];

      dispatch(
        BROWSE({
          token,
          data: {
            physicianIds,
          },
        })
      );
    }
  }, [dispatch, token, activePlatform]);

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
          <Footer />
        </MDBCard>
      </MDBAnimation>
      <Modal />
      <VitalSign />
      <PatientModal />
      <ResultsModal />
      <TransactionModal />
    </>
  );
};

export default Index;
