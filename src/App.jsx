import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import "./animations.css";
import Platforms from "./pages/platforms";
import Home from "./pages/home";
import { useDispatch, useSelector } from "react-redux";
import { VALIDATEREFRESH } from "./services/redux/slices/assets/persons/auth";
import {
  ClaimStub,
  ChemLog,
  RequestForm,
  TempGraph,
  PersonnelPrintOut,
  LabTaskPrintout,
  RadTaskPrintout,
  ResecoPrintout,
  ElecLog,
  HemaLog,
  UrinLog,
  FecaLog,
  SeroLog,
  RequestOutSource,
  SOA,
} from "./components/printout";
import Payslip from "./components/printout/payslip";
import Census from "./components/census/services";
import FAQ from "./pages/others/faq";
import Portal from "./pages/emr/portal";

export default function App() {
  const { auth, token, isOnline } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    if (!auth._id && token && isOnline) {
      dispatch(VALIDATEREFRESH(token));
    }
  }, [auth, token, isOnline, dispatch]);

  return (
    <Switch>
      <Route path="/" exact component={Home} />
      {/* Frequent Ask Questions */}
      <Route path="/printout/FAQ" exact component={FAQ} />
      <Route path="/printout/claimstub" exact component={ClaimStub} />
      <Route path="/printout/request/form" exact component={RequestForm} />
      <Route
        path="/printout/request/outsource"
        exact
        component={RequestOutSource}
      />
      <Route path="/printout/temperature/graph" exact component={TempGraph} />

      {/* Logbooks */}
      <Route path="/printout/chem" exact component={ChemLog} />
      <Route path="/printout/elec" exact component={ElecLog} />
      <Route path="/printout/hema" exact component={HemaLog} />
      <Route path="/printout/urin" exact component={UrinLog} />
      <Route path="/printout/feca" exact component={FecaLog} />
      <Route path="/printout/sero" exact component={SeroLog} />

      <Route
        path="/printout/census?month=:month&year:year"
        exact
        component={Census}
      />

      <Route path="/printout/reseco" exact component={ResecoPrintout} />
      <Route
        path="/printout/laboratory/task"
        exact
        component={LabTaskPrintout}
      />
      <Route
        path="/printout/radiology/task"
        exact
        component={RadTaskPrintout}
      />
      <Route path="/printout/payslip" exact component={Payslip} />
      <Route path="/printout/personnel" exact component={PersonnelPrintOut} />
      <Route path="/printout/soa" exact component={SOA} />

      {/* Diagnostic Portal */}
      <Route path="/emr/portal/:dealId" exact component={Portal} />
      <Platforms />
    </Switch>
  );
}
