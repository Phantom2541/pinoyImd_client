import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBadge } from "mdbreact";
import { fullName } from "../../../../../services/utilities";
import { capitalize } from "lodash";
import { Input, Select } from "../../../../../components/customizable";
import { UPDATE } from "../../../../../services/redux/slices/assets/branches";
import { SetFILTERED } from "../../../../../services/redux/slices/assets/companies";
import EditableSelect from "../../../../../components/customizable/editableSelect";
import EditableField from "../../../../../components/customizable/editableField";
// ... your existing imports remain the same
export default function Collapsable({ branches, cid }) {
  const { token } = useSelector(({ auth }) => auth),
    [selected, setSelected] = useState({}),
    { isSuccess, formSubmitted } = useSelector(({ branches }) => branches),
    { collections } = useSelector(({ companies }) => companies),
    dispatch = useDispatch();

  const handleUpdate = ({ _id, key, value }) => {
    let data = { _id };

    if (key?.includes(".")) {
      // Handle nested update like settings.subscription
      const keys = key.split(".");
      const nested = keys.reduceRight((acc, curr) => ({ [curr]: acc }), value);
      data = { ...data, ...nested };
    } else {
      // Flat update like category
      data[key] = value;
    }

    dispatch(UPDATE({ token, data })).then(({ payload }) => {
      const fbranch = payload.payload;

      const _branches = branches.map((branch) =>
        branch._id === _id ? fbranch : branch
      );

      const _collections = collections.map((company) =>
        company._id === cid ? { ...company, branches: _branches } : company
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
          <th>Display Name</th>
          <th>Acronym</th>
          <th>Category</th>
          <th>Subscription</th>
          <th>Status</th>
          <th>Billing</th>
          <th>End Date</th>
          <th>Hiring</th>
          <th>AO</th>
          <th>Payor</th>
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
                <EditableField
                  title="Click to edit"
                  // className="form-control form-control-sm"
                  width="13rem"
                  type="string"
                  keyForValue="displayname"
                  fieldData={{
                    _id,
                    displayname,
                  }}
                  onSave={(data) =>
                    handleUpdate({
                      _id: data._id,
                      key: "displayname",
                      value: data.displayname,
                    })
                  }
                  formSubmitted={formSubmitted}
                  isSuccess={isSuccess}
                />
              </td>

              {/* <td>
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
              </td> */}

              {/* abbr */}
              <td>
                <EditableField
                  title="Click to edit"
                  // className="form-control form-control-sm"
                  width="13rem"
                  type="string"
                  keyForValue="abbr"
                  fieldData={{
                    _id,
                    abbr,
                  }}
                  onSave={(data) =>
                    handleUpdate({
                      _id: data._id,
                      key: "abbr",
                      value: data.abbr,
                    })
                  }
                  formSubmitted={formSubmitted}
                  isSuccess={isSuccess}
                />
              </td>

              {/* category */}
              <td>
                <EditableSelect
                  title="Click to edit"
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
                    handleUpdate({
                      _id: data._id,
                      key: "category",
                      value: data.category,
                    })
                  }
                />
              </td>

              {/* subscription */}
              <td>
                <EditableSelect
                  title="Click to edit"
                  isEditable
                  preValue={subscription}
                  collections={["demo", "subscriber", "loyalty", "lifetime"]}
                  selectStyle={{ width: "13rem" }}
                  keyForText="subscription"
                  keyForValue="subscription"
                  fieldData={{
                    _id,
                    subscription,
                  }}
                  formSubmitted={formSubmitted}
                  isSuccess={isSuccess}
                  onSave={(data) =>
                    handleUpdate({
                      _id: data._id,
                      key: "settings.subscription",
                      value: data.subscription,
                    })
                  }
                />
              </td>

              {/* status */}
              <td>
                <EditableSelect
                  title="Click to edit"
                  isEditable
                  preValue={status}
                  collections={["Active", "Expired", "Suspended", "Cancelled"]}
                  selectStyle={{ width: "13rem" }}
                  keyForText="status"
                  keyForValue="status"
                  fieldData={{
                    _id,
                    status,
                  }}
                  formSubmitted={formSubmitted}
                  isSuccess={isSuccess}
                  onSave={(data) =>
                    handleUpdate({
                      _id: data._id,
                      key: "settings.status",
                      value: data.status,
                    })
                  }
                />
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
