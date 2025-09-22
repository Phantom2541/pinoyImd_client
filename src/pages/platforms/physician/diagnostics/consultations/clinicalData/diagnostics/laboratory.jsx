import Header from "../../../../../../../components/printout/task/laboratory/header";
import { Banner } from "../../../../../../../services/utilities";
import BodySwitcher from "../../../../../../../components/printout/task/laboratory/bodySwitcher";
import Signatories from "../../../../../../../components/printout/task/laboratory/signatories";
function chunkArray(array, size) {
  const result = [];
  const entries = Object.entries(array);
  for (let i = 0; i < entries.length; i += size) {
    result.push(Object.fromEntries(entries.slice(i, i + size)));
  }
  return result;
}

const Laboratory = ({ task, onloaded, setOnloaded }) => {
  const { branchId, remarks, signatories, packages } = task;
  const chunks = chunkArray(packages, 23); // adjust row count per page here
  return (
    <div className=" d-flex justify-content-center">
      <div
        className="laboratory-container"
        style={{ zoom: "80%", width: "95%" }}
      >
        {chunks.map((chunk, index) => (
          <div key={index} className="laboratory-page">
            <div className="laboratory-page-content">
              <Banner
                company={branchId.companyId?.name}
                branch={branchId.name}
                bid={branchId?.bid || ""}
                onloaded={onloaded}
                setOnloaded={setOnloaded}
                className="laboratory-banner"
              />
              <div className="laboratory-body">
                <Header task={task} />
                <BodySwitcher
                  task={{
                    ...task,
                    packages: chunk,
                    data: packages,
                  }}
                />
              </div>
            </div>

            <div className="laboratory-footer">
              <div className="laboratory-remarks d-flex px-1">
                <div style={{ paddingTop: "2px" }} className="mr-1 mb-1">
                  <span className="ml-2">Remarks:</span>
                </div>
                <h5 className="fw-bold">{remarks}</h5>
              </div>
              <div className="laboratory-line" />
              <Signatories signatories={signatories} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Laboratory;
