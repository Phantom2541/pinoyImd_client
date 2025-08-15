import { useDispatch, useSelector } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TableLoading from "../../../../../components/tableLoading/index.jsx";
import Header from "./header.jsx";
import Body from "./body.jsx";
import Modal from "./modal.jsx";
import {
  EMPLOYEES,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/personnels.js";
import { useEffect } from "react";
import { employment } from "../../../../../services/utilities/index.js";
// import SignaturePreview from "./signaturePreview";

const Index = () => {
  const { activePlatform, token } = useSelector(({ auth }) => auth),
    { isLoading, selected, willCreate, toggleModal, showModal } = useSelector(
      ({ heads }) => heads
    ),
    dispatch = useDispatch();

  useEffect(() => {
    if (activePlatform?.branchId) {
      const abbr = [...employment.employed].map(({ abbr }) => abbr);
      dispatch(
        EMPLOYEES({ token, params: { branch: activePlatform?.branchId, abbr } })
      );
    }
    return () => dispatch(RESET());
  }, [activePlatform, dispatch, token]);

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        </MDBCard>
      </MDBAnimation>
      <Modal
        selected={selected}
        willCreate={willCreate}
        show={showModal}
        toggle={toggleModal}
      />
    </>
  );
};

export default Index;
