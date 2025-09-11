import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBAnimation } from "mdbreact";
import { useToasts } from "react-toast-notifications";
import TableLoading from "../../../../../../../components/tableLoading";
import Header from "./header";
import Body from "./collapse";
import Footer from "./footer";
import Modal from "./modal/index";
import {
  BROWSE,
  SetCOLLECTIONS,
} from "../../../../../../../services/redux/slices/commerce/catalog/menus";
import { RESET } from "../../../../../../../services/redux/slices/commerce/pos/services/deals";
import Translate from "./collapse/bodySwitcher/validation/translate";
import Approval from "../approval";
const Collapsable = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { isLoading, message, isSuccess } = useSelector(
      ({ onBoardings }) => onBoardings
    ),
    [selected, setSelected] = useState({}),
    [show, setShow] = useState(false),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const toggle = () => setShow(!show);

  useEffect(() => {
    const branchId = activePlatform.branchId;
    const storedMenus = localStorage.getItem(`menus_${branchId}`);
    if (storedMenus) {
      const menus = JSON.parse(storedMenus);
      dispatch(SetCOLLECTIONS(menus));
    } else {
      dispatch(
        BROWSE({
          token,
          key: { branchId },
        })
      )
        .then(({ payload }) => {
          // Assuming the response contains the menus data in 'payload'
          const menus = payload.payload;

          // Store the fetched data in localStorage for future use
          localStorage.setItem(`menus_${branchId}`, JSON.stringify(menus));
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  }, [token, activePlatform?.branchId, dispatch]);

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
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>
            {isLoading ? (
              <TableLoading />
            ) : (
              <Body
                toggle={toggle}
                setSelected={setSelected}
                selected={selected}
              />
            )}
          </MDBCardBody>
          <Footer />
        </MDBCard>
      </MDBAnimation>
      <Approval />
      {/* <Modal /> */}
      <Translate />
    </>
  );
};

export default Collapsable;
