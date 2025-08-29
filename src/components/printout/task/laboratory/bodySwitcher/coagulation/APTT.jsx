const references = ["24-39 sec.", "24-39 sec."];

const APTT = ({ aptt = [] }) => {
  return (
    <>
      <tr>
        <td colSpan={3} className="py-0 fw-bold" style={{ fontSize: "1.1rem" }}>
          Activated Partial Thromboplastin Time (aPTT)
        </td>
      </tr>
      {aptt.map((item, index) => {
        return (
          <tr key={index}>
            <td className="py-0">{index == 0 ? "Patient" : "Control"}</td>
            <td className="py-0 fw-bold text-center">{item}</td>
            <td className="py-0">{references[index]}</td>
          </tr>
        );
      })}
    </>
  );
};

export default APTT;
