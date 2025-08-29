import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";
import CalendarPicker from "../../../../../components/header/calendars";
import { currency, ResecoToExcel } from "../../../../../services/utilities";
import { Calendar } from "../../../../../services/fakeDb";
import {
  SetMONTH,
  ResetDATE,
  BROWSE,
  RESET,
  SetFilterBySourceAndPhysician,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
import Loading from "./loading";

const Header = () => {
  const dispatch = useDispatch();
  const {
    sources,
    month,
    year,
    filtered = [],
    collections = [],
    filteredPhysicians: physicians = [],
    source: displaySource,
    physician: displayPhysician,
    isLoading,
  } = useSelector(({ deals }) => deals);
  const { token, auth, activePlatform, maxPage } = useSelector(
    ({ auth, platform }) => ({ ...auth, ...platform })
  );

  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedPhysician, setSelectedPhysician] = useState("all");

  // 🔁 Combined filtering
  useEffect(() => {
    dispatch(
      SetFilterBySourceAndPhysician({
        source: selectedSource,
        physician: selectedPhysician,
      })
    );
  }, [selectedSource, selectedPhysician, dispatch]);

  // 🔁 Refresh on date/platform change
  useEffect(() => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    dispatch(
      BROWSE({
        token,
        key: {
          branchId: activePlatform.branchId,
          department: activePlatform.department,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      })
    );
    return () => dispatch(RESET());
  }, [dispatch, maxPage, activePlatform, auth._id, year, month, token]);

  const totalPhysicianAmount = physicians.reduce(
    (acc, curr) => acc + (Number(curr.total) || 0),
    0
  );

  const summarizedSourcesMap = {};
  collections?.forEach(({ amount, source }) => {
    const id = source?._id || "NoSource";
    const displayname = source?.displayname || "No Source";
    //for sources
    summarizedSourcesMap[id] ??= { displayname, total: 0 };
    summarizedSourcesMap[id].total += Number(amount) || 0;
  });

  const summarizedSources = Object.entries(summarizedSourcesMap).map(
    ([id, data]) => ({ _id: id, ...data })
  );

  const totalAmount = filtered
    .flatMap(({ deals = [] }) => deals.map((d) => Number(d.amount) || 0))
    .reduce((a, b) => a + b, 0);

  const getResecoData = () => {
    const isMembership = sources.find(
      ({ _id }) => selectedSource === _id
    )?.isMembership;

    const gross = filtered
      .flatMap(({ deals = [] }) => deals.map((d) => Number(d.amount) || 0))
      .reduce((a, b) => a + b, 0);

    const rebate = !isMembership ? gross * 0.1 : 0;

    return {
      isMembership,
      gross,
      rebate,
      header: {
        month: Calendar.Months[month - 1],
        year,
        source: displaySource,
        physician: displayPhysician,
        gross,
        rebate,
        isMembership,
      },
    };
  };

  // 🖨️ Print
  const handlePrintOut = () => {
    const { header } = getResecoData();
    localStorage.setItem("resecos", JSON.stringify(filtered));
    localStorage.setItem("header", JSON.stringify(header));
    window.open(
      "/printout/reseco",
      "Reseco",
      "top=100px,left=0px,width=1050px,height=750px"
    );
  };
  // 📤 Excel Export
  const handleSoftCopy = () => {
    const { gross, rebate, isMembership } = getResecoData();
    ResecoToExcel({
      array: filtered,
      options: {
        gross,
        rebate,
        physician: displayPhysician,
        source: displaySource,
        isMembership,
      },
    });
  };
  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 d-flex justify-content-between align-items-center"
    >
      <CalendarPicker
        month={month}
        year={year}
        moved={(next) => dispatch(SetMONTH(next))}
        reset={() => dispatch(ResetDATE())}
      />
      {isLoading && (
        <div style={{ width: "100%" }} className="d-flex justify-content-end ">
          <div style={{ width: "30rem" }} className="d-flex align-items-center">
            <Loading />
            <Loading />
          </div>
        </div>
      )}

      <div className="d-flex align-items-center ml-2">
        {!isLoading && filtered.length > 0 && (
          <>
            <div
              className="text-right d-flex items-center"
              style={{ width: "100%" }}
            >
              {/* 🔹 Source Dropdown */}

              <select
                style={{ width: "100%" }}
                className="custom-select mr-2"
                value={selectedSource}
                onChange={(e) => {
                  setSelectedSource(e.target.value);
                  setSelectedPhysician("all");
                }}
              >
                <option value="all">
                  All Sources ({currency.format(totalAmount)})
                </option>
                <option value="NoSource">
                  No Source (
                  {currency.format(
                    summarizedSourcesMap["NoSource"]?.total || 0
                  )}
                  )
                </option>
                {summarizedSources
                  .filter(({ _id }) => _id !== "NoSource")
                  .map(({ _id, displayname, total }) => (
                    <option key={_id} value={_id}>
                      {displayname} ({currency.format(total)})
                    </option>
                  ))}
              </select>

              <select
                style={{ width: "100%" }}
                className="custom-select mr-2"
                value={selectedPhysician}
                onChange={(e) => setSelectedPhysician(e.target.value)}
              >
                <option value="all">
                  All Physicians ({currency.format(totalPhysicianAmount)})
                </option>
                {physicians.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.fullName} ({currency.format(p.total)})
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <MDBBtn
          color="white"
          rounded
          disabled={isLoading || filtered.length === 0}
          size="sm"
          className="px-2"
          onClick={handlePrintOut}
        >
          <MDBIcon icon="print" />
        </MDBBtn>
        <MDBBtn
          color="white"
          rounded
          size="sm"
          disabled={isLoading || filtered.length === 0}
          className="px-2"
          onClick={handleSoftCopy}
        >
          <MDBIcon icon="file-excel" style={{ fontSize: "0.9rem" }} />
        </MDBBtn>
      </div>
    </MDBView>
  );
};

export default Header;
