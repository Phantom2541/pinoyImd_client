import { MDBTable } from "mdbreact";
import { Echo } from "../../../../../../../../../../services/fakeDb";
import { useSelector } from "react-redux";
const Quantitative = () => {
  const { task } = useSelector(({ validator }) => validator);
  const { mmode = [], volume = [], paramet = [], diastolic = [] } = task || {};
  const render2Values = (results) => {
    const width = 100 / results?.length;

    return (
      <div className="d-flex align-items-center h-100 w-100">
        {results?.map((result, index) => (
          <div
            key={`echo-mmMode-${index}-${result}`}
            className="text-center m-0 p-0 h-100  d-flex align-items-center justify-content-center"
            style={{
              width: `${width}%`,
              borderRight:
                index === 0 && results?.length > 1 && "1px solid #dee2e6",
            }}
          >
            {result || ""}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <span className="font-weight-bold  d-block">QUANTITATIVE DATA</span>

      <MDBTable
        small
        bordered
        style={{ borderCollapse: "collapse !important" }}
      >
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
            return (
              <tr key={`echo-mmode-${index}`}>
                <td className="py-1 text-center" style={{ fontWeight: 500 }}>
                  {field.title}
                </td>
                <td className="py-1 text-center">
                  <div dangerouslySetInnerHTML={{ __html: field.range }} />
                </td>
                <td
                  className="p-0 m-0 text-center   "
                  style={{
                    height: "1rem",
                    verticalAlign: "middle",
                    fontWeight: 400,
                  }}
                >
                  {render2Values(mmode[index])}
                </td>
                <td className="py-1" style={{ fontWeight: 500 }}>
                  {Echo.Volumes[index]?.title}
                </td>
                <td className="py-1">{Echo.Volumes[index]?.range}</td>
                <td
                  className="p-0 m-0 text-center "
                  style={{
                    height: "1rem",
                    verticalAlign: "middle",
                    fontWeight: 400,
                  }}
                >
                  {render2Values(volume[index])}
                </td>
              </tr>
            );
          })}

          <tr>
            {["Parameter", "", "MEASUREMENT", "DIASTOLIC FUNCTION", "", ""].map(
              (field, index) => (
                <th
                  key={`echo-parameter-${index}`}
                  className="py-1 text-center"
                >
                  <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
                    {field}
                  </span>
                </th>
              )
            )}
          </tr>

          {Echo.Paramets.map((field, index) => {
            return (
              <tr key={`echo-Parameters-${index}`}>
                <td className="py-1" style={{ fontWeight: 500 }}>
                  {field.title}
                </td>
                <td className="py-1">{field.range}</td>
                <td
                  className="p-0 m-0 text-center   "
                  style={{
                    height: "1rem",
                    verticalAlign: "middle",
                    fontWeight: 400,
                  }}
                >
                  {paramet[index] || ""}
                </td>
                <td className="py-1" style={{ fontWeight: 500 }}>
                  {Echo.Diastolic[index]?.title}
                </td>
                <td className="py-1">{Echo.Diastolic[index]?.range}</td>
                <td
                  className="p-0 m-0 text-center   "
                  style={{
                    height: "1rem",
                    verticalAlign: "middle",
                    fontWeight: 400,
                  }}
                >
                  {diastolic[index] || ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </MDBTable>
    </>
  );
};

export default Quantitative;
