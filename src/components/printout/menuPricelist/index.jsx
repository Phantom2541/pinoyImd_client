import { useSelector, useDispatch } from "react-redux";
import { Banner } from "../../../services/utilities";
import { BROWSE, RESET } from "../../../services/redux/slices/commerce/catalog/menus";
import { useEffect } from "react";

export default function MenuPriceList() {
  const { token } = useSelector(({ auth }) => auth);
  const { menuList } = useSelector(({ menus }) => menus);

  const dispatch = useDispatch();
  const activePlatform = JSON.parse(localStorage.getItem("activePlatform") || "{}");

  useEffect(() => {
    window.print();
  }, []);

  // Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, key: { branchId: activePlatform?.branchId } }));
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  // Pagination: 50 items per page
  const pageSize = 50;
  const pages = [];
  const filteredItems = menuList?.filter(
    (m) =>
      (m.description || m.itemName) &&
      m.opd > 0 &&
      m.itemName?.toLowerCase() !== "n/a"
  ) || [];

  for (let i = 0; i < filteredItems.length; i += pageSize) {
    pages.push(filteredItems.slice(i, i + pageSize));
  }

  // Function to render table for each page
  const renderTable = (items, startIndex = 0) => {
    const third = Math.ceil(items.length / 3);
    const col1 = items.slice(0, third);
    const col2 = items.slice(third, 2 * third);
    const col3 = items.slice(2 * third);

    const rows = Math.max(col1.length, col2.length, col3.length);

    return (
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #000", padding: "6px", width: "25%", fontWeight: "bold" }}>Item</th>
            <th style={{ border: "1px solid #000", padding: "6px", width: "8%", fontWeight: "bold" }}>Price</th>
            <th style={{ border: "1px solid #000", padding: "6px", width: "25%", fontWeight: "bold" }}>Item</th>
            <th style={{ border: "1px solid #000", padding: "6px", width: "8%", fontWeight: "bold" }}>Price</th>
            <th style={{ border: "1px solid #000", padding: "6px", width: "25%", fontWeight: "bold" }}>Item</th>
            <th style={{ border: "1px solid #000", padding: "6px", width: "8%", fontWeight: "bold" }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {/* Column 1 */}
              <td style={{ border: "1px solid #000", padding: "6px", fontWeight: "bold" }}>
                {col1[i] ? `${startIndex + i + 1}. ${col1[i].description || col1[i].itemName}` : ""}
              </td>
              <td style={{ border: "1px solid #000", padding: "6px", textAlign: "right", color: "blue", fontWeight: "bold" }}>
                {col1[i] ? `₱ ${col1[i].opd}` : ""}
              </td>

              {/* Column 2 */}
              <td style={{ border: "1px solid #000", padding: "6px", fontWeight: "bold" }}>
                {col2[i] ? `${startIndex + third + i + 1}. ${col2[i].description || col2[i].itemName}` : ""}
              </td>
              <td style={{ border: "1px solid #000", padding: "6px", textAlign: "right", color: "blue", fontWeight: "bold" }}>
                {col2[i] ? `₱ ${col2[i].opd}` : ""}
              </td>

              {/* Column 3 */}
              <td style={{ border: "1px solid #000", padding: "6px", fontWeight: "bold" }}>
                {col3[i] ? `${startIndex + 2 * third + i + 1}. ${col3[i].description || col3[i].itemName}` : ""}
              </td>
              <td style={{ border: "1px solid #000", padding: "6px", textAlign: "right", color: "blue", fontWeight: "bold" }}>
                {col3[i] ? `₱ ${col3[i].opd}` : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {pages.map((pageItems, pageIndex) => (
        <div key={pageIndex} className="page" style={{ marginBottom: "30px" }}>
          {/* Banner */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <Banner
              company={activePlatform?.branch.companyId?.name}
              branch={activePlatform?.branch?.name}
            />
          </div>

          {/* Table */}
          <div style={{ width: "100%", paddingTop: "20px" }}>
            {renderTable(pageItems, pageIndex * pageSize)}
          </div>
        </div>
      ))}

      <style>{`
        @media print {
          body { margin: 0; }
          .page { page-break-after: always; }
          table { border-collapse: collapse; width: 100%; font-size: 12px; }
          th, td { border: 1px solid #000; padding: 6px; }
          tr { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
