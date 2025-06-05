import { MDBCollapseHeader, MDBBtn, MDBBadge } from "mdbreact";
import { collapse, currency } from "../../../../../../../services/utilities";
import { Select, Input } from "../../../../../../../components/customizable";
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
  update,
  setUpdate,
  handleUpdate,
  formSubmitted,
}) => {
  const { contractCategories: categories, category: activeCategory } =
    useSelector(({ providers }) => providers);
  const {
    clients,
    _id,
    category,
    status,
    subName: ghostSubName,
    cutoff = 0,
    credit = 0,
  } = insource;
  const isGhost = clients?._id ? false : true;

  const { abbr, displayname } = clients || "";

  const baseSubname = isGhost ? ghostSubName : displayname;

  const { color, border } = collapse.getStyle(index, activeId, didHoverId);

  const isPopOver = (activeId === index || didHoverId === index) && !isGhost;

  const isEditableBranch =
    !clients?.companyId && !clients?.isVerified && !isGhost;

  const isWhiteColor = color === "text-white"; //para sa color ng small tag

  const _category = categories.find((c) => c.value === category)?.text;

  const isDenied = status === "denied";

  const handleCategory = () => {
    switch (status) {
      case "pending":
        return "-";
      case "denied":
        return "Denied";
      default:
        return _category;
    }
  };
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
            {update.updatedKey === "branch" &&
            update.providerID === _id &&
            isEditableBranch ? (
              <Input
                className="mt-2 form-control form-control-sm"
                _key={"newName"}
                selected={update}
                formSubmitted={formSubmitted}
                onChange={(value) => setUpdate({ ...update, newName: value })}
                handleCheck={() => handleUpdate(false)}
                handleClose={() => setUpdate({})}
              />
            ) : (
              <h6
                style={{ marginBottom: "-4px", maxWidth: "28rem" }}
                onClick={() =>
                  setUpdate({
                    ...clients,
                    newName: clients.displayname,
                    updatedKey: "branch",
                    providerID: _id,
                  })
                }
              >
                {baseSubname}
              </h6>
            )}
            {update?.updatedKey === "abbr" && update?.providerID === _id ? (
              <div style={{ width: "6rem" }}>
                <Input
                  _key={"newAbbr"}
                  className="mt-2 form-control form-control-sm"
                  type="string"
                  selected={update}
                  formSubmitted={formSubmitted}
                  handleClose={() => setUpdate({})}
                  handleCheck={() => handleUpdate()}
                  onChange={(_, value) =>
                    setUpdate({
                      updatedKey: "abbr",
                      newAbbr: value,
                      abbr,
                      newKey: "newAbbr",
                      providerID: _id,
                    })
                  }
                />
              </div>
            ) : (
              <MDBBadge
                style={{ fontSize: "10px" }}
                onClick={() => {
                  setUpdate({
                    updatedKey: "abbr",
                    newAbbr: abbr,
                    providerID: _id,
                  });
                }}
              >
                {abbr ? abbr : "N/A"}
              </MDBBadge>
            )}
          </div>
          {!activeCategory && (
            <div className="mr-5">
              <small
                className={!isWhiteColor && "grey-text"}
                style={{ fontSize: "0.7rem" }}
              >
                Category
              </small>
              <h6 className={isDenied && "text-danger"}>{handleCategory()}</h6>
            </div>
          )}

          <div className="mr-5">
            <small
              style={{ fontSize: "0.7rem" }}
              className={!isWhiteColor && "grey-text"}
            >
              Monthly Cutoff
            </small>
            {update?.updatedKey === "cutoff" && update?.providerID === _id ? (
              <div style={{ width: "6rem" }}>
                <Select
                  className="m-0 p-0"
                  collections={new Array(27).fill(0).map((_, i) => i + 1)}
                  preValue={update.updatedValue}
                  handleCheck={() => handleUpdate()}
                  handleClose={() => setUpdate({})}
                  formSubmitted={formSubmitted}
                  onChange={(value) =>
                    setUpdate({
                      updatedKey: "cutoff",
                      newCutoff: value,
                      cutoff,
                      newKey: "newCutoff",
                      providerID: _id,
                    })
                  }
                  soloUpdate
                />
              </div>
            ) : (
              <h6
                onClick={() => {
                  setUpdate({
                    updatedKey: "cutoff",
                    updatedValue: cutoff,
                    providerID: _id,
                  });
                }}
              >
                {cutoff ? cutoff : "N/A"}
              </h6>
            )}
          </div>
          <div>
            <small
              style={{ fontSize: "0.7rem" }}
              className={!isWhiteColor && "grey-text"}
            >
              Credit
            </small>
            {update.updatedKey === "credit" && update?.providerID === _id ? (
              <div style={{ width: "9rem" }}>
                <Input
                  _key={"newCredit"}
                  className="mt-2 form-control form-control-sm"
                  type="number"
                  selected={update}
                  formSubmitted={formSubmitted}
                  handleClose={() => setUpdate({})}
                  handleCheck={() => handleUpdate()}
                  onChange={(_, value) =>
                    setUpdate({
                      updatedKey: "credit",
                      credit,
                      newCredit: Number(value),
                      newKey: "newCredit",
                      providerID: _id,
                    })
                  }
                />
              </div>
            ) : (
              <h6
                onClick={() => {
                  setUpdate({
                    updatedKey: "credit",
                    newCredit: credit,
                    providerID: _id,
                  });
                }}
              >
                {credit ? currency(credit) : "N/A"}
              </h6>
            )}
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
