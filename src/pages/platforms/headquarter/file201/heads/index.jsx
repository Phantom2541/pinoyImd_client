import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
  DESTROY,
} from "../../../../../services/redux/slices/assets/persons/heads";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import DataTable from "../../../../../components/dataTable";
import { fullName, globalSearch } from "../../../../../services/utilities";
import { ENDPOINT } from "../../../../../services/utilities";
import Swal from "sweetalert2";
import { MDBBtn, MDBIcon } from "mdbreact";
// import { UPLOAD } from "../../../../../services/redux/slices/assets/persons/auth";
import SignaturePreview from "./signaturePreview";

export default function Heads() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ heads }) => heads
    ),
    [heads, setHeads] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    [showPreviewSignature, setShowPreviewSignature] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const [imageErrors, setImageErrors] = useState({});

  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);
  //Set fetched data for mapping
  useEffect(() => {
    if (collections.length > 0) {
      // para mailipat ko yung department tas section sa loob ng user na object
      // para pwede kong maaccess yung dalawa nayun sa loob ni user para matawag ko sila sa isang key lang
      const newArray = collections.map((collection) => ({
        ...collection,
        user: {
          ...collection?.user,
          department: collection?.department,
          section: collection?.section,
        },
      }));
      setHeads(newArray || []);
    }
  }, [collections]);
  console.log("collections", collections);

  //Modal toggle
  const toggleModal = () => setShowModal(!showModal);
  const togglePreviewSignature = () =>
    setShowPreviewSignature(!showPreviewSignature);

  //Trigger for update
  const handleUpdate = (selected) => {
    setSelected(selected);
    setWillCreate(false);
    setShowModal(true);
  };

  //Trigger for create
  const handleCreate = () => {
    setWillCreate(true);
    setShowModal(true);
  };

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
    if (willSearch) return setHeads(globalSearch(collections, key));
    setHeads(collections);
  };

  const handleSignature = (e, email) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelected({ signature: e.target.result, email });
      togglePreviewSignature();
    };
    reader.readAsDataURL(e.target.files[0]);
    e.target.value = null;
  };
  const handleDelete = (data) => {
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
        dispatch(DESTROY({ token, data: { id: data._id } }));
      }
    });
  };

  const handleImageError = (email) =>
    setImageErrors((prev) => ({ ...prev, [email]: true }));

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title="heads"
        array={heads}
        actions={[
          {
            _icon: "plus",
            _function: handleCreate,
            _disabledOnSearch: true,
          },
          {
            _icon: "pencil-alt",
            _function: handleUpdate,
            _haveSelect: true,
            _allowMultiple: false,
            _shouldReset: true,
          },
          {
            _icon: "trash",
            _function: handleDelete,
            _haveSelect: true,
            _allowMultiple: false,
            _shouldReset: true,
          },
        ]}
        tableHeads={[
          {
            _text: "Section",
          },
          {
            _text: "Staff",
          },
          {
            _text: "Signature",
          },
        ]}
        tableBodies={[
          {
            _key: "user",
            _format: (data) => (
              <>
                <h6>
                  <strong>
                    {data?.section
                      ? data?.section.toUpperCase()
                      : data?.section}
                  </strong>
                </h6>
                <strong>{data?.department}</strong>
              </>
            ),
          },
          {
            _key: "user",
            _format: (data) => (
              <>
                <p className="fw-bold mb-1 text-capitalize">
                  {fullName(data.fullName)}
                </p>
                {data?.prc && (
                  <strong>
                    PRC ID: {data.prc?.id}| Expiration : {data?.prc?.to}
                  </strong>
                )}
              </>
            ),
          },

          {
            _key: "user",

            _format: ({ email }) => (
              <>
                {!imageErrors[email] ? (
                  <img
                    onClick={() =>
                      document.getElementById(`file-upload-${email}`).click()
                    }
                    alt={email || "Default Image"}
                    className="cursor-pointer"
                    id="signature"
                    src={`${ENDPOINT}/public/users/${email}/signature.png?${new Date().getTime()}`}
                    onError={() => handleImageError(email)}
                    height={50}
                    width={50}
                  />
                ) : (
                  <div>
                    <MDBBtn
                      size="sm"
                      color="warning"
                      rounded
                      onClick={() =>
                        document.getElementById(`file-upload-${email}`).click()
                      }
                    >
                      <MDBIcon icon="upload" />
                    </MDBBtn>
                  </div>
                )}

                <input
                  id={`file-upload-${email}`}
                  type="file"
                  accept="image/png"
                  style={{ display: "none" }}
                  onChange={(e) => handleSignature(e, email)}
                />
              </>
            ),
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
      <SignaturePreview
        show={showPreviewSignature}
        toggle={togglePreviewSignature}
        selected={selected}
        setImageErrors={setImageErrors}
      />
    </>
  );
}
