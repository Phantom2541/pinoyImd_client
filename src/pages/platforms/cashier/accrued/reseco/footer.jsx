import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import TableRowCount from "../../../../../components/pagination/rows";
import Pagination from "../../../../../components/pagination";
import {
  SetMaxPage,
  SetActivePAGE,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
// import { MDBIcon } from "mdbreact";
// import * as ExcelJS from "exceljs";
// import { saveAs } from "file-saver";

const Footer = () => {
  const {
      // filtered = [],
      isLoading,
      totalPages,
      activePage,
    } = useSelector(({ deals }) => deals),
    { maxPage } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(SetMaxPage(maxPage));
  }, [dispatch, maxPage]);

  const handlePageChange = (action) => {
    const newPage = activePage + (action ? 1 : -1);
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(SetActivePAGE(newPage));
    }
  };

  // const totalDeals = filtered?.reduce(
  //   (sum, item) => sum + item?.deals?.length,
  //   0
  // );

  // const handleSoftCopy = async () => {
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet("Deals");

  //   // Get source displayname from the first deal
  //   const source =
  //     sources.find((s) => String(s._id) === String(vendor))?.displayname ??
  //     "Unknown Source";

  //   // Add source header
  //   const sourceHeader = worksheet.addRow([`SOURCE: ${source.toUpperCase()}`]);
  //   sourceHeader.font = { bold: true };
  //   worksheet.mergeCells(`A${sourceHeader.number}:D${sourceHeader.number}`);

  //   worksheet.addRow([]); // empty spacer row

  //   // Add table headers ONCE
  //   const columns = [
  //     { header: "Date", key: "date", width: 15 },
  //     { header: "Customer", key: "customer", width: 25 },
  //     { header: "Payment Type", key: "payment", width: 15 },
  //     { header: "Amount", key: "amount", width: 10 },
  //   ];
  //   worksheet.columns = columns;

  //   const tableHeader = worksheet.addRow(columns.map((col) => col.header));
  //   tableHeader.font = { bold: true };

  //   // Add each deal
  //   filtered.forEach(({ date, deals }) => {
  //     deals.forEach((deal) => {
  //       worksheet.addRow({
  //         date,
  //         customer: `${deal.customerId?.fullName?.fname ?? ""} ${
  //           deal.customerId?.fullName?.lname ?? ""
  //         }`,
  //         payment: deal.payment ?? "",
  //         amount: deal.amount ?? 0,
  //       });
  //     });
  //   });

  //   const buffer = await workbook.xlsx.writeBuffer();
  //   const blob = new Blob([buffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   saveAs(blob, `deals_export_${Date.now()}.xlsx`);
  // };

  return (
    <div className="mb-auto d-flex justify-content-between align-items-center px-4">
      <TableRowCount disablePageSelect={false} />
      {/* <div
        className="d-flex justify-items-center align-items-center"
        style={{ width: "20rem" }}
      >
        <span className="black-text mx-3 text-nowrap mt-0">
          {totalDeals} Total
        </span>
        <button
          className="btn btn-success btn-sm d-flex align-items-center"
          onClick={handleSoftCopy}
        >
          <MDBIcon icon="file-excel" className="me-2" />
          Export to Excel
        </button>
      </div> */}
      <Pagination
        isLoading={isLoading}
        total={totalPages}
        page={activePage}
        setPage={handlePageChange}
      />
    </div>
  );
};

export default Footer;
