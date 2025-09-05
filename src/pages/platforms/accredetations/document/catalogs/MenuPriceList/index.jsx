import { useSelector, useDispatch } from "react-redux";
import { Banner } from "../../../../../../services/utilities";
import { MDBBtn } from "mdbreact";
import { BROWSE, RESET } from "../../../../../../services/redux/slices/commerce/catalog/menus";
import { useEffect } from "react";

export default function MenuPriceList() {
  const { activePlatform = {}, token } = useSelector(({ auth }) => auth);
  const { menuList } = useSelector(({ menus }) => menus);

  const dispatch = useDispatch();

  const handlePrintOut = () => {
    window.open(
      "/printout/menuPriceList",
      "MenuPriceList",
      "top=100px,left=100px,width=1050px,height=750px"
    );
  };

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, key: { branchId: activePlatform?.branchId } }));
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  return (
    <div
      className="d-flex align-items-start justify-content-center"
      style={{ gap: "20px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <div style={{ flex: 1 }} className="bg-white">
        <div style={{ textAlign: "center" }}>
          <Banner
            company={activePlatform?.branch.companyId?.name}
            branch={activePlatform?.branch?.name}
          />
        </div>

        <div style={{ width: "100%", padding: "10px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "16px",
              margin: "0 auto",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #000", padding: "8px", width: "25%", fontWeight: "bold" }}>Item</th>
                <th style={{ border: "1px solid #000", padding: "8px", width: "8%", fontWeight: "bold" }}>Price</th>
                <th style={{ border: "1px solid #000", padding: "8px", width: "25%", fontWeight: "bold" }}>Item</th>
                <th style={{ border: "1px solid #000", padding: "8px", width: "8%", fontWeight: "bold" }}>Price</th>
                <th style={{ border: "1px solid #000", padding: "8px", width: "25%", fontWeight: "bold" }}>Item</th>
                <th style={{ border: "1px solid #000", padding: "8px", width: "8%", fontWeight: "bold" }}>Price</th>
                
              </tr>
            </thead>

            <tbody>
              {(() => {
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

                return col1.map((m, i) => (
                  <tr key={m._id}>
                    {/* Col 1 */}
                    <td style={{ border: "1px solid #000", padding: "8px", fontWeight: 600 }}>
                      {i + 1}. {m.description || m.itemName}
                    </td>
                    <td style={{ border: "1px solid #000", padding: "8px", textAlign: "right", color: "blue", fontWeight: "bold" }}>
                      ₱ {m.opd}
                    </td>

                    {/* Col 2 */}
                    {col2[i] ? (
                      <>
                        <td style={{ border: "1px solid #000", padding: "8px", fontWeight: 600 }}>
                          {i + 1 + third}. {col2[i].description || col2[i].itemName}
                        </td>
                        <td style={{ border: "1px solid #000", padding: "8px", textAlign: "right", color: "blue", fontWeight: "bold" }}>
                          ₱ {col2[i].opd}
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ border: "1px solid #000", padding: "8px" }}></td>
                        <td style={{ border: "1px solid #000", padding: "8px" }}></td>
                      </>
                    )}

                    {/* Col 3 */}
                    {col3[i] ? (
                      <>
                        <td style={{ border: "1px solid #000", padding: "8px", fontWeight: 600 }}>
                          {i + 1 + 2 * third}. {col3[i].description || col3[i].itemName}
                        </td>
                        <td style={{ border: "1px solid #000", padding: "8px", textAlign: "right", color: "blue", fontWeight: "bold" }}>
                          ₱ {col3[i].opd}
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ border: "1px solid #000", padding: "8px" }}></td>
                        <td style={{ border: "1px solid #000", padding: "8px" }}></td>
                      </>
                    )}
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ minWidth: "120px", marginTop: "60px" }}>
        <MDBBtn size="md" color="primary" onClick={handlePrintOut}>
          Print
        </MDBBtn>
      </div>

      <style>{`
        @media print {
          button { display: none; }
          body { margin: 0; }
        }
      `}</style>
    </div>
  );
}
