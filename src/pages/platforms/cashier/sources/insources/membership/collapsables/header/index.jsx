import { MDBCollapseHeader, MDBBtn } from "mdbreact";
import { collapse } from "../../../../../../../../services/utilities";
import { Memberships } from "../../../../../../../../services/fakeDb";
import EditableSelect from "../../../../../../../../components/customizable/editableSelect";
import EditableField from "../../../../../../../../components/customizable/editableField";
import PopOver from "./popOver";

const Header = ({
  insource,
  registerGhostCompany,
  setDidHoverId,
  setSelected,
  setActiveId,
  activeId,
  didHoverId,
  index,
  handleUpdate,
  formSubmitted,
}) => {
  const { clients, _id, subName: ghostSubName, cutoff = 0 } = insource;
  const isGhost = clients?._id ? false : true;

  const { abbr, displayname } = clients || "";

  const baseSubname = isGhost ? ghostSubName : displayname;

  const { color, border } = collapse.getStyle(index, activeId, didHoverId);

  const isPopOver = (activeId === index || didHoverId === index) && !isGhost;

  const isEditableBranch =
    !clients?.companyId && !clients?.isVerified && !isGhost;

  const isWhiteColor = color === "text-white"; //para sa color ng small tag

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
        className={`d-flex justify-content-between ${color} `}
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
            <EditableField
              enableEditMode={isEditableBranch}
              inputStyle={{ maxWidth: "10rem" }}
              displayStyle={{ maxWidth: "20rem" }}
              className="mt-2 form-control form-control-sm"
              formSubmitted={formSubmitted}
              keyForValue="displayname"
              fieldData={{
                displayname: baseSubname,
                _id: clients._id,
                providerID: _id,
              }}
              onSave={(editedData) => handleUpdate(editedData, false)}
            />

            <div style={{ marginTop: "-0.3rem" }}>
              <EditableField
                className="mt-2 form-control form-control-sm"
                formSubmitted={formSubmitted}
                width="8rem"
                displayStyle={{
                  fontSize: "0.7rem",
                }}
                displayTag="badge"
                keyForValue="abbr"
                fieldData={{
                  abbr,
                  _id: clients._id,
                  providerID: _id,
                }}
                onSave={(editedData) => handleUpdate(editedData, false)}
              />
            </div>
          </div>
          {[
            {
              label: "Membership",
              keys: "membership",
              values: "text",
              collections: Memberships.collections.map(({ value, text }) => ({
                membership: value,
                text,
              })),
              width: "7rem",
            },
            {
              label: "Monthly Cutoff",
              keys: "cutoff",
              collections: new Array(27).fill(0).map((_, i) => i + 1),
              width: "2rem",
            },
            {
              label: "Monthly Due Date",
              collections: new Array(cutoff > 0 ? Number(27 - cutoff) + 1 : 27)
                .fill(0)
                .map((_, i) => i + cutoff),
              keys: "due",
              width: "2rem",
            },
            {
              label: "Credit",
              keys: "credit",
              isMoney: true,
              isSelect: false,
            },
          ].map(
            (
              {
                label,
                keys,
                collections,
                values = "",
                width = "2rem",
                tag = "h6",
                isSelect = true,
                isMoney = false,
              },
              index
            ) => (
              <div className="mr-5" key={index}>
                <small
                  style={{ fontSize: "0.7rem" }}
                  className={!isWhiteColor && "grey-text"}
                >
                  {label}
                </small>
                {isSelect ? (
                  <EditableSelect
                    collections={collections}
                    className="m-0 p-0"
                    isEditable={true}
                    fieldData={{ [keys]: insource[keys], _id }}
                    keys={keys}
                    values={values}
                    formSubmitted={formSubmitted}
                    onSave={(editedData) => handleUpdate(editedData)}
                    selectStyle={{ width }}
                    isMoney={isMoney}
                  />
                ) : (
                  <EditableField
                    tag={tag}
                    width="8rem"
                    className="mt-2 form-control form-control-sm"
                    formSubmitted={formSubmitted}
                    isMoney={isMoney}
                    keyForValue="credit"
                    fieldData={{ [keys]: insource[keys], _id }}
                    onSave={(editedData) => handleUpdate(editedData)}
                  />
                )}
              </div>
            )
          )}

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
              <PopOver index={index} setActiveId={setActiveId} _id={_id} />
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
