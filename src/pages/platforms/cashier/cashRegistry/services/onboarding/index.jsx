import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBAnimation } from "mdbreact";

import TableLoading from "../../../../../../components/tableLoading";
import Header from "./header";
import Body from "./collapse";
import Footer from "./footer";
import Modal from "./modal";
import {
  BROWSE,
  SetCOLLECTIONS,
} from "../../../../../../services/redux/slices/commerce/catalog/menus";
const Collapsable = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { isLoading } = useSelector(({ deals }) => deals),
    [selected, setSelected] = useState({}),
    [show, setShow] = useState(false),
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
