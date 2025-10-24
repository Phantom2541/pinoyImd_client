const references = ["11.0-13.0 sec.", "10.7-14.1 sec.", "0.8-1.1 %", ""];
const labels = ["Patient", "Control", "INR", "%Activity"];
const los = [11.0, 10.7, 0.8];
const his = [13.0, 14.1, 1.1];

const Protime = ({ pt = [0, 0, 0, 0] }) => {
  return (
    <>
      <tr>
        <td colSpan={3} className="py-0 fw-bold" style={{ fontSize: "1.1rem" }}>
          Prothrombin Time (PT)
        </td>
      </tr>
      {pt.map((item = 0, index) => {
        const hi = his[index];
        const lo = los[index];
        const label = labels[index];
        return (
          <tr key={index}>
            <td className="py-0">{label}</td>
            <td
              className="py-0 fw-bold text-center"
              style={{
                color:
                  index <= 2
                    ? item > hi
                      ? "red"
                      : item < lo
                      ? "blue"
                      : ""
                    : "",
              }}
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

export default Protime;
