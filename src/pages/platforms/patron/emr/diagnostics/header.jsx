import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TRACKER } from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { fullName, getAge } from "../../../../../services/utilities";
import { MDBView } from "mdbreact";
export default function Header() {
  const { token, auth } = useSelector(({ auth }) => auth),
    { _id, dob, fullName: fullname } = auth,
    dispatch = useDispatch();

  /**
   * Initial Fetch
   * Return all diagnostics
   * only same branch can de edited if meet conditions.
   *  1. same branch
   *  2. same department
   *  3. same performer
   *  4. with in 7 days
   */
  useEffect(() => {
    dispatch(
      TRACKER({
        token,
        key: {
          customerId: auth._id,
        },
      })
    );
  }, [auth, dispatch, token]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <span className="mb-0">
        {_id ? fullName(fullname) : "Tracker"} | &nbsp;
        {_id && getAge(dob)}
      </span>
    </MDBView>
  );
}
