import { MDBView } from "mdbreact";
import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import Search from "./search";
import { useDispatch, useSelector } from "react-redux";
import { RESET } from "../../../../services/redux/slices/assets/persons/users";

const Header = () => {
  const { auth } = useSelector(({ auth }) => auth),
    { isSuccess, message } = useSelector(({ users }) => users),
    dispatch = useDispatch(),
    { addToast } = useToasts();
  useEffect(() => {
    if (auth._id && message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
      dispatch(RESET());
    }
  }, [auth, isSuccess, message, dispatch, addToast]);
  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4  d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          Password Reseter
        </span>
      </div>

      <div style={{ width: "25rem" }}>
        <Search />
      </div>
    </MDBView>
  );
};

export default Header;
