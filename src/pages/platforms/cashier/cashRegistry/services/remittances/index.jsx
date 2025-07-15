import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBContainer } from "mdbreact";
import "./style.css";
import Header from "./header";
import Calendar from "./calendar";
import { Denomination, Census } from "./modal";
import { BROWSE } from "../../../../../../services/redux/slices/commerce/catalog/menus";
import { BROWSE as DEALS } from "../../../../../../services/redux/slices/commerce/pos/services/deals";
import { Monthly } from "../../../../../../services/redux/slices/finance/journals/payments";

export default function Remmitances() {
  const { activePlatform, token, auth } = useSelector(({ auth }) => auth),
    { month, year } = useSelector(({ remittances }) => remittances),
    dispatch = useDispatch();

  useEffect(() => {
    if (activePlatform?.branchId && token && year && month && auth?._id) {
      const createdAt = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      dispatch(BROWSE({ token, key: { branchId: activePlatform.branchId } }));

      dispatch(
        DEALS({
          token,
          key: {
            branchId: activePlatform.branchId,
            cashierId: auth._id,
            startDate: createdAt.toISOString(), // ✅ FIXED: renamed + string
            endDate: endDate.toISOString(), // ✅ FIXED: string format
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // optional
          },
        })
      );
    }
  }, [activePlatform, dispatch, month, token, year, auth]);

  useEffect(() => {
    //payables
    dispatch(
      Monthly({
        token,
        key: {
          branchId: activePlatform?.branchId,
          cashierId: auth._id,
          month,
          year,
        },
      })
    );
  }, [month, year, token, activePlatform?.branchId, auth._id, dispatch]);

  return (
    <MDBContainer className="pt-2" fluid>
      <MDBCard className="pb-3" narrow>
        <Header />
        <Calendar />
      </MDBCard>
      <Denomination />
      <Census />
    </MDBContainer>
  );
}
