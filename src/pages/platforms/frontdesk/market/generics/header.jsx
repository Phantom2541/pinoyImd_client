import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Search } from "../../../../../components/searchables";
import {
  BROWSE,
  SetFILTER,
  SetCREATE,
} from "../../../../../services/redux/slices/market/generics";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ generics }) => generics),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    dispatch(BROWSE({ token, params: { branchId: activePlatform?.branchId } }));
  }, [dispatch, token, activePlatform]);

  const handleAdd = (item) => dispatch(SetCREATE(item));

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections.length} Generics
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center"></div>
        <Search
          collections={collections}
          setFiltered={(items) => dispatch(SetFILTER(items))}
          placeHolder="Search Generics"
          haveAction={true}
          reset={() => dispatch(SetFILTER(collections))}
          hideButton={false}
          handleAdd={(item) => handleAdd(item)}
        />
      </div>
    </MDBView>
  );
};

export default Header;
