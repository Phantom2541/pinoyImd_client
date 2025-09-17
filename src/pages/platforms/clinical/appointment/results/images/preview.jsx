import { MDBBtn, MDBIcon } from "mdbreact";
import { Cloudinary, dateFormat } from "../../../../../../services/utilities";
import { useSelector } from "react-redux";

const Img = ({ preview = {}, setPreview = () => {} }) => {
  const { selected } = useSelector(({ appointments }) => appointments);
  const { img = "", date, section = "", imgId = "" } = preview || {};
  const { patient = {} } = selected || {};

  const src = img
    ? img
    : `${Cloudinary.getEndpoint()}/${imgId}/users/${
        patient?.email
      }/EHR/${section}_${date}`;
  return (
    <div style={{ minHeight: "27rem" }}>
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
          src={src}
          onError={(e) => (e.target.src = img)}
          style={{ maxWidth: "40rem", maxHeight: "27rem" }}
          className="shadow-lg"
        />
      </div>
    </div>
  );
};

export default Img;
