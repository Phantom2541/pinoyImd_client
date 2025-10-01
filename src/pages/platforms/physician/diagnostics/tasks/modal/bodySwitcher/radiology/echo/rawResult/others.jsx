import { MDBTable } from "mdbreact";
import { useSelector } from "react-redux";
import { Echo } from "../../../../../../../../../../services/fakeDb";

const Others = () => {
  const { task } = useSelector(({ validator }) => validator);
  const { others = [] } = task;
  return (
    <>
      <MDBTable small bordered>
        <tbody>
          <tr>
            {[
              "TAPSE:",
              "VALUES",
              "LA VOLUME (BIPLANE) RESULT",
              "VALUES",
              "LV MASS & LV MASS INDEX",
            ].map((field, index) => (
              <th key={`echo-parameter-${index}`} className="py-1 text-center">
                <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
                  {field}
                </span>
              </th>
            ))}
          </tr>

          {Echo.Others.map((field, index) => {
            return (
              <tr key={`echo-flowDoppler-${index}`}>
                {field?.map((label, cIdx) => (
                  <td
                    className="py-1 "
                    style={{ fontWeight: 400 }}
                    key={`echo-flowDoppler-${index}-${cIdx}`}
                  >
                    <div className="d-flex justify-content-between">
                      <span style={{ fontWeight: 500 }}>
                        {label ? label + ":" : ""}
                      </span>
                      <span>{others[index]?.[cIdx] || ""}</span>
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </MDBTable>
    </>
  );
};

export default Others;
