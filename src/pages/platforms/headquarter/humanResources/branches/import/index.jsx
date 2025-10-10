import { useCallback, useState } from "react";
import * as XLSX from "xlsx";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBCard,
  MDBCardBody,
  MDBTypography,
  MDBBtn,
} from "mdbreact";

import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

import {
  IMPORT,
  TOGGLE_IMPORT,
} from "../../../../../../services/redux/slices/commerce/catalog/menus";
import Swal from "sweetalert2";
import ExtractedData from "./extractedData";
import Spinner from "../../../../../../components/spinner";
import { SetUPDATED_ITEMS_COLLECTIONS } from "../../../../../../services/redux/slices/assets/branches";

export default function ImportModal() {
  const { token } = useSelector(({ auth }) => auth),
    { showImport: show, formSubmitted } = useSelector(({ menus }) => menus),
    { collections: branches } = useSelector(({ branches }) => branches),
    [branchId, setBranchId] = useState(""),
    [extracted, setExtracted] = useState([]),
    dispatch = useDispatch();
  const { addToast } = useToasts();

  const toggle = () => dispatch(TOGGLE_IMPORT());

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

      if (!rows.length) {
        Swal.fire({
          icon: "warning",
          title: "📂 Empty Excel File",
          text: "Your Excel file has no data. Please check and try again.",
        });
        setExtracted([]);
        return;
      }

      // 🔍 Find the row where "name" and "price" appear
      let headerRowIndex = -1;
      for (let i = 0; i < rows.length; i++) {
        const lower = rows[i].map((cell) =>
          cell.toString().trim().toLowerCase()
        );
        if (
          lower.some((c) => c.includes("name")) &&
          lower.some((c) => c.includes("price"))
        ) {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex === -1) {
        Swal.fire({
          icon: "error",
          title: "⚠️ Missing Required Columns",
          html: `
          Please make sure your Excel file has columns named:<br><br>
          <b>Name</b> and <b>Price</b>.<br><br>
          These columns are required for importing.
        `,
        });
        setExtracted([]);

        return;
      }

      const headers = rows[headerRowIndex].map((h) =>
        h.toString().trim().toLowerCase()
      );

      const nameIndex = headers.findIndex((h) => h.includes("name"));
      const priceIndex = headers.findIndex((h) => h.includes("price"));
      const descIndex = headers.findIndex((h) => h.includes("description"));

      // ⚠️ Check missing required columns
      const missing = [];
      if (nameIndex === -1) missing.push("Name");
      if (priceIndex === -1) missing.push("Price");

      if (missing.length) {
        Swal.fire({
          icon: "error",
          title: "⚠️ Missing Required Columns",
          html: `
          Please make sure your Excel file includes:<br><br>
          <b>Required:</b> Name, Price<br>
          <b>Optional:</b> Description<br><br>
          <b>Missing:</b> ${missing.join(", ")}
        `,
        });
        setExtracted([]);

        return;
      }

      const dataRows = rows.slice(headerRowIndex + 1).filter((row) => {
        const nameVal = row[nameIndex]?.toString().trim();
        const priceVal = row[priceIndex]?.toString().trim();

        if (!nameVal || !priceVal) return false;
        if (!/\d/.test(priceVal)) return false;

        return true;
      });

      if (!dataRows.length) {
        Swal.fire({
          icon: "warning",
          title: "📂 Empty Excel Data",
          text: "Your Excel file has headers but no data below.",
        });
        setExtracted([]);
        return;
      }

      // 🧾 Extract only from the rows AFTER the header row
      const extracted = dataRows.map((row) => {
        // 🧹 Clean name
        const rawName = row[nameIndex] ? row[nameIndex].toString().trim() : "";
        const cleanName = rawName.replace(/^[\d.\s-]+/, "").trim();

        // 💰 Clean price
        let rawPrice = row[priceIndex] ? row[priceIndex].toString().trim() : "";
        const cleanPrice = rawPrice.replace(/[^\d.]/g, ""); // keep only numbers and dots

        return {
          abbreviation: cleanName,
          opd: Number(cleanPrice),
          description: descIndex !== -1 ? row[descIndex] || "" : "",
        };
      });

      const uniqueExtracted = [];
      const seenNames = new Set();

      for (const item of extracted) {
        // linisin name bago i-compare
        const normalizedName = item.abbreviation
          .toLowerCase() // ignore case
          .replace(/\s+/g, ""); // tanggal lahat ng spaces

        if (!seenNames.has(normalizedName)) {
          seenNames.add(normalizedName);
          uniqueExtracted.push(item);
        }
      }

      setExtracted(uniqueExtracted);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const _extracted = extracted.map((item) => ({ ...item, branchId }));
    dispatch(IMPORT({ data: { data: _extracted }, token })).then(
      ({ payload }) => {
        const _branches = [...branches];
        const index = _branches.findIndex((item) => item._id === branchId);
        if (index > -1) {
          const menus = [...(_branches[index].menus || []), ...payload];
          _branches[index] = { ..._branches[index], menus };
          dispatch(SetUPDATED_ITEMS_COLLECTIONS(_branches));
        }
        addToast("Menus imported successfully", { appearance: "success" });
        document.getElementById("file-upload").value = "";
        toggle();
        setBranchId("");
        setExtracted([]);
      }
    );
  };

  const hasExtracted = extracted.length > 0;

  return (
    <MDBModal
      size={hasExtracted ? "lg" : "md"}
      isOpen={show}
      toggle={toggle}
      backdrop
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="file-import" className="mr-2" />
        Import Menus
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <span className="d-block" style={{ fontWeight: 400 }}>
              Branch:
            </span>
            <select
              required
              className="form-control ml-1 "
              value={branchId}
              onChange={({ target }) => setBranchId(target.value)}
            >
              <option value={""} disabled>
                Select a branch
              </option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name || branch.displayName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span style={{ fontWeight: 400 }}>Upload Excel File</span>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx, .xls"
              className="form-control mb-2"
              onChange={handleFileUpload}
            />
          </div>

          {hasExtracted && (
            <>
              <MDBCard>
                <MDBCardBody className="p-1 ">
                  <MDBTypography note noteTitle="⚠️Note: " noteColor="warning">
                    If some items from your Excel file are <b>missing</b> here,
                    please review your file — rows without a <b>Price value</b>{" "}
                    are automatically skipped to avoid incomplete data.
                  </MDBTypography>

                  <ExtractedData extracted={extracted} />
                </MDBCardBody>
              </MDBCard>
              <div className="text-center mt-3">
                <MDBBtn
                  color="info"
                  type="submit"
                  rounded
                  disabled={formSubmitted}
                >
                  Save <Spinner formSubmitted={formSubmitted} />
                </MDBBtn>
              </div>
            </>
          )}
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
