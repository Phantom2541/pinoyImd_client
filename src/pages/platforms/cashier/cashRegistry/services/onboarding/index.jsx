import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBAnimation } from "mdbreact";
import { useToasts } from "react-toast-notifications";

import TableLoading from "../../../../../../components/tableLoading";
import Header from "./header";
import Body from "./collapse";
import Footer from "./footer";
import Modal from "./modal";
import { RESET } from "../../../../../../services/redux/slices/commerce/pos/services/deals";
const Collapsable = () => {
  const { isLoading, message, isSuccess } = useSelector(({ deals }) => deals),
    [selected, setSelected] = useState({}),
    [show, setShow] = useState(false),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const toggle = () => setShow(!show);

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
              <Body toggle={toggle} setSelected={setSelected} />
            )}
          </MDBCardBody>
          <Footer />
        </MDBCard>
      </MDBAnimation>
      <Modal selected={selected} show={show} toggle={toggle} />
    </>
  );
};

export default Collapsable;
