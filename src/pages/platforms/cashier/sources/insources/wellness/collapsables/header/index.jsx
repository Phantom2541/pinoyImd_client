import { MDBCollapseHeader, MDBBtn } from "mdbreact";
import { collapse } from "../../../../../../../../services/utilities";
import { HMO, Memberships } from "../../../../../../../../services/fakeDb";
import EditableSelect from "../../../../../../../../components/customizable/editableSelect";
import EditableField from "../../../../../../../../components/customizable/editableField";
import PopOver from "./popOver";
import { useEffect, useState } from "react";
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
  handleUpdate,
  formSubmitted,
}) => {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const [hmoTags, setHmoTags] = useState([]);

  const { clients, _id, subName: ghostSubName, cutoff = 0 } = insource;
  const isGhost = clients?._id ? false : true;

  const { abbr, displayname } = clients || "";

  const baseSubname = isGhost ? ghostSubName : displayname;

  const { color, border } = collapse.getStyle(index, activeId, didHoverId);

  const isPopOver = (activeId === index || didHoverId === index) && !isGhost;

  const isEditableBranch =
    !clients?.companyId && !clients?.isVerified && !isGhost;

  const isWhiteColor = color === "text-white"; //para sa color ng small tag

  useEffect(() => {
    if (activePlatform) {
      const tags = activePlatform?.branch?.companyId?.hmo?.map(({ code }) => ({
        hmo: code,
        name: HMO.getName(code),
      }));
      setHmoTags(tags);
    }
  }, [activePlatform]);
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
              label: "HMO",
              keyForValue: "hmo",
              keyForText: "name",
              values: "text",
              isHMO: true,
              collections: hmoTags,
              width: "20rem",
            },
            {
              label: "Monthly Cutoff",
              keyForValue: "cutoff",
              collections: new Array(27).fill(0).map((_, i) => i + 1),
              width: "7rem",
            },
            {
              label: "Monthly Due Date",
              collections: new Array(cutoff > 0 ? Number(27 - cutoff) + 1 : 27)
                .fill(0)
                .map((_, i) => i + cutoff),
              keyForValue: "due",
              width: "7rem",
            },
            {
              label: "Credit",
              keyForValue: "credit",
              isMoney: true,
              isSelect: false,
            },
          ].map(
            (
              {
                label,
                keyForValue,
                keyForText = "",
                collections,
                width = "2rem",
                tag = "h6",
                isSelect = true,
                isMoney = false,
                isHMO = false,
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
                    fieldData={{
                      [keyForValue]: insource[keyForValue],
                      _id,
                      [keyForText || keyForValue]: isHMO
                        ? HMO.getName(insource["hmo"])
                        : insource[keyForText || keyForValue],
                    }}
                    preValue={
                      isHMO
                        ? HMO.getName(insource["hmo"])
                        : insource[keyForText || keyForValue]
                    }
                    keyForValue={keyForValue}
                    keyForText={keyForText || keyForValue}
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
                    fieldData={{ [keyForValue]: insource[keyForValue], _id }}
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
