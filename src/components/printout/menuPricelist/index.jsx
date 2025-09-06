import { useSelector, useDispatch } from "react-redux";
import { Cloudinary } from "../../../services/utilities";
import { BROWSE, RESET } from "../../../services/redux/slices/commerce/catalog/menus";
import { useEffect, useState } from "react";

export default function MenuPriceList() {
  const { activePlatform = {}, token } = useSelector(({ auth }) => auth);
  const { menuList } = useSelector(({ menus }) => menus);
  const dispatch = useDispatch();

  const [readyToPrint, setReadyToPrint] = useState(false);

  const companyName = activePlatform?.company?.name || "";
  const branchName = activePlatform?.branch?.name || "";

  // Cloudinary Banner URL
  const BannerURL = `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
    companyName
  )}/${encodeURIComponent(branchName)}/banner`;

  // Preload banner before printing
  useEffect(() => {
    const img = new Image();
    img.src = BannerURL;
    img.onload = () => setReadyToPrint(true);
  }, [BannerURL]);

  // Trigger print once banner is loaded
  useEffect(() => {
    if (readyToPrint) window.print();
  }, [readyToPrint]);

  // Fetch menu list
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, key: { branchId: activePlatform.branchId } }));
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  const items =
    menuList?.filter(
      (m) =>
        (m.description || m.itemName) &&
        m.opd > 0 &&
        m.itemName?.toLowerCase() !== "n/a"
    ) || [];

  const third = Math.ceil(items.length / 3);
  const col1 = items.slice(0, third);
  const col2 = items.slice(third, 2 * third);
  const col3 = items.slice(2 * third);

  return (
    <div style={{ maxWidth: "100%", padding: "5px", backgroundColor: "#fff" }}>
      {/* Banner */}
      <div style={{  marginBottom: "10px", height: "85px" }}>
        <img
          src={BannerURL}
          alt={`${companyName} ${branchName} Banner`}
          style={{ width: "100%", height:"100%", objectFit: "fill" }}
        />
      </div>

      {/* Table */}
      <table
        className="menuPricelist-table"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "11px",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #000", padding: "4px", width: "31%", fontWeight: "bold" }}>Item</th>
            <th style={{ border: "1px solid #000", padding: "4px", width: "13%", fontWeight: "bold" }}>Price</th>
            <th style={{ border: "1px solid #000", padding: "4px", width: "31%", fontWeight: "bold" }}>Item</th>
            <th style={{ border: "1px solid #000", padding: "4px", width: "13%", fontWeight: "bold" }}>Price</th>
            <th style={{ border: "1px solid #000", padding: "4px", width: "31%", fontWeight: "bold" }}>Item</th>
            <th style={{ border: "1px solid #000", padding: "4px", width: "13%", fontWeight: "bold" }}>Price</th>
          </tr>
        </thead>

        <tbody>
          {col1.map((m, i) => (
            <tr key={m._id} style={{ pageBreakInside: "avoid" }}>
              {/* Column 1 */}
              <td style={{ border: "1px solid #000", padding: "4px", fontWeight: 600 }}>
                {i + 1}. {m.description || m.itemName}
              </td>
              <td style={{ border: "1px solid #000", padding: "4px", textAlign: "right", color: "blue", fontWeight: "bold" }}>
                ₱ {m.opd}
              </td>

              {/* Column 2 */}
              {col2[i] ? (
                <>
                  <td style={{ border: "1px solid #000", padding: "4px", fontWeight: 600 }}>
                    {i + 1 + third}. {col2[i].description || col2[i].itemName}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "right", color: "blue", fontWeight: "bold" }}>
                    ₱ {col2[i].opd}
                  </td>
                </>
              ) : (
                <>
                  <td style={{ border: "1px solid #000", padding: "4px" }}></td>
                  <td style={{ border: "1px solid #000", padding: "4px" }}></td>
                </>
              )}

              {/* Column 3 */}
              {col3[i] ? (
                <>
                  <td style={{ border: "1px solid #000", padding: "4px", fontWeight: 600 }}>
                    {i + 1 + 2 * third}. {col3[i].description || col3[i].itemName}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "right", color: "blue", fontWeight: "bold" }}>
                    ₱ {col3[i].opd}
                  </td>
                </>
              ) : (
                <>
                  <td style={{ border: "1px solid #000", padding: "4px" }}></td>
                  <td style={{ border: "1px solid #000", padding: "4px" }}></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          .menuPricelist-table {
            font-size: 11px;
            border-collapse: collapse;
            width: 100%;
            font-size:.5rem !important
          }

          .menuPricelist-table th, td {
            border: 1px solid #000;
            padding: 4px;
            word-break: break-word;
            font-size:.5rem
          }

         .menuPricelist-table tr {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
