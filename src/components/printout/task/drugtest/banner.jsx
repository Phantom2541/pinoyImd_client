import { Cloudinary, fullAddress } from "../../../../services/utilities";
const Banner = ({ task = {} }) => {
  const { branchId = {} } = task || {};
  const { companyId = {} } = branchId || {};
  return (
    <div className="d-flex ">
      <div className="d-flex">
        <img
          src={`${Cloudinary.getEndpoint()}/users/${
            task?.patient?.email
          }/profile.png?v=${Date.now()}`}
          alt="Profile"
          style={{ height: "150px", width: "150px" }}
        />
        <div className="align-self-end ml-1 ">
          <span style={{ fontWeight: 800 }}>UK922956</span>
          <span className="d-block mt-n1" style={{ fontWeight: 800 }}>
            46
          </span>
        </div>
      </div>
      <div className="text-center" style={{ lineHeight: "3rem" }}>
        <h6 className="font-weight-bold align-self-center">
          DEPARTMENT OF HEALTH
        </h6>
        <h6 className="font-weight-bold align-self-center mt-n2">
          {companyId?.name?.toUpperCase()}
        </h6>
        <h6 className="font-weight-bold mt-n2">
          DR. PAULINO J GARCIA MEMORIAL RESEARCH AND MEDICAL CENTER
        </h6>
        <h6 className="mt-n2" style={{ fontWeight: 400 }}>
          {fullAddress(companyId?.address, false)?.toUpperCase()}
        </h6>
        <h6 style={{ fontWeight: 500, fontSize: "0.8rem" }}>
          Phone Number: 044 4638888
        </h6>
        <h6 className="font-weight-bold" style={{ fontSize: "1.2rem" }}>
          DRUG TEST REPORT
        </h6>
      </div>
      <div className="ml-5">
        <h6
          className=" mb-4 ml-n2"
          style={{ fontSize: "0.9rem", marginTop: "-35px", fontWeight: 500 }}
        >
          Report ID: DTO-ROO
        </h6>
        <img
          className="align-self-center mt-n2"
          src={`${Cloudinary.getEndpoint()}/companies/${
            companyId?.name
          }/profile/logo.png?v=${Date.now()}`}
          alt="Profile"
          style={{ height: "100px", width: "100px", marginLeft: "4rem" }}
        />
      </div>
    </div>
  );
};

export default Banner;
