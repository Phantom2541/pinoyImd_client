import "./style.css";
import SIGNATURE from "../../../../assets/templateSampleSignature.png";

const Body = ({ task }) => {
  const Signatory = ({ isHead = false }) => {
    return (
      <div style={{ width: "50%" }} className="text-center">
        <h6 style={{ fontWeight: 800 }}>
          {!isHead ? "Test Conducted By" : "Approved By"}
        </h6>

        <div className="d-flex justify-content-center align-items-end mt-4">
          {!isHead && (
            <h6 className="mr-2" style={{ fontWeight: 800 }}>
              85
            </h6>
          )}

          {/* Signature + Name wrapper */}
          <div
            style={{
              position: "relative",
              borderBottom: "2px solid black",
              minWidth: "77%",
              textAlign: "center",
            }}
          >
            {/* Signature image */}
            <img
              src={SIGNATURE}
              alt="Signature"
              style={{
                position: "absolute",
                top: "-30px", // adjust para tumama sa gusto mong height
                left: "50%",
                transform: "translateX(-50%)",
                height: "70px", // depende sa laki na gusto mo
                opacity: 0.8, // para medyo faded
              }}
            />

            {/* Name */}
            <h6 style={{ marginBottom: "2px", fontWeight: 400 }}>
              RICHARD MACDON VALENCIA
            </h6>
          </div>

          {isHead && (
            <h6 className="ml-2" style={{ fontWeight: 800 }}>
              85
            </h6>
          )}
        </div>

        <h6 style={{ fontWeight: 800 }}>
          {!isHead ? "Analyst" : "Head of Laboratory"}
        </h6>
      </div>
    );
  };

  return (
    <div>
      <h6 style={{ fontWeight: 800 }}>Result</h6>
      <div style={{ width: "55rem" }}>
        <div className="d-flex justify-content-center">
          <table className="drug-test-table">
            <thead>
              <tr>
                <th style={{ fontWeight: 800 }}>
                  <i>Drug/Metabolite</i>
                </th>
                <th style={{ fontWeight: 800 }}>
                  <i>Result</i>
                </th>
                <th style={{ fontWeight: 800 }}>
                  <i>Remarks</i>
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { drug: "METHAMPHETAMINE", result: task?.met, remarks: "" },
                {
                  drug: "TETRAHYDROCANNABINOL",
                  result: task?.thc,
                  remarks: "",
                },
              ].map((row, index) => (
                <tr key={index}>
                  <td style={{ width: "37%" }}>{row.drug}</td>
                  <td style={{ width: "20%" }}>
                    {row.result ? "POSITIVE" : "NEGATIVE"}
                  </td>
                  <td>{row.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex align-items-center  mt-2">
          <Signatory />
          <Signatory isHead />
        </div>
      </div>
    </div>
  );
};

export default Body;
