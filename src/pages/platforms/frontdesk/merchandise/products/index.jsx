import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  DESTROY,
  RESET,
} from "../../../../../services/redux/slices/commerce/merchandise/products";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import DataTable from "../../../../../components/dataTable";
import {
  ENDPOINT,
  FailedLogo,
  globalSearch,
} from "../../../../../services/utilities";
import { MDBBadge } from "mdbreact";
import Swal from "sweetalert2";

export default function Products() {
  const [products, setProducts] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ products }) => products
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({
          token,
          params: {
            branch: activePlatform?.branchId,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, activePlatform?.branchId, dispatch]);

  //Set fetched data for mapping
  useEffect(() => {
    setProducts(collections);
  }, [collections]);

  //Modal toggle
  const toggleModal = () => setShowModal(!showModal);

  //Trigger for update
  const handleUpdate = selected => {
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
    if (willSearch) return setProducts(globalSearch(collections, key));

    setProducts(collections);
  };

  const handleDelete = async selected => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(
          DESTROY({
            data: { _id: selected._id },
            token,
          })
        );
      }
    });
  };

  const handleBoolean = data =>
    data ? (
      <MDBBadge color="success">YES</MDBBadge>
    ) : (
      <MDBBadge color="danger">NO</MDBBadge>
    );

  const handleImg = data => {
    const imgSrc = `${ENDPOINT}/public/products/${data}.png`;
    return (
      <img
        src={imgSrc}
        alt="product"
        style={{ width: "50px", height: "50px" }}
        onError={e => {
          e.target.onerror = null;
          e.target.src = FailedLogo;
        }}
      />
    );
  };

  const handleFormatPackages = data => {
    return (
      <div>
        <p>
          Pack: Unit: <strong>{data?.pack?.u}</strong> | Quantity:
          <strong> {data?.pack?.q}</strong>
        </p>
        <p>
          BTL: Unit: <strong>{data?.btl?.u}</strong> | Volume:
          <strong> {data?.btl?.v}</strong>
        </p>
      </div>
    );
  };

  const handleConversion = data => {
    return (
      <div>
        <p>
          BTL: <strong>{data?.btl}</strong> | Pack:{" "}
          <strong>{data?.pack}</strong>
        </p>
      </div>
    );
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title="Products"
        array={products}
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
            _text: "Name",
          },
          {
            _text: "Subname",
          },
          {
            _text: "Barcode",
          },
          {
            _text: "Category",
          },
          {
            _text: "Discountinue order",
          },
          {
            _text: "Supplier Object",
          },
          {
            _text: "Can Revert",
          },
          {
            _text: "Vatable",
          },
          {
            _text: "Consumable",
          },
          { _text: "Packages" },
          {
            _text: "Conversion",
          },
          {
            _text: "Upload",
          },
        ]}
        tableBodies={[
          {
            _key: "name",
          },
          {
            _key: "subname",
          },
          {
            _key: "barcode",
          },
          {
            _key: "category",
          },
          {
            _key: "halt",
            _format: e => handleBoolean(e),
          },
          {
            _key: "supplierObj",
          },
          {
            _key: "revert",
            _format: e => handleBoolean(e),
          },
          {
            _key: "VATable",
            _format: e => handleBoolean(e),
          },
          {
            _key: "isConsumable",
            _format: e => handleBoolean(e),
          },
          { _key: "packages", _format: e => handleFormatPackages(e) },
          {
            _key: "conversion",
            _format: e => handleConversion(e),
          },

          {
            _key: "name",
            _format: e => handleImg(e),
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
