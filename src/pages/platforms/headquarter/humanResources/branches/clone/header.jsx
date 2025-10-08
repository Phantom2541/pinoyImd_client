import { MDBCard, MDBCardBody, MDBCol } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { capitalize } from "../../../../../../services/utilities";
import { SetCLONE } from "../../../../../../services/redux/slices/commerce/catalog/menus";
import utils from "./utils";

const Header = ({ identifier = "to" }) => {
  const { collections: branches } = useSelector(({ branches }) => branches);
  const { clone } = useSelector(({ menus }) => menus);
  const dispatch = useDispatch();
  const isFrom = identifier === "to";
  const filteredBranches = branches.filter(
    (branch) => branch?._id !== clone?.[isFrom ? "from" : "to"]?._id
  );

  const handleChangeBranch = (value) => {
    // const { from = {}, to = {} } = clone;
    // const fromCollections = [...from.collections];
    // const toCollections = [...to.collections];
    // const cluster = isFrom ? toCollections : fromCollections;

    // const { menus = [] } =
    //   branches.find((branch) => branch._id === value) || {};
    const _clone = utils.changeBranch(identifier, value, clone, branches);
    console.log("_clone", _clone);
    dispatch(SetCLONE(_clone));
    // dispatch(
    //   SetCLONE({
    //     ...clone,
    //     [identifier]: {
    //       ...clone?.[identifier],
    //       _id: value,
    //       collections: menus,
    //     },
    //   })
    // );
  };
  return (
    <>
      <MDBCol>
        <MDBCard style={{ borderRadius: "5px" }} className="border border-info">
          <MDBCardBody className="m-0 p-1 ">
            <div className="d-flex align-items-center">
              <h6 className="text-nowrap mt-2 mr-2" style={{ fontWeight: 500 }}>
                Clone {capitalize(identifier)}
              </h6>
              <select
                className="form-control form-control-sm bg-light"
                required
                value={clone?.[identifier]?._id}
                onChange={(e) => handleChangeBranch(e.target.value)}
              >
                <option value={""}>Select Branch</option>
                {filteredBranches.map((item, index) => (
                  <option key={index} value={item._id}>
                    {capitalize(item.name)} {item.isMain ? "(Main)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </>
  );
};

export default Header;
