import { useDispatch, useSelector } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import Header from "./header";
import Body from "./body";
import TableLoading from "../../../../../components/tableLoading";
import Modal from "../tasks/modal";
import { useEffect } from "react";
/**
 * For refrences to the following deals
 */
import {
  HEADS,
  SetHEADS,
} from "../../../../../services/redux/slices/diagnostics/laboratory/validator";
import {
  BROWSE,
  SetPREFERENCES,
  RESET as PREFRESET,
} from "../../../../../services/redux/slices/diagnostics/laboratory/preferences";
import {
  BROWSE as PHYSICIANS,
  RESET as PHYRESET,
} from "../../../../../services/redux/slices/assets/persons/physicians";

const Sendouts = () => {
  const { isLoading } = useSelector(({ onBoardings }) => onBoardings),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      const branchId = activePlatform.branchId;
      const prefData = localStorage.getItem(`preferences`);
      const headsData = localStorage.getItem(`heads-${branchId}`);
      if (prefData) {
        dispatch(SetPREFERENCES(JSON.parse(prefData)));
      } else if (token && activePlatform?.branchId) {
        dispatch(
          BROWSE({
            token,
            branchId: activePlatform.branchId,
          })
        );
      }

      if (headsData) {
        dispatch(SetHEADS(JSON.parse(headsData)));
      } else {
        dispatch(HEADS({ token, branchId })).then((res) => {
          if (res?.payload) {
            localStorage.setItem(
              `heads-${branchId}`,
              JSON.stringify(res.payload?.payload)
            );
          }
        });
      }

      dispatch(PHYSICIANS({ token, branchId })).then((res) => {
        if (res?.payload) {
          localStorage.setItem(
            `physicians`,
            JSON.stringify(res.payload?.payload)
          );
        }
      });

      return () => {
        dispatch(PREFRESET());
        dispatch(PHYRESET());
      };
    }
  }, [token, dispatch, activePlatform]);

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        </MDBCard>
      </MDBAnimation>
      <Modal />
    </>
  );
};

export default Sendouts;
