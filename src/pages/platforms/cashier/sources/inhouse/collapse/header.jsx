import { MDBTypography } from "mdbreact";
import { SearchUser } from "../../../../../../components/searchables";

const Header = ({
  handleTag = () => {},
  hasAffiliated = false,
  affiliated = 0,
}) => {
  return (
    <div className="mx-2 mt-2 d-flex justify-content-between align-items-center">
      <span style={{ fontWeight: 500 }}>
        Physician List {hasAffiliated && <span>({affiliated})</span>}
      </span>
      {!hasAffiliated && (
        <MDBTypography
          note
          noteColor="info"
          noteTitle="Description: "
          className="m-0 p-1 mr-n5  "
        >
          Search for a physician first to tag them to this branch.
        </MDBTypography>
      )}
      <div style={{ width: "25rem" }}>
        <SearchUser
          notFoundMessage="No Physician found."
          setPatient={handleTag}
          setRegister={(data) => handleTag(data, true)}
        />
      </div>
    </div>
  );
};

export default Header;
