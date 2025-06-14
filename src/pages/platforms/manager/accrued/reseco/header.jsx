import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import CalendarPicker from "../../../../../components/header/calendars";
import { currency } from "../../../../../services/utilities";
import { Calendar } from "../../../../../services/fakeDb";
import {
  SetMONTH,
  ResetDATE,
  BROWSE,
  RESET,
  SetFilterBySourceAndPhysician,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";

const Header = () => {
  const dispatch = useDispatch();
  const {
    sources,
    month,
    year,
    filtered = [],
    collections = [],
    vendor,
    filteredPhysicians: physicians = [],
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
          createdAt: startDate,
          endDate,
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

  // 🖨️ Print
  const handlePrintOut = () => {
    const source =
      sources.find(({ _id }) => String(_id) === String(vendor?._id)) ?? {};
    localStorage.setItem("resecos", JSON.stringify(filtered));
    localStorage.setItem(
      "header",
      JSON.stringify({ month: Calendar.Months[month - 1], year, source })
    );
    window.open(
      "/printout/reseco",
      "Reseco",
      "top=100px,left=0px,width=1050px,height=750px"
    );
  };

  // 📤 Excel Export
  const handleSoftCopy = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Deals");

    const { branch } = activePlatform;
    const { companyId } = branch;
    const companyName = `${companyId?.name} ${companyId?.subName || ""}`;
    worksheet.addRow([`Company: ${companyName}`]).font = {
      bold: true,
      size: 14,
    };
    worksheet.mergeCells("A1:E1");

    const selectedSourceName =
      summarizedSourcesMap[selectedSource]?.displayname || "All Sources";

    worksheet.addRow([
      `SOURCE: ${selectedSourceName}`,
      "",
      "",
      `GROSS: ${currency(totalAmount)}`,
    ]).font = { bold: true };
    worksheet.mergeCells("A2:C2");
    worksheet.mergeCells("D2:E2");

    worksheet.addRow([]);

    worksheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Customer", key: "customer", width: 25 },
      { header: "Services", key: "services", width: 25 },
      { header: "Payment Type", key: "payment", width: 15 },
      { header: "Amount", key: "amount", width: 10 },
      { header: "Rebate", key: "amount", width: 10 },
    ];
    worksheet.addRow(worksheet.columns.map((c) => c.header)).font = {
      bold: true,
    };

    filtered.forEach(({ date, deals }) => {
      deals.forEach((deal) => {
        worksheet.addRow([
          date,
          `${deal.customerId?.fullName?.fname || ""} ${
            deal.customerId?.fullName?.lname || ""
          }`.trim(),
          deal.cart?.map(({ abbreviation }) => abbreviation).join(", "),
          deal.payment || "",
          Number(deal.amount) || 0,
          Number(deal.amount * 0.1) || 0,
        ]);
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `${selectedSourceName} - ${Calendar.Months[month - 1]} ${year}.xlsx`
    );
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <CalendarPicker
        month={month}
        year={year}
        moved={(next) => dispatch(SetMONTH(next))}
        reset={() => dispatch(ResetDATE())}
      />

      <div className="d-flex align-items-center ml-2">
        <div className="text-right d-flex items-center">
          {/* 🔹 Source Dropdown */}
          <select
            id="source-select"
            className="custom-select mr-2"
            value={selectedSource}
            onChange={(e) => {
              setSelectedSource(e.target.value);
              setSelectedPhysician("all");
            }}
          >
            <option value="all">All Sources ({currency(totalAmount)})</option>
            <option value="NoSource">
              No Source (
              {currency(summarizedSourcesMap["NoSource"]?.total || 0)})
            </option>
            {summarizedSources
              .filter(({ _id }) => _id !== "NoSource")
              .map(({ _id, displayname, total }) => (
                <option key={_id} value={_id}>
                  {displayname} ({currency(total)})
                </option>
              ))}
          </select>

          {/* 🔹 Physician Dropdown */}
          <select
            id="physician-select"
            className="custom-select mr-2"
            value={selectedPhysician}
            onChange={(e) => setSelectedPhysician(e.target.value)}
          >
            <option value="all">
              All Physicians ({currency(totalPhysicianAmount)})
            </option>
            {physicians.map((p) => (
              <option key={p._id} value={p._id}>
                {p.fullName} ({currency(p.total)})
              </option>
            ))}
          </select>
        </div>

        <MDBBtn
          color="white"
          rounded
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
