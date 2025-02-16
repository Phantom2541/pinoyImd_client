import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Platforms from "./pages/platforms";
import Home from "./pages/home";
import { useDispatch, useSelector } from "react-redux";
import { VALIDATEREFRESH } from "./services/redux/slices/assets/persons/auth";
import ClaimStub from "./components/claimStub";
import RequestForm from "./components/requestFormNew";
import TaskPrintout from "./components/taskPrintout";
import ChemLog from "./components/logbookPrintout/chemistry";
import ElecLog from "./components/logbookPrintout/electrolytes";
import HemaLog from "./components/logbookPrintout/hematology";
import FecaLog from "./components/logbookPrintout/fecalysis";
import SeroLog from "./components/logbookPrintout/serology";
import UrinLog from "./components/logbookPrintout/urinalysis";
import TempGraph from "./components/monitoring/temperature";
import QcGraph from "./components/monitoring/qc";
import Census from "./components/census/services";
import Reagent from "./components/census/reagent";
import FAQ from "./pages/others/faq";
import "./App.css";
import "./animations.css";
import Payslip from "./pages/platforms/manager/responsibilities/payslip";
import PersonnelPrintOut from "./components/personnelPrintOut";

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
      <Route path="/printout/TempGraph" exact component={TempGraph} />

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

      <Route path="/printout/task" exact component={TaskPrintout} />
      <Route path="/printout/payslip" exact component={Payslip} />
      <Route path="/printout/personnel" exact component={PersonnelPrintOut} />
      <Platforms />
    </Switch>
  );
}
