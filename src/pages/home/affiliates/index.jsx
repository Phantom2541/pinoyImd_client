import React from "react";
import "swiper/css";
import "./style.css";
import DiagnosticsSubs from "./diagnosticsSubs";
import SuppliersSubs from "./suppliersSubs";
import BetaTester from "./betaTester";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../services/redux/slices/assets/companies";

export default function Affiliates() {
  const dispatch = useDispatch();
  const { token } = useSelector(({ auth }) => auth);
  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [dispatch, token]);
  return (
    <div className="homePage-affiliates">
      <div className="subscriber-bg-img">
        <div className="subscriber-bg-mask" />
      </div>
      <DiagnosticsSubs />
      <SuppliersSubs />
      <BetaTester />
    </div>
  );
}
