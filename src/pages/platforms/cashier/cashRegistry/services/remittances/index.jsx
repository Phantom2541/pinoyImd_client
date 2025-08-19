import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBContainer } from "mdbreact";
import "./style.css";
import Header from "./header";
import Calendar from "./calendar";
import { Denomination, Census } from "./modal";
import { BROWSE } from "../../../../../../services/redux/slices/commerce/catalog/menus";
import {
  BROWSE as DEALS,
  RESET,
} from "../../../../../../services/redux/slices/commerce/pos/services/deals";
import { Monthly } from "../../../../../../services/redux/slices/finance/journals/payments";
import { over } from "lodash";

export default function Remmitances() {
  const { activePlatform, token, auth } = useSelector(({ auth }) => auth),
    { month, year } = useSelector(({ remittances }) => remittances),
    dispatch = useDispatch();
  const containerRef = useRef(null);

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
    return () => dispatch(RESET());
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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let isDown = false;
    let startX, scrollLeft;

    const mouseDown = (e) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const mouseUp = () => {
      isDown = false;
    };
    const mouseLeave = () => {
      isDown = false;
    };

    const mouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = x - startX;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", mouseDown);
    el.addEventListener("mouseup", mouseUp);
    el.addEventListener("mouseleave", mouseLeave);
    el.addEventListener("mousemove", mouseMove);

    return () => {
      el.removeEventListener("mousedown", mouseDown);
      el.removeEventListener("mouseup", mouseUp);
      el.removeEventListener("mouseleave", mouseLeave);
      el.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return (
    <MDBContainer fluid>
      <MDBCard className="pb-3" narrow>
        <Header />
        <div style={{ overflow: "auto" }} ref={containerRef}>
          <Calendar />
        </div>
      </MDBCard>
      <Denomination />
      <Census />
    </MDBContainer>
  );
}
