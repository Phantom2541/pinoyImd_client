import { MDBBtn, MDBCollapse, MDBIcon, MDBTable } from "mdbreact";
import { useDispatch } from "react-redux";
import {
  SetADD_SERVICES,
  SetSERVICES,
} from "../../../../../../../../../services/redux/slices/market/machines";
import {
  DESTROY,
  UPDATE,
} from "../../../../../../../../../services/indexDB/commerce/market/machines";
import Swal from "sweetalert2";
import { Search } from "../../../../../../../../../components/searchables";
import { useEffect, useState } from "react";
import EditableField from "../../../../../../../../../components/customizable/editableField";
const Services = ({ isOpen = false, _key, machine }) => {
  const [services, setServices] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setServices(machine?.services);
  }, [machine]);

  const handleDelete = async (item, index) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to delete the "${item.name}" service?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const _services = [...services];
        _services.splice(index, 1);
        dispatch(SetSERVICES({ machineID: machine._id, services: _services }));
        DESTROY(machine._id, item.id);
      }
    });
  };

  const handleUpdate = (data, index) => {
    const _services = [...machine.services];
    const editedData = { ..._services[index], code: data.code };
    _services[index] = editedData;
    dispatch(SetSERVICES({ machineID: machine._id, services: _services }));
    UPDATE(machine._id, editedData);
  };

  return (
    <>
      <tr>
        <td colSpan={8} className="m-0 p-0">
          <MDBCollapse id={_key} isOpen={isOpen} className="mx-2">
            <div className="d-flex justify-content-between align-items-center my-2">
              <h6 className="mt-2 ">
                <span style={{ fontWeight: 500 }}>
                  <span style={{ color: "blue" }}> {machine.section}</span> |
                  Services
                </span>
              </h6>
              <div className="d-flex align-items-center mr-2">
                <Search
                  collections={machine.services}
                  setFiltered={(results) => setServices(results)}
                  reset={() => setServices(machine.services)}
                  handleAdd={() => dispatch(SetADD_SERVICES(machine))}
                />
              </div>
            </div>
            <div style={{ maxHeight: "20rem", overflowY: "auto" }}>
              <MDBTable bordered small>
                <thead>
                  <tr>
                    <th>Services</th>
                    <th>Code</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length > 0 ? (
                    services.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>
                          <EditableField
                            width="12rem"
                            isCapitalize={false}
                            localUpdate
                            displayTag="span"
                            fieldData={{ id: item.id, code: item.code }}
                            onSave={(data) => handleUpdate(data, index)}
                            keyForValue="code"
                          />
                        </td>
                        <td>
                          <MDBBtn
                            size="sm"
                            color="danger"
                            rounded
                            onClick={() => handleDelete(item, index)}
                          >
                            <MDBIcon icon="trash" />
                          </MDBBtn>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">
                        No Services Record.
                      </td>
                    </tr>
                  )}
                </tbody>
              </MDBTable>
            </div>
          </MDBCollapse>
        </td>
      </tr>
    </>
  );
};

export default Services;
