import { MDBIcon, MDBView } from "mdbreact";

const Header = () => {
  return (
    <>
      <MDBView
        cascade
        className="gradient-card-header custom-header blue-gradient narrower py-2 d-flex justify-content-between align-items-center"
      >
        <div className="text-white  py-2">
          <MDBIcon far icon="calendar-check" className="mr-2" />
          Schedule your diagnostic services today!
        </div>
      </MDBView>
    </>
  );
};

export default Header;
