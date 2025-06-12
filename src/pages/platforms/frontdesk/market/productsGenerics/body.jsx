import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import { Input } from "../../../../components/customizable/Input";
import { SetEDIT } from "../../../../services/redux/slices/reusable/table";

// You need to create this in your redux slice
// import { UpdateService } from "../../../../services/redux/slices/services";

import Swal from "sweetalert2";

const Body = () => {
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
          <th>Service</th>
          <th>Abbreviation</th>
          <th>Specimen</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { id, name, abbreviation, specimen } = item;
          const isSelected = selected.id === id;

          return (
            <tr key={id}>
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
                  <strong onClick={() => handleSelected(id, "name", name)}>
                    {name}
                  </strong>
                )}
              </td>

              {/* Abbreviation column */}
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
                  <strong
                    onClick={() =>
                      handleSelected(id, "abbreviation", abbreviation)
                    }
                  >
                    {abbreviation}
                  </strong>
                )}
              </td>

              {/* Specimen column */}
              <td>{specimen}</td>

              {/* Action buttons */}
              <td>
                <MDBBtnGroup>
                  <MDBBtn
                    color="danger"
                    size="sm"
                    rounded
                    onClick={() => handleDelete(id)}
                  >
                    <MDBIcon icon="trash" />
                  </MDBBtn>
                  <MDBBtn
                    color="primary"
                    size="sm"
                    rounded
                    onClick={() => dispatch(SetEDIT(item))}
                  >
                    <MDBIcon icon="pencil-alt" />
                  </MDBBtn>
                </MDBBtnGroup>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
