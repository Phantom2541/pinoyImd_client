import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { SetSELECTED } from "../../../../../../../services/redux/slices/commerce/pos/services/taskGenerator";
import { Services } from "../../../../../../../services/fakeDb";
import { axiosMiddleware } from "../../../../../../../services/utilities";
import { LABRESULT } from "../../../../../../../services/redux/slices/commerce/pos/services/deals.js";
import Swal from "sweetalert2";

const PrimaryFooter = ({ deal }) => {
  const { activePlatform, token } = useSelector(({ auth }) => auth);
  const { rendered = [], cart = [] } = deal;
  const dispatch = useDispatch();

  const department = activePlatform.department === "Laboratory" ? "LAB" : "RAD";

  const preAnalytical = async (deal) => {
    console.log("preAnalytical", deal);
  };

  const { dept } =
    rendered?.find(
      ({ dept }) =>
        dept === (activePlatform.department === "Laboratory" ? "LAB" : "RAD")
    ) || {};

  const handlePrintOut = (isResult = false) => {
    const list = cart?.flatMap((item) => item.packages || []);
    const _inhouse = Services.whereIn(list);
    const inhouseIDS = _inhouse.map(({ id }) => id);
    const forms = Services.getTemplates(inhouseIDS, department);

    localStorage.setItem("inhouse", JSON.stringify({ deal, forms, isResult }));
    window.open(
      "/printout/request/form",
      "RequestForm",
      "top=100px,left=100px,width=500px,height=750px"
    );
  };

  const handleReWrite = async () => {
    const patients = ["003 ARNOLD GANIA	SP CHOLESTEROL	SER "];
    try {
      const response = await axiosMiddleware.sendToA15(patients, token);
      console.log("✅ Response from middleware:", response);
      // You can use: response.success, response.payload, etc.
    } catch (err) {
      console.error("❌ Failed to send to A15:", err.message);
    }
  };
  const extractDriveFileId = (url) => {
    try {
      const regex = /[-\w]{25,}/;
      const match = url.match(regex);
      return match ? match[0] : null;
    } catch {
      return null;
    }
  };
  const previewDriveFile = async (task) => {
    const { value: link } = await Swal.fire({
      title: "Paste Google Drive Link",
      input: "text",
      inputLabel: "Google Drive File Link",
      inputPlaceholder:
        "e.g. https://drive.google.com/file/d/FILE_ID/view?usp=sharing",
      showCancelButton: true,
    });

    if (link) {
      const fileId = extractDriveFileId(link);
      if (!fileId) {
        Swal.fire({
          icon: "error",
          title: "Invalid Link",
          text: "Could not extract File ID. Please check your link.",
        });
        return;
      }

      const previewLink = `https://drive.google.com/file/d/${fileId}/preview`;

      const result = await Swal.fire({
        title: "Google Drive Preview",
        html: `
            <iframe src="${previewLink}" width="100%" height="400" frameborder="0" allow="autoplay"></iframe>
          `,
        width: 600,
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Save Link",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const updatedTask = {
          ...task,
          fileId: link,
          department: "Radiology",
        };

        dispatch(LABRESULT({ token, data: updatedTask }));

        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "The link has been saved in fileId with department set.",
        });
      }
    }
  };

  return (
    <>
      <MDBBtnGroup className="sales-card-footer w-100 d-flex flex-row">
        <MDBBtn
          type="button"
          onClick={handleReWrite}
          className="m-0 "
          size="sm"
          title="Send to middleware"
          color="primary"
        >
          <MDBIcon fas icon="arrow-right" />
        </MDBBtn>
        <MDBBtn
          type="button"
          onClick={() => preAnalytical(deal)}
          className="m-0 "
          size="sm"
          title="Ingridients"
          color="primary"
        >
          <MDBIcon fas icon="tools" />
        </MDBBtn>
        {dept && (
          <>
            <MDBBtn
              type="button"
              onClick={() => handlePrintOut(false)}
              className="m-0 "
              title="Print Barcode"
              size="sm"
              color="primary"
            >
              <MDBIcon icon="barcode" />
            </MDBBtn>
            <MDBBtn
              type="button"
              onClick={() => handlePrintOut(true)}
              className="m-0 "
              title="Print Result Notes"
              size="sm"
              color="primary"
            >
              <MDBIcon icon="print" />
            </MDBBtn>
          </>
        )}
        {activePlatform.department === "Laboratory" ? (
          <MDBBtn
            type="button"
            onClick={() => dispatch(SetSELECTED(deal))}
            className="m-0 "
            title="Generate Task"
            size="sm"
            color="primary"
          >
            <MDBIcon icon="cog" spin />
          </MDBBtn>
        ) : (
          <>
            <MDBBtn
              type="button"
              onClick={() => previewDriveFile(deal)}
              className="m-0 "
              title="Generate Task"
              size="sm"
              color="primary"
            >
              <MDBIcon icon="cog" spin />
            </MDBBtn>
          </>
        )}
      </MDBBtnGroup>
    </>
  );
};

export default PrimaryFooter;
