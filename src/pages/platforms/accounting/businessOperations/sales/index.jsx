import { MDBContainer } from "mdbreact";
import { Payments, Vouchers } from "./summary";
import List from "./list";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Daily } from "../../../../../services/redux/slices/finance/journals/payments";

export default function Deals() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    const date = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    dispatch(
      Daily({
        token,
        key: {
          branchId: activePlatform.branchId,
          date,
        },
      })
    );
  }, []);
  return (
    <MDBContainer className="d-flex" fluid>
      <div className=" py-1 rounded flex-1 ml-2 px-2">
        <List />
      </div>
      <div style={{ width: "300px", marginLeft: "10px" }}>
        <Payments />
        <Vouchers />
      </div>
    </MDBContainer>
  );
}
