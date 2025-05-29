import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { Input } from "../../../../../components/customizable";
import { ProductGenerics } from "../../../manager/commerce/merchandise";

const Body = () => {
  const { filtered, activePage, maxPage, isSuccess } = useSelector(
      ({ productsGenerics }) => productsGenerics
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
  const paginatedData = filtered.slice(startIndex, endIndex);

  return (
    <MDBTable responsive hover bordered>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Expense</th>
          <th>Section</th>
        </tr>

        <td> </td>
        <td> name search </td>
        <td> catalog </td>
        <td> catalog </td>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { id, name, expense, section } = item;
          const isSelected = selected.id === id;
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
                  <strong onClick={() => handleSelected({ id, expense })}>
                    {expense}
                  </strong>
                )}
              </td>
              <td>{section}</td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
