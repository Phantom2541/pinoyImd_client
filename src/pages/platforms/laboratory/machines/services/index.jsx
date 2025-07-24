import { MDBBtn, MDBCollapse, MDBIcon, MDBTable } from "mdbreact";
import { useDispatch } from "react-redux";
import { SetADD_SERVICES } from "../../../../../services/redux/slices/market/machines";
const Services = ({ isOpen = false, _key, machine }) => {
  const dispatch = useDispatch();
  return (
    <>
      <tr>
        <td colSpan={8} className="m-0 p-0">
          <MDBCollapse id={_key} isOpen={isOpen} className="mx-2">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mt-2 ml-1">
                <span style={{ fontWeight: 500 }}>
                  {machine.section} | Services
                </span>
              </h6>
              <MDBBtn
                size="sm"
                onClick={() => dispatch(SetADD_SERVICES(machine))}
              >
                <MDBIcon className="mr-2" icon="plus" />
                Add Services
              </MDBBtn>
            </div>
            <MDBTable bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Services</th>
                  <th>Action</th>
                </tr>
              </thead>
            </MDBTable>
          </MDBCollapse>
        </td>
      </tr>
    </>
  );
};

export default Services;
