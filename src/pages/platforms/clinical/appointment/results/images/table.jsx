import {
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTable,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { SetDIAGNOSTIC } from "../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { dateFormat } from "../../../../../../services/utilities";

const Table = ({ setPreview = () => {} }) => {
  const { diagnostic = {} } = useSelector(({ appointments }) => appointments),
    dispatch = useDispatch();
  const { images = [] } = diagnostic || {};
  const handleDelete = (index) => {
    var _diagnostic = { ...diagnostic };
    const _images = [...images];
    _images.splice(index, 1);
    if (_images.length === 0) {
      delete _diagnostic.images;
    } else {
      _diagnostic.images = _images;
    }
    dispatch(SetDIAGNOSTIC({ ..._diagnostic }));
  };

  return (
    <MDBCard className="mt-3">
      <MDBCardBody>
        <div>
          <span style={{ fontWeight: 500 }}>Uploaded Result List</span>
          <div style={{ maxHeight: "13rem", overflowY: "auto" }}>
            <MDBTable small bordered>
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Date Result</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {images.length > 0 ? (
                  images.map((item, index) => (
                    <tr key={index}>
                      <td>{item.section}</td>
                      <td>{dateFormat(item.date)}</td>
                      <td>
                        <MDBBtnGroup>
                          <MDBBtn
                            size="sm"
                            rounded
                            color="warning"
                            onClick={() => setPreview(item)}
                          >
                            <MDBIcon icon="eye" title="View the form image" />
                          </MDBBtn>
                          <MDBBtn
                            size="sm"
                            rounded
                            color="danger"
                            onClick={() => handleDelete(index)}
                          >
                            <MDBIcon icon="trash" />
                          </MDBBtn>
                        </MDBBtnGroup>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center">
                      No result uploaded.
                    </td>
                  </tr>
                )}
              </tbody>
            </MDBTable>
          </div>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Table;
