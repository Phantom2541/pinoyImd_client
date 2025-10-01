import { Echo } from "../../../../../../services/fakeDb";

const MMMode = ({ task }) => {
  const { mmode = [] } = task || {};

  return (
    <>
      <tr>
        {[
          "M-MODE",
          "NORMAL RANGE",
          "VALUE",
          "VOLUMES",
          "NORMAL-RANGE",
          "EQUIVALENT",
        ].map((field, index) => (
          <th key={`echo-mmMode-${index}`} className="py-1">
            <span className="fw-bold" style={{ fontSize: "1rem" }}>
              {field}
            </span>
          </th>
        ))}
      </tr>
      {Echo.Mmode.map((field, index) => {
        const val = mmode[index] ?? "";
        return (
          <tr key={`echo-mmode-${index}`}>
            <td className="py-1">{field.title}</td>
            <td className="py-1 text-center fw-bold">{val}</td>
            <td className="py-1 text-center">
              <div dangerouslySetInnerHTML={{ __html: field.range }} />
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default MMMode;
