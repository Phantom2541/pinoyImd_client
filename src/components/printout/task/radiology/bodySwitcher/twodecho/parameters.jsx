import { Echo } from "../../../../../../services/fakeDb";

const Parameters = ({ task }) => {
  const { paramet = [] } = task || {};

  return (
    <>
      <tr>
        <th colSpan={4} className="py-1">
          <span className="fw-bold" style={{ fontSize: "1.2rem" }}>
            Parameters
          </span>
        </th>
      </tr>
      {Echo.Paramets.map((field, index) => {
        const val = paramet[index] ?? "";
        return (
          <tr key={`echo-Parameters-${index}`}>
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

export default Parameters;
