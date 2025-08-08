import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Search } from "../../../../../../components/searchables";
import {
  BROWSE,
  SetFILTER,
} from "../../../../../../services/redux/slices/market/productsGenerics";
import { MDBView } from "mdbreact";
import { SetCREATE } from "../../../../../../services/redux/slices/market/productsGenerics";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(
      ({ productsGenerics }) => productsGenerics
    ),
    dispatch = useDispatch();
  //so this code above here gets the data from the redux store and put it here

  const handleAdd = (key) => dispatch(SetCREATE({ displayname: key }));

  useEffect(() => {
    if (token)
      dispatch(
        BROWSE({ token, params: { token, branchId: activePlatform.branchId } }) //there are no semicolon here cause its inside dispatch so its a function inside a function quite crzy isnt it it also amazes me on how this even works like what? why is there no semicolon i mean its still a function but its not supposed to have a semicolon like? how? its quite intriguing but i guess it makes sense(?)
      );
  }, [dispatch, token]); //this [dispatch, token] thing is used in some way as a validator. lets say a change happened what this would do is rerun the whole line of code so that it makes sure that the token(?) would receive the proper content. also dispatch works in a WINDSURF: "similar way to a function call but its a function inside a function." wtf is this guy saying. anyways dispatch's job is to send the data to the redux store.

  //ok so i think im nvm,..s;cqslcjhaljc

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "22rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {/* collections={collections} */}
          {collections?.length} generics
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

    // return() only return one container/tags(?) so you cant have a <div> outside of the mdbview since you will be returning two containers on the export side
  );
};
export default Header;
