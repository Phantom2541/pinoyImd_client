import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBContainer } from "mdbreact";
import "./style.css";
import Header from "./header";
import Calendar from "./calendar";
import { Denomination, Census } from "./modal";
import { BROWSE } from "../../../../../../services/redux/slices/commerce/catalog/menus";

export default function Remmitances() {
  const { activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    if (activePlatform?.branchId) {
      dispatch(BROWSE({ key: { branchId: activePlatform?.branchId } }));
    }
  }, [activePlatform, dispatch]);

  return (
    <MDBContainer className="d-grid" fluid>
      <MDBCard className="pb-3" narrow>
        <Header />
        <Calendar />
      </MDBCard>
      <Denomination />
      <Census />
    </MDBContainer>
  );
}
