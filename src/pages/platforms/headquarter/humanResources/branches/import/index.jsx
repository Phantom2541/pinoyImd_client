import { useState } from "react";
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
  MDBRow,
  MDBCol,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  IMPORT,
  SetEXTRACTED,
  TOGGLE_IMPORT,
} from "../../../../../../services/redux/slices/commerce/catalog/menus";
import Swal from "sweetalert2";
import ExtractedData from "./extracted";
import Spinner from "../../../../../../components/spinner";
import { SetUPDATED_ITEMS_COLLECTIONS } from "../../../../../../services/redux/slices/assets/branches";

export default function ImportModal() {
  const { token } = useSelector(({ auth }) => auth),
    {
      showImport: show,
      formSubmitted,
      extracted,
    } = useSelector(({ menus }) => menus),
    { collections: branches } = useSelector(({ branches }) => branches),
    [branchId, setBranchId] = useState(""),
    [uploadKey, setUploadKey] = useState(Date.now()),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  const toggle = () => dispatch(TOGGLE_IMPORT());

  const setExtracted = (datas) => dispatch(SetEXTRACTED(datas));

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // 🧩 Handle merged cells (fill them with their top-left value)
      const merges = sheet["!merges"] || [];
      for (const merge of merges) {
        const start = merge.s;
        const end = merge.e;
        const topLeft = XLSX.utils.encode_cell(start);
        const value = sheet[topLeft]?.v;

        if (value !== undefined) {
          // Fill vertically and horizontally
          for (let R = start.r; R <= end.r; R++) {
            for (let C = start.c; C <= end.c; C++) {
              const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
              if (!sheet[cellRef]) {
                sheet[cellRef] = { t: "s", v: value };
              } else if (C !== start.c) {
                // Ensure horizontal merge text consistency
                sheet[cellRef].v = value;
              }
            }
          }
        }
      }

      // 🔄 Convert to rows AFTER filling merges
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
      console.log("rows", rows);

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
        h.toString().replace(/\s+/g, "").trim().toLowerCase()
      );

      const nameIndex = headers.findIndex((h) => h.includes("name"));
      const priceIndex = headers.findIndex((h) => h.includes("price"));
      const descIndex = headers.findIndex((h) => h.includes("description"));
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
        const priceVal = row[priceIndex];

        if (!nameVal || priceVal == null || priceVal === "") return false;

        if (priceVal instanceof Date) return false;

        const num = Number(priceVal);
        if (isNaN(num)) return false;

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

      const extracted = dataRows.map((row) => {
        const rawName = row[nameIndex] ? row[nameIndex].toString().trim() : "";
        const cleanName = rawName.replace(/^[\d.\s-]+/, "").trim();

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
        const normalizedName = item.abbreviation
          .toLowerCase()
          .replace(/\s+/g, "");
        if (!seenNames.has(normalizedName)) {
          seenNames.add(normalizedName);
          uniqueExtracted.push(item);
        }
      }

      setExtracted(
        uniqueExtracted.sort((a, b) =>
          a.abbreviation.localeCompare(b.abbreviation)
        )
      );
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const _extracted = extracted.map((item) => ({ ...item, branchId }));
    dispatch(IMPORT({ data: { data: _extracted }, token })).then(
      ({ payload = [] }) => {
        const _branches = [...branches];
        const index = _branches.findIndex((item) => item._id === branchId);
        if (index > -1) {
          const menus = [...(_branches[index].menus || []), ...(payload || [])];
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
      size={hasExtracted ? "xl" : "md"}
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
          <MDBRow>
            <MDBCol md={hasExtracted ? 6 : 12}>
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
            </MDBCol>
            <MDBCol md={hasExtracted ? 6 : 12}>
              <div className={hasExtracted ? "" : "mt-2"}>
                <span style={{ fontWeight: 400 }}>Upload Excel File</span>
                <input
                  key={uploadKey}
                  id="file-upload"
                  type="file"
                  accept=".xlsx, .xls"
                  className="form-control mb-2"
                  onChange={(e) => {
                    handleFileUpload(e);
                    setUploadKey(Date.now()); // force re-render
                  }}
                />
              </div>
            </MDBCol>
          </MDBRow>

          {hasExtracted && (
            <>
              <MDBCard>
                <MDBCardBody className="p-1 ">
                  <MDBTypography note noteTitle="⚠️Note: " noteColor="warning">
                    If some items from your Excel file are <b>missing</b> here,
                    please review your file — rows without a <b>Price value</b>{" "}
                    are automatically skipped to avoid incomplete data.
                  </MDBTypography>

                  <ExtractedData />
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
