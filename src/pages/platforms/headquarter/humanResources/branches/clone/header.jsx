import { MDBCard, MDBCardBody, MDBCol } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { capitalize } from "../../../../../../services/utilities";
import { SetCLONE } from "../../../../../../services/redux/slices/commerce/catalog/menus";
import utils from "./utils";

const Header = ({ identifier = "to", isMain = false, title = "" }) => {
  const { collections: branches } = useSelector(({ branches }) => branches);
  const { clone } = useSelector(({ menus }) => menus);
  const dispatch = useDispatch();
  const isFrom = identifier === "to";
  const filteredBranches = branches.filter(
    (branch) => branch?._id !== clone?.[isFrom ? "from" : "to"]?._id
  );

  const handleChangeBranch = (value) => {
    const _clone = utils.changeBranch(identifier, value, clone, branches);
    dispatch(SetCLONE(_clone));
  };
  return (
    <>
      <MDBCol key={identifier}>
        <MDBCard style={{ borderRadius: "5px" }} className="border border-info">
          <MDBCardBody className="m-0 p-1 ">
            <div className="d-flex align-items-center">
              <h6 className="text-nowrap mt-2 mr-2" style={{ fontWeight: 500 }}>
                {title}
              </h6>
              <select
                className="form-control form-control-sm bg-light"
                required
                value={clone?.[identifier]?._id}
                onChange={(e) => handleChangeBranch(e.target.value)}
              >
                <option value={""} disabled>
                  Select Branch
                </option>
                {filteredBranches.map((item, index) => (
                  <option key={index} value={item._id}>
                    {capitalize(item.name)} {item.isMain ? "(Main)" : ""}
                  </option>
                ))}
              </select>
              {isMain && (
                <select
                  className="form-control form-control-sm bg-light ml-3"
                  style={{ width: "7rem" }}
                  value={clone?.type}
                  onChange={({ target }) => {
                    dispatch(
                      SetCLONE({
                        ...clone,
                        type: target.value,
                        from: { ...clone.from, deleted: [] },
                        to: { ...clone.to, deleted: [] },
                      })
                    );
                    console.log(clone);
                  }}
                >
                  <option value={"menus"}>Menus</option>
                  <option value={"services"}>Services</option>
                </select>
              )}
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </>
  );
};

export default Header;
