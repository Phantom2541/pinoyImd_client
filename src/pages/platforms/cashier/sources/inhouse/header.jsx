import { MDBView } from "mdbreact";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

import {
  BROWSE,
  SetFILTERED,
} from "../../../../../services/redux/slices/assets/branches";
import { RESET } from "../../../../../services/redux/slices/assets/persons/physicians";
import { Search } from "../../../../../components/searchables";

const Header = () => {
  const { token, company } = useSelector(({ auth }) => auth),
    { message, isSuccess } = useSelector(({ physicians }) => physicians),
    { collections, isLoading } = useSelector(({ branches }) => branches),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  useEffect(() => {
    dispatch(BROWSE({ token, key: { companyId: company._id } }));
  }, [token, company, dispatch]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4  d-flex justify-content-between align-items-center"
    >
      <span>Inhouse {!isLoading && `(${collections.length})`}</span>
      <Search
        collections={collections}
        haveAction={false}
        setFiltered={(results) => dispatch(SetFILTERED(results))}
        reset={() => dispatch(SetFILTERED(collections))}
      />
    </MDBView>
  );
};

export default Header;
