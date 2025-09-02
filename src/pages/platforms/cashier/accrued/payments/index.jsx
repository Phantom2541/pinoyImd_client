import { useDispatch, useSelector } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TopHeader from "./header";
import Body from "./components/collapse";
import TableLoading from "../../../../../components/tableLoading/index.jsx";
import { useEffect, useState } from "react";
import Modal from "./modal.jsx";
import {
  BROWSE as PROVIDERS,
  RESET as PROVIDERRESET,
} from "../../../../../services/redux/slices/assets/providers";
export default function Payables() {
  const { activePlatform, token } = useSelector(({ auth }) => auth);
  const { isLoading } = useSelector(({ payments }) => payments);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        PROVIDERS({
          token,
          key: {
            clients: activePlatform?.branchId,
            category: ["expenses"], // utilities", "suppliers
            status: "approved",
          },
        })
      );
    }
    return () => {
      dispatch(PROVIDERRESET());
    };
  }, [token, activePlatform, dispatch]);
  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "500px" }}>
          <TopHeader setShow={setShow} />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        </MDBCard>
      </MDBAnimation>
      <Modal show={show} toggle={() => setShow(!show)} />
    </>
  );
}
