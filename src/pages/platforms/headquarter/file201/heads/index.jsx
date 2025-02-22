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
import Branches from "../../../manager/branches";

export default function Heads() {
  const [heads, setHeads] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ heads }) => heads
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);
  //Set fetched data for mapping
  useEffect(() => {
    const newArray =
      collections.length > 0 &&
      collections.map((collection) => {
        // para mailipat ko yung department tas section sa loob ng user na object
        // para pwede kong maaccess yung dalawa nayun sa loob ni user para matawag ko sila sa isang key lang
        return {
          ...collection,
          user: {
            ...collection?.user,
            department: collection?.department,
            section: collection?.section,
          },
        };
      });
    setHeads(newArray || []);
  }, [collections]);

  //Modal toggle
  const toggleModal = () => setShowModal(!showModal);

  //Trigger for update
  const handleUpdate = (selected) => {
    setSelected(selected);
    if (willCreate) {
      setWillCreate(false);
    }
    setShowModal(true);
  };

  //Trigger for create
  const handleCreate = () => {
    if (!willCreate) {
      setWillCreate(true);
    }
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

  // const handleSignature = (e) => {
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     let image = new Image();
  //     image.src = e.target.result;

  //     image.onload = function () {
  //       dispatch(
  //         UPLOAD({
  //           data: {
  //             path: `patron/${email}`,
  //             base64: reader.result.split(",")[1],
  //             name: `signature.png`,
  //           },
  //           token,
  //         })
  //       );
  //     };
  //   };
  //   reader.readAsDataURL(e.target.files[0]);
  // };

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
                <strong>
                  PRC ID: {data.prc?.id}| Expiration : {data?.prc?.to}
                </strong>
              </>
            ),
          },

          {
            _key: "user",
            _format: (data) => (
              <>
                <img
                  alt={data.email || "Default Image"}
                  id="signature"
                  src={`${ENDPOINT}/public/patron/${data?.email}/signature.png`}
                  onError={(e) => (e.target.src = "")}
                  height={50}
                  width={50}
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
    </>
  );
}
