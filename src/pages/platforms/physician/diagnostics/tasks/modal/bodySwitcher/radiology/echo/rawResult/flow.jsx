import { MDBTable } from "mdbreact";
import { useSelector } from "react-redux";
import { Echo } from "../../../../../../../../../../services/fakeDb";

const Flow = () => {
  const { task } = useSelector(({ validator }) => validator);
  const { flow = [] } = task;
  return (
    <>
      <span className="font-weight-bold mt-n2 mb-1 d-block">
        FLOW DOPPLER STUDY
      </span>
      <MDBTable small bordered>
        <thead>
          <tr>
            <th
              className="py-1"
              style={{ fontWeight: 600, verticalAlign: "middle" }}
              rowSpan={2}
            >
              Valve
            </th>
            <th
              className="py-1"
              style={{ fontWeight: 600, verticalAlign: "middle" }}
              rowSpan={2}
            >
              Vmax <br /> (m/s)
            </th>
            <th
              className="py-1"
              style={{ fontWeight: 600, verticalAlign: "middle" }}
              rowSpan={2}
            >
              Peak Gradient
              <br /> (mmHg)
            </th>
            <th
              className="py-1"
              style={{ fontWeight: 600, verticalAlign: "middle" }}
              rowSpan={2}
            >
              Mean Gradient
              <br /> (mmHg)
            </th>
            <th
              className="py-1"
              style={{ fontWeight: 600, verticalAlign: "middle" }}
              rowSpan={2}
            >
              Vti <br />
              (cm)
            </th>
            <th
              className="py-1"
              style={{ fontWeight: 600 }}
              colSpan={3}
              rowSpan={1}
            >
              Regurgitation
            </th>
          </tr>
          <tr>
            <th
              className="py-1"
              style={{ fontWeight: 600, verticalAlign: "middle" }}
            >
              Vti <br /> (cm)
            </th>
            <th className="py-1" style={{ fontWeight: 600 }}>
              Vmax <br />
              (m/s)
            </th>
            <th className="py-1" style={{ fontWeight: 600 }}>
              VC <br />
              (mm)
            </th>
          </tr>
        </thead>
        <tbody>
          {Echo.FlowDoppler.map((field, index) => {
            return (
              <tr key={`echo-flowDoppler-${index}`}>
                <td
                  className="py-1 text-nowrap"
                  style={{ fontWeight: 500, width: "14%" }}
                >
                  {field}
                </td>
                {flow[index]?.map((result, cIdx) => (
                  <td
                    className="py-1 "
                    style={{ fontWeight: 400 }}
                    key={`echo-flowDoppler-${index}-${cIdx}`}
                  >
                    {result || ""}
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

export default Flow;
