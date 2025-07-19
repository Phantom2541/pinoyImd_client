import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBadge } from "mdbreact";
import { fullName } from "../../../../../services/utilities";
import { capitalize } from "lodash";
import { Input, Select } from "../../../../../components/customizable";
import { UPDATE } from "../../../../../services/redux/slices/assets/branches";
import { SetFILTERED } from "../../../../../services/redux/slices/assets/companies";

export default function Collapsable({ branches, cid }) {
  const { token } = useSelector(({ auth }) => auth),
    [selected, setSelected] = useState({}),
    { isSuccess } = useSelector(({ branches }) => branches),
    { collections } = useSelector(({ companies }) => companies),
    dispatch = useDispatch();

  const handleUpdate = () => {
    const { _id, key, value } = selected;
    console.log("selected", selected);
    dispatch(UPDATE({ token, data: { _id, [key]: value } })).then(
      ({ payload }) => {
        const _branches = branches.map((branch) =>
          branch._id === _id ? payload : branch
        );

        const _collections = collections.map((company) =>
          company?._id === cid
            ? {
                ...company,
                branches: _branches,
              }
            : company
        );
        dispatch(SetFILTERED(_collections));
      }
    );
    setSelected({});
  };

  const handleSelected = (data) => {
    const { _id, ...val } = data;
    const [key] = Object.keys(val);
    const value = val[key];

    // If already selected, toggle off
    if (selected?._id === _id) {
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
          <th>billing</th>
          <th>status</th>
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
                  <div style={{ width: "13rem" }}>
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
              <td>
                {isSelected && selected.key === "displayname" ? (
                  <div style={{ width: "13rem" }}>
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
              <td>
                {isSelected && selected.key === "abbr" ? (
                  <div style={{ width: "13rem" }}>
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
              <td>
                {isSelected && selected.key === "category" ? (
                  <div style={{ width: "13rem" }}>
                    <Select
                      keys={"category"}
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
                      className="mt-2 form-control form-control-sm"
                      isSuccess={isSuccess}
                      selected={selected}
                      onChange={(key, value) =>
                        setSelected({ ...selected, value, key })
                      }
                      handleCheck={() => handleUpdate()}
                      // multiple={true} // not functioning
                      soloUpdate={true}
                    />
                  </div>
                ) : (
                  <span onClick={() => handleSelected({ _id, category })}>
                    {capitalize(category) || "N/A"}
                  </span>
                )}
              </td>
              <td>
                {isSelected && selected.key === "subscription" ? (
                  <div style={{ width: "13rem" }}>
                    <Select
                      keys={"subscription"}
                      collections={["demo", "subscription", "lifetime"]}
                      className="mt-2 form-control form-control-sm"
                      isSuccess={isSuccess}
                      selected={selected}
                      onChange={(key, value) =>
                        setSelected({ ...selected, value, key })
                      }
                      handleCheck={() => handleUpdate()}
                      // multiple={true} // not functioning
                      soloUpdate={true}
                    />
                  </div>
                ) : (
                  <span onClick={() => handleSelected({ _id, subscription })}>
                    {capitalize(subscription) || "N/A"}
                  </span>
                )}
              </td>
              <td>{capitalize(billing) || "N/A"} </td>
              <td>
                {isSelected && selected.key === "status" ? (
                  <div style={{ width: "13rem" }}>
                    <Select
                      keys={"status"}
                      collections={[
                        "Active",
                        "Expired",
                        " Suspended",
                        "Cancelled",
                      ]}
                      className="mt-2 form-control form-control-sm"
                      isSuccess={isSuccess}
                      selected={selected}
                      onChange={(key, value) =>
                        setSelected({ ...selected, value, key })
                      }
                      handleCheck={() => handleUpdate()}
                      // multiple={true} // not functioning
                      soloUpdate={true}
                    />
                  </div>
                ) : (
                  <span onClick={() => handleSelected({ _id, status })}>
                    {capitalize(status) || "N/A"}
                  </span>
                )}
              </td>
              <td>{createdAt} </td>
              <td>
                {isSelected && selected.key === "isHiring" ? (
                  <div style={{ width: "13rem" }}>
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
                      // multiple={true} // not functioning
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
