import { Echo } from "../../../../../../services/fakeDb";

const Volumes = ({ task }) => {
  const { volume = [] } = task || {};

  return (
    <>
      <tr>
        <th colSpan={4} className="py-1">
          <span className="fw-bold" style={{ fontSize: "1.2rem" }}>
            Volumes
          </span>
        </th>
      </tr>
      {Echo.Volumes.map((field, index) => {
        const val = volume[index] ?? "";
        return (
          <tr key={`echo-Volumes-${index}`}>
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

export default Volumes;
