import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBContainer } from "mdbreact";
import "./style.css";
import Header from "./header";
import Calendar from "./calendar";
import { Denomination, Census } from "./modal";
import { BROWSE } from "../../../../../../services/redux/slices/commerce/catalog/menus";
import { BROWSE as DEALS } from "../../../../../../services/redux/slices/commerce/pos/services/deals";

export default function Remmitances() {
  const { activePlatform, token, auth } = useSelector(({ auth }) => auth),
    { month, year } = useSelector(({ remittances }) => remittances),
    dispatch = useDispatch();

  useEffect(() => {
    if (activePlatform?.branchId) {
      dispatch(BROWSE({ token, key: { branchId: activePlatform?.branchId } }));
      const createdAt = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      dispatch(
        DEALS({
          token,
          key: {
            branchId: activePlatform?.branchId,
            department: activePlatform?.department,
            cashierId: auth._id,
            createdAt,
            endDate,
          },
        })
      );
    }
  }, [activePlatform, dispatch, month, token, year, auth]);

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
