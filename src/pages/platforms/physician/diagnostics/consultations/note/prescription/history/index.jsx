import { useSelector } from "react-redux";
import Body from "./body";
import Header from "./header";
import Patient from "./patient";

const History = () => {
  const { patient = {} } = useSelector(({ appointments }) => appointments);
  const { consultations = [] } = patient || {};
  return (
    <>
      <Header />

      <div style={{ maxHeight: "100%", overflowY: "auto" }}>
        {consultations?.map((c, idx) => (
          <div
            key={idx}
            style={{
              height: "100%",
              borderBottom: "2px dashed #ccc",
              marginTop: idx > 0 && "8px",
            }}
          >
            <Patient consultation={c} />
            <Body consultation={c} />
          </div>
        ))}
      </div>
    </>
  );
};

export default History;
