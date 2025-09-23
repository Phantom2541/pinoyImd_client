import { Banner } from "../../../../../../../services/utilities";
import Header from "../../../../../../../components/printout/task/radiology/header";
import Signatories from "../../../../../../../components/printout/task/radiology/signatories";
import BodySwitcher from "../../../../../../../components/printout/task/radiology/bodySwitcher";

const Radiology = ({ task }) => {
  const { branchId, remarks, signatories } = task;
  return (
    <div className="d-flex justify-content-center">
      <div
        className="radiology-container"
        style={{ zoom: "80%", width: "95%" }}
      >
        <Banner
          company={branchId.companyId.name}
          branch={branchId.name}
          bid={branchId?.bid || ""}
          className="radiology-banner"
        />
        <div className="radiology-body">
          <Header task={task} />
          <BodySwitcher task={task} />
          <div className="flex-spacer" />
        </div>

        <div className="radiology-footer">
          <div className="radiology-remarks d-flex mb-3 mx-5">
            <div style={{ paddingTop: "2px" }} className="mr-1 mb-1">
              Remarks:
            </div>
            <h5 className="fw-bold">{remarks}</h5>
          </div>
          <Signatories signatories={signatories} />
        </div>
      </div>
    </div>
  );
};

export default Radiology;
