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
  ChartPrintout,
  RequestForm,
  TempGraph,
  PersonnelPrintOut,
  LabTaskPrintout,
  RadTaskPrintout,
  ResecoPrintout,
  HemaLog,
  UrinLog,
  FecaLog,
  SeroLog,
  MiscLog,
  RequestOutSource,
  SOA,
  Remittance,
  Machines,
  DrugTestPrintout,
  RequestFormPrint,
  RequestClearancePrint,
} from "./components/printout";
import Payslip from "./components/printout/payslip";
import Census from "./components/census/services";
import FAQ from "./pages/others/faq";
import Portal from "./pages/emr/portal";
import Subscribers from "./pages/subscribers";
import Staff from "./components/printout/staff";
import AttendancePrint from "./components/printout/dtr";
import DutyPrintout from "./components/printout/duty";

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
      <Route path="/printout/chart" exact component={ChartPrintout} />
      <Route
        path="/printout/laboratoryRequestForm"
        exact
        component={RequestFormPrint}
      />
      <Route
        path="/printout/laboratoryClearanceRequestForm"
        exact
        component={RequestClearancePrint}
      />
      <Route
        path="/printout/request/outsource"
        exact
        component={RequestOutSource}
      />
      <Route path="/printout/temperature/graph" exact component={TempGraph} />

      {/* Logbooks */}
      <Route path="/printout/chem" exact component={ChemLog} />
      <Route path="/printout/hema" exact component={HemaLog} />
      <Route path="/printout/urin" exact component={UrinLog} />
      <Route path="/printout/feca" exact component={FecaLog} />
      <Route path="/printout/sero" exact component={SeroLog} />
      <Route path="/printout/misc" exact component={MiscLog} />
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
        path="/printout/laboratory/drugtest"
        exact
        component={DrugTestPrintout}
      />
      <Route
        path="/printout/radiology/task"
        exact
        component={RadTaskPrintout}
      />
      <Route path="/printout/duty" exact component={DutyPrintout} />
      <Route path="/printout/payslip" exact component={Payslip} />
      <Route path="/printout/personnel" exact component={PersonnelPrintOut} />
      <Route path="/printout/soa" exact component={SOA} />
      <Route path="/printout/remittance" exact component={Remittance} />

      <Route path="/printout/machines" exact component={Machines} />
      <Route path="/printout/staffs" exact component={Staff} />
      <Route path="/printout/Attendances" exact component={AttendancePrint} />
      {/* Diagnostic Portal */}
      <Route path="/emr/portal/:companyId/:dealId" exact component={Portal} />
      <Route path="/subscribers/:companyId" exact component={Subscribers} />

      <Platforms />
    </Switch>
  );
}
