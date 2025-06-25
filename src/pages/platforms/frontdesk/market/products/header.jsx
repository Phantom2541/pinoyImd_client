import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Search } from "../../../../../components/searchables";
import {BROWSE, SetCREATE, SetFILTER} from "../../../../../services/redux/slices/market/products";



const Header = () => {

  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ products }) => products),
    dispatch = useDispatch();
  
  useEffect(() => {
      if (token) {
        dispatch(BROWSE({ token, params: { branchId: activePlatform.branchId} }));
      }
    }, [token, dispatch, activePlatform]);
    
    useEffect(() => { console.log("HUH", collections); }, [collections]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          
          {collections.length} Productss
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Search
            collections={collections}
            setFiltered={(items) => dispatch(SetFILTER(items))}
            placeholder="Search generics..."
            haveAction={true}
            reset={() => dispatch(SetFILTER(collections))}
            hideButton={false}
            handleAdd={(item) => dispatch(SetCREATE({ displayname: item }))}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
