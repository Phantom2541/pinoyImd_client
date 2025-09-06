import { useDispatch, useSelector } from "react-redux";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { capitalize, fetchTracker, Tracker } from "../../../services/utilities";
import { SETACTIVEPLATFORM } from "../../../services/redux/slices/assets/persons/auth.js";
import { BROWSE } from "../../../services/redux/slices/tracker.js";

export default function Branches() {
  const {
      branches = [],
      access,
      activePlatform = {},
      token,
      auth,
    } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const handleActiveBranch = (branchId) => {
    const _access =
      access
        .filter((branch) => branch.branchId === branchId)
        .flatMap(({ platform }) => platform) || [];

    const data = {
      _id: auth._id,
      email: auth.email,
      activePlatform: {
        ...activePlatform,
        branchId,
        position: branchId.posotion,
        access: [..._access],
        platform: "patron",
      },
    };
    fetchTracker.reset();
    dispatch(SETACTIVEPLATFORM({ data, token }));
    dispatch(BROWSE({ token, params: { branchId } })).then((action) => {
      const { payload = {} } = action.payload;
      Tracker.set(payload);
    });
  };

  const { branch = {} } = activePlatform || {};
  // &&
  // branches[0]?.name === activePlatform?.branch?.name
  return (
    <MDBDropdown>
      {branches.length > 1 && (
        <MDBDropdownToggle nav caret>
          <MDBIcon icon="code-branch" />
          &nbsp;
          <div className="d-none d-md-inline">
            {branch?.name ? capitalize(branch?.name) : ""}
          </div>
        </MDBDropdownToggle>
      )}
      <MDBDropdownMenu right>
        {branches?.map(({ name, _id }, index) => (
          <MDBDropdownItem
            active={_id === activePlatform?.branchId}
            key={`branch-${index}`}
            onClick={() => handleActiveBranch(_id)}
          >
            {capitalize(name)}
          </MDBDropdownItem>
        ))}
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
