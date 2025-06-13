import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable } from "mdbreact";
import { Input } from "../../../../../components/customizable";
import {
  DESTROY,
  ProductsGenerics,
  SetEDIT,
} from "../../../../../services/redux/slices/market/productsGenerics";
import Swal from "sweetalert2";

const Body = () => {
  const { token } = useSelector(({ auth }) => auth);
  const { filtered, activePage, maxPage, isSuccess } = useSelector(
    ({ services }) => services
  );

  const [selected, setSelected] = useState({});
  const dispatch = useDispatch();

  const handleUpdate = () => {
    const { id, key, value, old } = selected;
    if (value !== old) {
      console.log("Updating:", { id, [key]: value });

      // Uncomment and implement this in Redux
      // dispatch(UpdateService({ id, key, value }));
    }
    setSelected({});
  };

  const handleSelected = (id, key, value) => {
    if (selected.id === id && selected.key === key) {
      setSelected({});
    } else {
      setSelected({ id, key, value, old: value });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Deleted ID:", id);

        // Optionally dispatch delete action here
        // dispatch(DeleteService(id));
      }
    });
  };

  const itemsPerPage = maxPage || 10;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);

  return (
    <MDBTable responsive hover>
      <thead style={{ backgroundColor: "#f8f9fa", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Expense</th>
          <th>Section</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { _id, name, expense, section } = item;
          const isSelected = selected._id === _id;
          return (
            <tr key={_id}>
              <td>{index + startIndex + 1}</td>

              {/* Name column */}
              <td>
                {isSelected && selected.key === "name" ? (
                  <div style={{ width: "13rem" }}>
                    <Input
                      _key="value"
                      className="mt-2 form-control form-control-sm"
                      isSuccess={isSuccess}
                      selected={selected}
                      onChange={(key, val) =>
                        setSelected({ ...selected, [key]: val })
                      }
                      handleCheck={handleUpdate}
                      handleClose={() => setSelected({})}
                    />
                  </div>
                ) : (
                  <strong onClick={() => handleSelected(_id, "name", name)}>
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
                  <strong onClick={() => handleSelected({ _id, expense })}>
                    {expense}
                  </strong>
                )}
              </td>
              <td>
                {isSelected && selected.key === "abbreviation" ? (
                  <div style={{ width: "13rem" }}>
                    <Input
                      _key="value"
                      className="mt-2 form-control form-control-sm"
                      isSuccess={isSuccess}
                      selected={selected}
                      onChange={(key, val) =>
                        setSelected({ ...selected, [key]: val })
                      }
                      handleCheck={handleUpdate}
                      handleClose={() => setSelected({})}
                    />
                  </div>
                ) : (
                  <strong onClick={() => handleSelected({ _id, section })}>
                    {section}
                  </strong>
                )}
              </td>

              {/* Specimen column */}
              {/* <td>{specimen}</td> */}

              {/* Action buttons */}
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
