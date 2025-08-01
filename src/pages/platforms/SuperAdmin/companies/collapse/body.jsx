import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBadge } from "mdbreact";
import { fullName } from "../../../../../services/utilities";
import { capitalize } from "lodash";
import { Input, Select } from "../../../../../components/customizable";
import { UPDATE } from "../../../../../services/redux/slices/assets/branches";
import { SetFILTERED } from "../../../../../services/redux/slices/assets/companies";
import EditableSelect from "../../../../../components/customizable/editableSelect";
// ... your existing imports remain the same
export default function Collapsable({ branches, cid }) {
  const { token } = useSelector(({ auth }) => auth),
    [selected, setSelected] = useState({}),
    { isSuccess, formSubmitted } = useSelector(({ branches }) => branches),
    { collections } = useSelector(({ companies }) => companies),
    dispatch = useDispatch();

  const handleUpdate = (data) => {
    const { _id, key, value } = data;

    dispatch(UPDATE({ token, data })).then(({ payload }) => {
      const fbranch = payload.payload;

      const _branches = branches.map((branch) =>
        branch._id === _id ? fbranch : branch
      );

      const _collections = collections.map((company) =>
        company?._id === cid ? { ...company, branches: _branches } : company
      );

      dispatch(SetFILTERED(_collections));
    });
    setSelected({});
  };

  const handleSelected = (data) => {
    const { _id, ...val } = data;
    const [key] = Object.keys(val);
    const value = val[key];
    if (selected?._id === _id && selected?.key === key) {
      setSelected({});
    } else {
      setSelected({ _id, key, value, old: val[key] });
    }
  };

  return (
    <MDBTable bordered>
      <MDBTableHead>
        <tr>
          <th>Branch</th>
          <th>displayname</th>
          <th>Acronym</th>
          <th>Category</th>
          <th>Subscription</th>
          <th>status</th>
          <th>billing</th>
          <th>startDate</th>
          <th>Hiring</th>
          <th>AO</th>
          <th>Action</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {branches?.map((branch, index) => {
          const {
            isMain = false,
            name,
            _id,
            displayname,
            abbr,
            category,
            settings = {},
            createdAt,
            isHiring,
          } = branch;
          const { subscription = "demo", billing, status } = settings;
          const isSelected = selected._id === _id;

          return (
            <tr key={index}>
              <td>
                <strong className="mr-1"> {++index}.</strong>
                {isSelected && selected.key === "name" ? (
                  <div
                    style={{ width: "13rem" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      _key={"value"}
                      className="mt-2 form-control form-control-sm"
                      isSuccess={isSuccess}
                      selected={selected}
                      onChange={
                        (key, val) => alert("hey you")
                        // setSelected({ ...selected, [key]: val })
                      }
                      handleCheck={(key, val) => {
                        alert("lolololol");
                        console.log("key", key, "val", val);

                        // handleUpdate(_id)
                      }}
                    />
                  </div>
                ) : (
                  <strong onClick={() => handleSelected({ _id, name })}>
                    {name}
                  </strong>
                )}
                {isMain && (
                  <MDBBadge color="warning" className="ml-2">
                    Main
                  </MDBBadge>
                )}
              </td>

              {/* displayname */}
              <td>
                {isSelected && selected.key === "displayname" ? (
                  <div
                    style={{ width: "13rem" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      _key={"value"}
                      className="mt-2 form-control form-control-sm"
                      isSuccess={isSuccess}
                      selected={selected}
                      onChange={(key, val) =>
                        setSelected({ ...selected, [key]: val })
                      }
                      handleCheck={() => handleUpdate()}
                    />
                  </div>
                ) : (
                  <span onClick={() => handleSelected({ _id, displayname })}>
                    {displayname || "N/A"}
                  </span>
                )}
              </td>

              {/* abbr */}
              <td>
                {isSelected && selected.key === "abbr" ? (
                  <div
                    style={{ width: "13rem" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      _key={"value"}
                      className="mt-2 form-control form-control-sm"
                      isSuccess={isSuccess}
                      selected={selected}
                      onChange={(key, val) =>
                        setSelected({ ...selected, [key]: val })
                      }
                      handleCheck={() => handleUpdate()}
                    />
                  </div>
                ) : (
                  <span onClick={() => handleSelected({ _id, abbr })}>
                    {abbr || "N/A"}
                  </span>
                )}
              </td>

              {/* category */}
              <td>
                <EditableSelect
                  title="Click to edit"
                  // classNameTxt="signatories-card-section"
                  isEditable
                  preValue={category}
                  collections={[
                    "supplier",
                    "laboratory",
                    "radiology",
                    "diagnostic",
                    "pharmacy",
                    "infirmary",
                    "rehabilitation",
                    "support",
                  ]}
                  selectStyle={{ width: "13rem" }}
                  keyForText="category"
                  keyForValue="category"
                  fieldData={{
                    _id,
                    category,
                  }}
                  formSubmitted={formSubmitted}
                  isSuccess={isSuccess}
                  onSave={(data) =>
                    handleUpdate({ _id: data._id, category: data.category })
                  }
                />
              </td>

              {/* subscription */}
              <td>
                {isSelected && selected.key === "subscription" ? (
                  <div
                    style={{ width: "13rem" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Select
                      keys={"subscription"}
                      collections={[
                        "demo",
                        "subscriber",
                        "loyalty",
                        "lifetime",
                      ]}
                      className="mt-2 form-control form-control-sm"
                      isSuccess={isSuccess}
                      selected={selected}
                      onChange={(key, value) =>
                        setSelected({ ...selected, value, key })
                      }
                      handleCheck={() => handleUpdate()}
                      soloUpdate={true}
                    />
                  </div>
                ) : (
                  <span onClick={() => handleSelected({ _id, subscription })}>
                    {capitalize(subscription) || "N/A"}
                  </span>
                )}
              </td>

              {/* status */}
              <td>
                {isSelected && selected.key === "status" ? (
                  <div
                    style={{ width: "13rem" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Select
                      keys={"status"}
                      collections={[
                        "Active",
                        "Expired",
                        "Suspended",
                        "Cancelled",
                      ]}
                      className="mt-2 form-control form-control-sm"
                      isSuccess={isSuccess}
                      selected={selected}
                      onChange={(key, value) =>
                        setSelected({ ...selected, value, key })
                      }
                      handleCheck={() => handleUpdate()}
                      soloUpdate={true}
                    />
                  </div>
                ) : (
                  <span onClick={() => handleSelected({ _id, status })}>
                    {capitalize(status) || "N/A"}
                  </span>
                )}
              </td>

              <td>{capitalize(billing) || "N/A"}</td>

              <td>
                {new Date(createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>

              {/* isHiring */}
              <td>
                {isSelected && selected.key === "isHiring" ? (
                  <div
                    style={{ width: "13rem" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Select
                      keys={"status"}
                      collections={["True", "False"]}
                      className="mt-2 form-control form-control-sm"
                      isSuccess={isSuccess}
                      selected={selected}
                      onChange={(key, value) =>
                        setSelected({ ...selected, value, key })
                      }
                      handleCheck={() => handleUpdate()}
                      soloUpdate={true}
                    />
                  </div>
                ) : (
                  <span onClick={() => handleSelected({ _id, isHiring })}>
                    {isHiring ? "Yes" : "No"}
                  </span>
                )}
              </td>

              <td>{fullName(branch?.ao?.fullName)}</td>
              <td></td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
