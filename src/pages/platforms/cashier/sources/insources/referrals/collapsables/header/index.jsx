import { MDBCollapseHeader, MDBBtn, MDBBadge } from "mdbreact";
import {
  collapse,
  fullAddress,
} from "../../../../../../../../services/utilities";
import PopOver from "./popOver";
import { useSelector } from "react-redux";

const Header = ({
  insource,
  registerGhostCompany,
  setDidHoverId,
  setSelected,
  setActiveId,
  activeId,
  didHoverId,
  index,
}) => {
  const { contractCategories: categories } = useSelector(
    ({ providers }) => providers
  );
  const { clients, _id, contract, status, subName: ghostSubName } = insource;
  const isGhost = clients?._id ? false : true;

  const { abbr, displayname, address = {} } = clients || "";

  const baseSubname = isGhost ? ghostSubName : displayname;

  const { color, border } = collapse.getStyle(index, activeId, didHoverId);

  const isPopOver = (activeId === index || didHoverId === index) && !isGhost;

  const isWhiteColor = color === "text-white"; //para sa color ng small tag

  const _category = categories.find((c) => c.value === contract)?.text;
  console.log("_category", _category);

  return (
    <MDBCollapseHeader
      onMouseLeave={() => setDidHoverId(-1)}
      onMouseEnter={() => setDidHoverId(index)}
      onClick={(event) => {
        event.stopPropagation();
        if (isGhost) return registerGhostCompany(insource);
        setSelected({
          branchId: clients?._id,
          providerId: _id,
        });
      }}
      className={`${border} m-0 p-3`}
      title={isGhost && "Unregistered company"}
      style={{ borderRadius: "50%" }}
    >
      <div
        className={`d-flex justify-content-between  ${color} `}
        style={{ color: color === "text-white" && "white !important" }}
      >
        <div className="d-flex align-items-start">
          <div className="mr-5">
            <small
              style={{ fontSize: "0.7rem" }}
              className={!isWhiteColor && "grey-text"}
            >
              Branch
            </small>
            <h6 style={{ marginBottom: "-4px", maxWidth: "28rem" }}>
              {baseSubname}
            </h6>

            <MDBBadge style={{ fontSize: "10px" }}>
              {abbr ? abbr : "N/A"}
            </MDBBadge>
          </div>
          <div className="mr-1">
            <small
              style={{ fontSize: "0.7rem" }}
              className={!isWhiteColor && "grey-text"}
            >
              Address
            </small>
            <h6 style={{ marginBottom: "-4px", maxWidth: "28rem" }}>
              {fullAddress(address)}
            </h6>
          </div>

          {isGhost && (
            <span
              style={{ fontSize: "20px" }}
              className="ml-2"
              role="img"
              aria-label="ghost"
            >
              👻
            </span>
          )}

          {isPopOver && (
            <div className="d-flex align-items-center h-100 ml-3">
              <PopOver
                index={index}
                _id={_id}
                clients={clients}
                isApplicant={status === "pending"}
              />
            </div>
          )}
        </div>

        <small
          className="d-flex justify-content-between align-items-center"
          onClick={() => {
            setActiveId((prev) => (prev === index ? -1 : index));
            setSelected({
              branchId: clients?._id,
              providerId: _id,
            });
          }}
        >
          <MDBBtn
            size="sm"
            color="white"
            rounded
            className="m-0 p-0 transition-all "
            onClick={() => {
              if (isGhost) return registerGhostCompany(insource);
            }}
            style={{
              height: "1.3rem",
              width: activeId === index ? "1.5rem" : "2rem",
            }}
          >
            <i
              style={{
                rotate: `${activeId === index ? 0 : 90}deg`,
              }}
              className="fa fa-angle-down transition-all "
            />
          </MDBBtn>
        </small>
      </div>
    </MDBCollapseHeader>
  );
};

export default Header;
