import { Echo } from "../../../../../../services/fakeDb";

const Diastolic = ({ task }) => {
  const { diastolic = [] } = task || {};

  return (
    <>
      <tr>
        <th colSpan={4} className="py-1">
          <span className="fw-bold" style={{ fontSize: "1.2rem" }}>
            Diastolic
          </span>
        </th>
      </tr>
      {Echo.Diastolic.map((field, index) => {
        const val = diastolic[index] ?? "";
        return (
          <tr key={`echo-Diastolic-${index}`}>
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

export default Diastolic;
