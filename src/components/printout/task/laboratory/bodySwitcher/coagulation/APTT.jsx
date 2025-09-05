const references = ["24-39 sec.", "24-39 sec."];

const APTT = ({ aptt = [0, 0] }) => {
  return (
    <>
      <tr>
        <td colSpan={3} className="py-0 fw-bold" style={{ fontSize: "1.1rem" }}>
          Activated Partial Thromboplastin Time (aPTT)
        </td>
      </tr>
      {aptt.map((item = 0, index) => {
        return (
          <tr key={index}>
            <td className="py-0">{index === 0 ? "Patient" : "Control"}</td>
            <td
              className="py-0 fw-bold text-center"
              style={{ color: item > 39.0 ? "red" : item < 24.0 ? "blue" : "" }}
            >
              {item}
            </td>
            <td className="py-0">{references[index]}</td>
          </tr>
        );
      })}
    </>
  );
};

export default APTT;
