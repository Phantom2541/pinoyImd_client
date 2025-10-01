import { MDBTable } from "mdbreact";
import { Echo } from "../../../../../../../services/fakeDb";

const Quantitative = ({ task }) => {
  const { mmode = [] } = task || {};

  return (
    <MDBTable small bordered style={{ borderCollapse: "collapse !important" }}>
      <tbody>
        <tr>
          {[
            "M-MODE",
            "NORMAL RANGE",
            "VALUE",
            "VOLUMES",
            "NORMAL-RANGE",
            "EQUIVALENT",
          ].map((field, index) => (
            <th key={`echo-mmMode-${index}`} className="py-1 text-center">
              <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
                {field}
              </span>
            </th>
          ))}
        </tr>
        {Echo.Mmode.map((field, index) => {
          const val = mmode[index] ?? "";
          return (
            <tr key={`echo-mmode-${index}`}>
              <td className="py-1 text-center" style={{ fontWeight: 400 }}>
                {field.title}
              </td>
              <td className="py-1 text-center">
                <div dangerouslySetInnerHTML={{ __html: field.range }} />
              </td>
              <td className="p-0 m-0 text-center fw-bold align-middle">
                <div className="d-flex align-items-stretch h-100 w-100 mt-1">
                  <div
                    className="text-center m-0 p-0"
                    style={{ width: "50%", borderRight: "1px solid #dee2e6" }}
                  >
                    2
                  </div>
                  <div className="text-center m-0 p-0" style={{ width: "50%" }}>
                    2
                  </div>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Quantitative;
