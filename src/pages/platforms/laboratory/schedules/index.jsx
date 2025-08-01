import { MDBCard } from "mdbreact";
import { useToasts } from "react-toast-notifications";

import "./style.css";
import Header from "./header";
import Body from "./body";
import Modal from "./modal";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RESET } from "../../../../services/redux/slices/finance/bookkeeping/duties";
import TableLoading from "../../../../components/tableLoading";
export default function Schedules() {
  const { message, isSuccess, isLoading } = useSelector(({ duties }) => duties);
  const { addToast } = useToasts(),
    dispatch = useDispatch();
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);
  return (
    <MDBCard narrow>
      <Header />
      {isLoading ? <TableLoading /> : <Body />}
      <Modal />
    </MDBCard>
  );
}
