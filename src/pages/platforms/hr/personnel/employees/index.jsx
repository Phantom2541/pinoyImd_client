import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import DataTable from "../../../../../components/dataTable";
import EditableField from "../../../../../components/customizable/editableField";
import {
  Cloudinary,
  globalSearch,
  PresetImage,
  signatoryName,
} from "../../../../../services/utilities";
import {
  BROWSE,
  RESET,
  UPDATE,
} from "../../../../../services/redux/slices/assets/persons/personnels";
import Modal from "./modal";
import { Policy } from "../../../../../services/fakeDb";

export default function Employees() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading, formSubmitted } = useSelector(
      ({ personnels }) => personnels
    ),
    [employees, setEmployees] = useState([]),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    [selected, setSelected] = useState({}),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if ((token, activePlatform?.branchId))
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  //Set fetched data for mapping
  useEffect(() => {
    setEmployees(collections);
  }, [collections]);

  //Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  //Search function
  const handleSearch = async (willSearch, key) => {
    if (willSearch) return setEmployees(globalSearch(collections, key));
    setEmployees(collections);
  };
  const toggleModal = () => setShowModal(!showModal);

  const handleUpdate = (selected) => {
    setSelected(selected);
    if (willCreate) {
      setWillCreate(false);
    }
    setShowModal(true);
  };

  const renderFile201 = (file201 = {}) => {
    const files = [
      file201?.hasPds && "PDS",
      file201?.hasResume && "Resume",
      file201?.hasLetter && "Letter",
      file201?.prc && "PRC",
      file201?.board && "Board",
      file201?.diploma && "Diploma",
      file201?.medical && "Medical",
    ].filter(Boolean);

    if (!files.length) return "";

    return (
      <div>
        {files.map((file) => (
          <small
            key={file}
            className="text-muted d-block"
            style={{ lineHeight: 1.2 }}
          >
            {file}
          </small>
        ))}
      </div>
    );
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title="Employees"
        array={employees}
        actions={[
          {
            _icon: "plus",
            _disabledOnSearch: true,
          },
          {
            _icon: "pencil-alt",
            _function: handleUpdate,
            _haveSelect: true,
            _allowMultiple: false,
            _shouldReset: true,
          },
        ]}
        tableHeads={[
          {
            _text: "Name",
          },
          {
            _text: "Designation",
          },
          {
            _text: "PRC#",
          },
          {
            _text: "Files",
          },
          {
            _text: "Company ID",
          },
          {
            _text: "Status",
          },
        ]}
        tableBodies={[
          {
            _key: "user",
            _format: (data) => (
              <div className="d-flex align-items-center">
                <img
                  src={
                    data?.email
                      ? `${Cloudinary.getEndpoint()}/${data?.pid || ""}/users/${
                          data.email
                        }/profile.png`
                      : PresetImage(data?.isMale)
                  }
                  alt={data?.email || "employee"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PresetImage(data?.isMale);
                  }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid #dee2e6",
                    marginRight: "0.75rem",
                    backgroundColor: "#fff",
                  }}
                />
                <div>
                  <h6 className="mb-0">
                    <strong>{signatoryName(data.fullName)}</strong>
                  </h6>
                  {data?.email && (
                    <small className="text-muted">{data.email}</small>
                  )}
                </div>
              </div>
            ),
          },
          {
            _key: "contract",
            _format: (data) => {
              const designation = Policy.getPositions(Number(data?.designation));
              const department = Policy.getDepartment(Number(data?.designation));

              return (
                <div>
                  <strong>{designation}</strong>
                  {department && (
                    <small className="text-muted d-block">{department}</small>
                  )}
                </div>
              );
            },
          },
          {
            _key: "user",
            _format: (data) => {
              const hasPRC = data?.prc?.id || data?.prc?.from || data?.prc?.to;

              if (!hasPRC) return "";

              return (
                <div>
                  <strong>{data?.prc?.id || ""}</strong>
                  {data?.prc?.from && (
                    <small className="text-muted d-block">
                      Acquired: {data.prc.from}
                    </small>
                  )}
                  {data?.prc?.to && (
                    <small className="text-muted d-block">
                      Validity: {data.prc.to}
                    </small>
                  )}
                </div>
              );
            },
          },
          {
            _key: "file201",
            _format: (_, row) => renderFile201(row?.file201),
          },
          {
            _key: "id",
            _format: (data, row) => (
              <EditableField
                displayTag="small"
                classNameTxt="mb-0"
                className="form-control form-control-sm"
                keyForValue="id"
                isCapitalize={false}
                fieldData={{
                  _id: row?._id,
                  id: data || "",
                }}
                formSubmitted={formSubmitted}
                onSave={(edited) =>
                  dispatch(
                    UPDATE({
                      data: {
                        _id: row?._id,
                        id: edited.id,
                      },
                      token,
                    })
                  )
                }
              />
            ),
          },

          {
            _key: "status",
            _format: (data) => <strong>{data}</strong>,
          },
        ]}
        handleSearch={handleSearch}
      />
      <Modal
        selected={selected}
        willCreate={willCreate}
        show={showModal}
        toggle={toggleModal}
      />
    </>
  );
}
