const references = ["11.0-13.0 sec.", "10.7-14.1 sec.", "0.8-1.1 %"];

const Protime = ({ pt = [0, 0] }) => {
  return (
    <>
      <tr>
        <td colSpan={3} className="py-0 fw-bold" style={{ fontSize: "1.1rem" }}>
          Prothrombin Time (PT)
        </td>
      </tr>
      {pt.map((item = 0, index) => {
        const hi = index === 0 ? 13.0 : 14.1;
        const lo = index === 0 ? 11.0 : 10.7;
        return (
          <tr key={index}>
            <td className="py-0">{index === 0 ? "Patient" : "Control"}</td>
            <td
              className="py-0 fw-bold text-center"
              style={{ color: item > hi ? "red" : item < lo ? "blue" : "" }}
            >
              {item}
            </td>
            <td className="py-0">{references[index]}</td>
          </tr>
        );
      })}
      <tr>
        <td className="py-0">INR</td>
        <td
          className="py-0 fw-bold text-center"
          style={{ color: pt[2] > 1.1 ? "red" : pt[2] < 0.8 ? "blue" : "" }}
        >
          {pt[2] ? pt[2].toFixed(2) : 0}
        </td>
        <td className="py-0">{references[2]}</td>
      </tr>
      <tr>
        <td className="py-0">%Activity</td>
        <td className="py-0 fw-bold text-center">
          {`${pt[3] ? pt[3].toFixed(2) : 0} %`}
        </td>
      </tr>
    </>
  );
};

export default Protime;
