import { MDBTable } from "mdbreact";
import { currency } from "../../../../../../services/utilities";

const ExtractedData = ({ extracted = [] }) => {
  return (
    <div
      style={{
        maxHeight: "20rem",
        overflowY: "auto",
      }}
    >
      <MDBTable small className="mb-0">
        <thead className="sticky" style={{ top: "0", zIndex: 2 }}>
          <tr>
            <th style={{ width: "70%", fontWeight: 600 }} className="py-1">
              Menus ({extracted.length})
            </th>
            <th style={{ width: "30%" }} className="py-1">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {extracted.length > 0 ? (
            extracted.map((item, index) => (
              <tr key={index}>
                <td className="py-1">
                  {index + 1}.
                  <span style={{ fontWeight: 400 }} className="ml-1">
                    {item.abbreviation}
                  </span>
                </td>
                <td className="text-end py-1" style={{ fontWeight: 400 }}>
                  {currency.format(item.opd)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center text-muted py-3">
                No data extracted yet. Upload an Excel file to preview.
              </td>
            </tr>
          )}
        </tbody>
      </MDBTable>
    </div>
  );
};

export default ExtractedData;
