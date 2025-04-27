import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  BROWSE,
  SetFilterBySOURCE,
  RESET,
  SetMONTH,
  ResetDATE,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";
import CalendarPicker from "../../../../../components/header/calendars";
import { currency } from "../../../../../services/utilities";
import { Calendar } from "../../../../../services/fakeDb";

const Header = () => {
  const { maxPage, token, activePlatform, auth } = useSelector(
    ({ auth }) => auth
  );
  const {
      sources,
      month,
      year,
      filtered = [],
      vendor,
      collections,
    } = useSelector(({ deals }) => deals),
    dispatch = useDispatch();
  // Fetch vouchers
  useEffect(() => {
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    endDate.setHours(23, 59, 59, 999);
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

  console.log("activePlatform", activePlatform);

  const sum = filtered
    ?.flatMap(({ deals = [] }) => deals?.map((item) => item.amount))
    .reduce((acc, item) => acc + item, 0);

  const handlePrintOut = () => {
    const source = sources.find(({ _id }) => String(_id) === String(vendor));

    localStorage.setItem("resecos", JSON.stringify(filtered));
    localStorage.setItem(
      "header",
      JSON.stringify({ month: Calendar.Months[month - 1], year, source })
    );

    window.open(
      "/printout/reseco",
      "Reseco", // Unique window name 2
      "top=100px,left=0px,width=1050px,height=750px"
    );
  };

  console.log("filtered", filtered);

  const handleSoftCopy = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Deals");
    const { branch } = activePlatform;
    const { companyId } = branch;
    // Add company name header - Add the row first
    const companyHeader = worksheet.addRow([`Company: ${companyId?.name}`]);
    companyHeader.font = { bold: true, size: 14 };

    // Merge the row correctly
    worksheet.mergeCells(`A${companyHeader.number}:E${companyHeader.number}`);

    // Get source displayname from the first deal
    const source =
      sources.find((s) => String(s._id) === String(vendor))?.displayname ??
      "Unknown Source";

    // Add source header
    const sourceAndGrossRow = worksheet.addRow([
      `SOURCE: ${source.toUpperCase()}`,
      "",
      "",
      `GROSS:  ${currency(sum)}`,
      "",
    ]);
    sourceAndGrossRow.font = { bold: true };

    // Merge cells for layout
    worksheet.mergeCells(
      `A${sourceAndGrossRow.number}:C${sourceAndGrossRow.number}`
    );
    worksheet.mergeCells(
      `D${sourceAndGrossRow.number}:E${sourceAndGrossRow.number}`
    );

    worksheet.addRow([]); // empty spacer row

    // Add table headers
    const columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Customer", key: "customer", width: 25 },
      { header: "Services", key: "services", width: 25 },
      { header: "Payment Type", key: "payment", width: 15 },
      { header: "Amount", key: "amount", width: 10 },
    ];

    // Set column widths manually (without adding auto headers)
    worksheet.columns = columns.map(({ width }) => ({ width }));

    // Now manually add headers
    const tableHeader = worksheet.addRow(columns.map((col) => col.header));
    tableHeader.font = { bold: true };

    // Add each deal
    filtered.forEach(({ date, deals }) => {
      deals.forEach((deal) => {
        worksheet.addRow([
          date,
          `${deal.customerId?.fullName?.fname ?? ""} ${
            deal.customerId?.fullName?.lname ?? ""
          }`,
          deal.cart?.map(({ abbreviation = "" }) => abbreviation).join(",  "),
          deal.payment ?? "",
          deal.amount ?? 0,
        ]);
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `deals_export_${Date.now()}.xlsx`);
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
      <div>
        <h5 className="mt-1">
          Gross : <strong> {currency(sum)}</strong>
        </h5>
      </div>
      <div className="d-flex align-items-center">
        <div className="text-right d-flex items-center ">
          <select
            id="cashier-select"
            className="custom-select mr-2"
            onChange={(e) => dispatch(SetFilterBySOURCE(e.target.value))}
          >
            <option value="" disabled>
              Select a Source
            </option>
            <option key="all" value="all">
              Select all
            </option>
            {sources?.map((source, index) => (
              <option key={`source-${index}`} value={source?._id}>
                {source?.displayname}
              </option>
            ))}
          </select>
        </div>
        <MDBBtn
          color="white"
          rounded
          size="sm"
          className="px-2"
          onClick={() => handlePrintOut("lol")}
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
