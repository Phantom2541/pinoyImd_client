import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBadge,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBContainer,
  MDBIcon,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";
import {
  BROWSE,
  DESTROY,
  RESET,
} from "../../../../../services/redux/slices/diagnostics/clinic/clinicInfo";
import { globalSearch, properFullname } from "../../../../../services/utilities";
import ClinicModal from "./modal";

const Index = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections, isLoading, isSuccess, message } = useSelector(
    ({ clinicInfo }) => clinicInfo
  );
  const [clinics, setClinics] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [willCreate, setWillCreate] = useState(true);

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({
          token,
          params: { branchId: activePlatform?.branchId },
        })
      );
    }

    return () => dispatch(RESET());
  }, [activePlatform, dispatch, token]);

  const mappedClinics = useMemo(
    () =>
      (collections || []).map((clinic) => {
        const physician =
          clinic?.physician ||
          clinic?.physicianId ||
        (clinic?.userId
          ? {
              _id: clinic?.userId?._id,
              user: clinic.userId,
              fullName: clinic?.userId?.fullName,
            }
          : null);

        return {
          ...clinic,
          physician,
        };
      }),
    [collections]
  );

  useEffect(() => {
    setClinics(mappedClinics);
  }, [mappedClinics]);

  useEffect(() => {
    if (!message) return;

    addToast(message, {
      appearance: isSuccess ? "success" : "error",
    });

    return () => dispatch(RESET());
  }, [addToast, dispatch, isSuccess, message]);

  const toggleModal = () => setShowModal((state) => !state);

  const handleCreate = () => {
    setSelected(null);
    setWillCreate(true);
    setShowModal(true);
  };

  const handleEdit = (clinic) => {
    setSelected(clinic);
    setWillCreate(false);
    setShowModal(true);
  };

  const handleDelete = async (clinic) => {
    const result = await Swal.fire({
      title: "Delete Clinic?",
      text: `This will remove ${clinic?.title || "this clinic"} from the list.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      dispatch(DESTROY({ token, data: { id: clinic?._id } }));
    }
  };

  const handleSearch = (event) => {
    const keyword = event.target.value;

    if (!keyword) return setClinics(mappedClinics);

    setClinics(globalSearch(mappedClinics, keyword));
  };

  const title = useMemo(() => `${clinics.length} Clinic Records`, [clinics.length]);

  return (
    <MDBContainer fluid>
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <MDBCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Clinic Management</h4>
            <small className="text-muted">{title}</small>
          </div>
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control mr-2"
              placeholder="Search clinic"
              onChange={handleSearch}
              style={{ minWidth: "220px" }}
            />
            <MDBBtn color="info" rounded size="sm" onClick={handleCreate}>
              <MDBIcon icon="plus" className="mr-1" />
              Create Clinic
            </MDBBtn>
          </div>
        </MDBCardHeader>
        <MDBCardBody>
          <MDBTable responsive hover>
            <MDBTableHead>
              <tr>
                <th>#</th>
                <th>Clinic</th>
                <th>Physician</th>
                <th>Specialization</th>
                <th>Schedules</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {!isLoading && clinics.length > 0 ? (
                clinics.map((clinic, index) => {
                  const physicianName = properFullname(
                    clinic?.physician?.user?.fullName || clinic?.physician?.fullName
                  );

                  return (
                    <tr key={clinic?._id || index}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{clinic?.title || "Untitled Clinic"}</strong>
                        <div>
                          <small className="text-muted">{clinic?.code || "—"}</small>
                        </div>
                      </td>
                      <td>{physicianName || "Unassigned"}</td>
                      <td>
                        {clinic?.specialization ||
                          clinic?.specializations?.join(", ") ||
                          "—"}
                      </td>
                      <td>{clinic?.schedules?.length || 0}</td>
                      <td>
                        <MDBBadge color="info">
                          {clinic?.status || "draft"}
                        </MDBBadge>
                      </td>
                      <td>
                        <MDBBtn
                          size="sm"
                          rounded
                          color="info"
                          className="mr-2 px-2"
                          onClick={() => handleEdit(clinic)}
                        >
                          <MDBIcon icon="pencil-alt" />
                        </MDBBtn>
                        <MDBBtn
                          size="sm"
                          rounded
                          color="danger"
                          className="px-2"
                          onClick={() => handleDelete(clinic)}
                        >
                          <MDBIcon icon="trash" />
                        </MDBBtn>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    {isLoading ? "Loading clinics..." : "No clinic records found."}
                  </td>
                </tr>
              )}
            </MDBTableBody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>

      <ClinicModal
        selected={selected}
        show={showModal}
        toggle={toggleModal}
        willCreate={willCreate}
      />
    </MDBContainer>
  );
};

export default Index;
