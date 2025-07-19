import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  SearchServices as Services,
  SearchTemplates as Templates,
} from "../../../../../../components/searchables";
import {
  RESET,
  BROWSE,
  SetSERVICES,
  SetMONTH,
  ResetDATE,
} from "../../../../../../services/redux/slices/diagnostics/management/controls";
import CalendarPicker from "../../../../../../components/header/calendars";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { month, year, filtered } = useSelector(({ controls }) => controls);
  const [template, setTemplate] = useState(1);
  const dispatch = useDispatch();
  console.log("biltered", filtered);

  // Get unique templates and services that have data
  const availableTemplates = useMemo(() => {
    const ids = new Set(filtered.map((item) => item.templateId));
    return Array.from(ids);
  }, [filtered]);

  const availableServices = useMemo(() => {
    const ids = new Set(filtered.map((item) => item.serviceId));
    return Array.from(ids);
  }, [filtered]);

  useEffect(() => {
    if (token && activePlatform?.branchId && year && month) {
      dispatch(
        BROWSE({
          token,
          params: {
            branchId: activePlatform?.branchId,
            year,
            month,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, activePlatform, year, month, dispatch]);

  const handleServiceId = (id) => dispatch(SetSERVICES(id));

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 px-4 mx-4 mb-3 d-flex justify-content-between align-items-center"
      style={{ flexWrap: "wrap" }}
    >
      {/* Left Section */}
      <div className="text-right d-flex items-center">
        <CalendarPicker
          month={month}
          moved={(action) => dispatch(SetMONTH(action))}
          year={year}
          reset={() => dispatch(ResetDATE())}
        />
      </div>

      {/* Right Section */}
      <div className="d-flex justify-content-end align-items-center flex-wrap gap-2">
        <Templates
          setTemplate={setTemplate}
          availableTemplateIds={availableTemplates}
        />
        <Services
          template={template}
          setService={handleServiceId}
          availableServiceIds={availableServices}
        />
      </div>
    </MDBView>
  );
};

export default Header;
