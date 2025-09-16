import { MDBBtn, MDBIcon } from "mdbreact";
import { dateFormat } from "../../../../../../services/utilities";

const Img = ({ preview = {}, setPreview = () => {} }) => {
  const { img = "", date, section = "" } = preview || {};
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <span style={{ fontWeight: 500 }}>
          {section} - {dateFormat(date)}
        </span>
        <MDBBtn
          onClick={() => setPreview({})}
          rounded
          title="Close"
          size="sm"
          color="danger"
          className="px-2"
        >
          <MDBIcon icon="times" />
        </MDBBtn>
      </div>
      <div className="d-flex justify-content-center ">
        <img
          src={img}
          style={{ maxWidth: "40rem", maxHeight: "29rem" }}
          className="shadow-lg"
        />
      </div>
    </div>
  );
};

export default Img;
