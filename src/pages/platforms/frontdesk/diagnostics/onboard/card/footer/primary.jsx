import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { SetSELECTED } from "../../../../../../../services/redux/slices/commerce/pos/services/taskGenerator";
import { Services } from "../../../../../../../services/fakeDb";
import { axiosMiddleware } from "../../../../../../../services/utilities";

const PrimaryFooter = ({ deal }) => {
  const { activePlatform } = useSelector(({ auth }) => auth);
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
    const patients = ["001ARNOLD GANIA	SP CHOLESTEROL	SER"];
    try {
      const response = await axiosMiddleware.sendToA15(patients);
      console.log("✅ Response from middleware:", response);
      // You can use: response.success, response.payload, etc.
    } catch (err) {
      console.error("❌ Failed to send to A15:", err.message);
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
      </MDBBtnGroup>
    </>
  );
};

export default PrimaryFooter;
