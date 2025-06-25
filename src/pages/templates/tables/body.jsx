import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { Input } from "../../../components/customizable";

const Body = () => {
  const { filtered, activePage, maxPage, isSuccess } = useSelector(
      ({ services }) => services
    ),
    [selected, setSelected] = useState({});

  const handleUpdate = () => {
    const { id, key, value } = selected;
    console.log("selected", { id, [key]: value });
    // dispatch here to update the selected item
    setSelected({});
  };

  const handleSelected = (data) => {
    const { id, ...val } = data; // note: on handling data from collection, please use _id
    const [key] = Object.keys(val);
    const value = val[key];

    console.log("data", data);

    console.log("selected", { id, key, value });

    // If already selected, toggle off
    if (selected?._id === id) {
      setSelected({});
    } else {
      setSelected({ id, key, value, old: val[key] });
    }
  };

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page
  return (
    <MDBTable responsive hover bordered>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Service</th>
          <th>Abbreviation</th>
          <th>Specimen</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { id, name, abbreviation, specimen } = item;
          const isSelected 
          = selected.id === id;
          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>
              <td>
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
                      handleClose={() => setSelected({})}
                    />
                  </div>
                ) : (
                  <strong onClick={() => handleSelected({ id, name })}>
                    {name}
                  </strong>
                )}
              </td>
              <td>
                {isSelected && selected.key === "abbreviation" ? (
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
                      handleClose={() => setSelected({})}
                    />
                  </div>
                ) : (
                  <strong onClick={() => handleSelected({ id, abbreviation })}>
                    {abbreviation}
                  </strong>
                )}
              </td>
              <td>{specimen}</td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
