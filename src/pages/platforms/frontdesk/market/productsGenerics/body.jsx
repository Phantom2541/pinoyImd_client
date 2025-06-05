import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable } from "mdbreact";
import { Input } from "../../../../../components/customizable";
import {
  ProductsGenerics,
  SetEDIT,
} from "../../../../../services/redux/slices/market/productsGenerics";

const Body = () => {
  const { filtered, activePage, maxPage, isSuccess } = useSelector(
      ({ productsGenerics }) => productsGenerics
    ),
    [selected, setSelected] = useState({}),
    dispatch = useDispatch();

  console.log("filtered", selected);

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
  const handleUpdate = (item) => {
    dispatch(SetEDIT(item));
  };
  const handleDelete = (id) => console.log("handleDelete : ", id);

  return (
    <MDBTable responsive hover bordered>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Subname</th>
          <th>Expense</th>
          <th>Section</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { _id, name, subname, expense, section } = item;
          const isSelected = selected._id === _id;
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
                  <strong onClick={() => handleSelected({ _id, name })}>
                    {name}
                  </strong>
                )}
              </td>
              <td>
                {isSelected && selected.key === "subname" ? (
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
                  <strong onClick={() => handleSelected({ _id, subname })}>
                    {subname}
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
                  <strong onClick={() => handleSelected({ _id, expense })}>
                    {expense}
                  </strong>
                )}
              </td>
              <td>
                <strong>{section}</strong>
              </td>
              <td>
                <button
                  onClick={() => handleUpdate(item)}
                  className="btn btn-primary btn-sm mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(_id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
