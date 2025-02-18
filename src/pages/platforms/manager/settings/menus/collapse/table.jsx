import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { capitalize, globalSearch } from "../../../../../../services/utilities";
import { Services, Templates } from "../../../../../../services/fakeDb";
import Modal from "./modal";
import DataTable from "../../../../../../components/dataTable";
import { UPDATE } from "../../../../../../services/redux/slices/commerce/menus";
import Swal from "sweetalert2";

export default function CollapseTable({
  packages,
  menuId,
  menuDescription,
  setActiveId,
  resetSearch,
  searchKey,
  menuAbbreviation,
}) {
  const [services, setServices] = useState([]),
    [showModal, setShowModal] = useState(false),
    { isLoading } = useSelector(({ menus }) => menus),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    setServices(Services.whereIn(packages));
  }, [packages]);

  const handleSearch = async (willSearch, key) => {
    if (willSearch) {
      setServices(globalSearch(services, key));
    } else {
      setServices(Services.whereIn(packages));
    }
  };

  const handlePick = (selected) => {
    const ids = selected.map(({ id }) => id);

    dispatch(
      UPDATE({
        token,
        data: {
          abbreviation: menuAbbreviation,
          description: menuDescription,
          branchId: activePlatform?.branchId,
          packages: [...new Set([...ids, ...packages])],
          _id: menuId,
        },
      })
    );

    toggleModal();
    if (searchKey) {
      setActiveId(-1);
      resetSearch();
    }
  };

  const handleAddService = () => {
    toggleModal();
  };

  const handleDestroy = (selected) =>
    Swal.fire({
      title: "Are you sure?",
      text: `This action is irreversible.`,
      icon: "question",
      confirmButtonText: "Proceed",
    }).then((res) => {
      if (res.isConfirmed) {
        const ids = selected.map(({ id }) => id);
        dispatch(
          UPDATE({
            token,
            data: {
              description: menuDescription,
              branchId: activePlatform?.branchId,
              packages: packages.filter((service) => !ids.includes(service)),
              _id: menuId,
            },
          })
        );
        if (searchKey) {
          setActiveId(-1);
          resetSearch();
        }
      }
    });

  return (
    <>
      <DataTable
        minHeight="0px"
        isLoading={isLoading}
        title="Services Tag/s"
        array={services}
        actions={[
          {
            _icon: "plus",
            _function: handleAddService,
            _shouldReset: true,
          },
          {
            _icon: "trash-alt",
            _function: handleDestroy,
            _haveSelect: true,
            _allowMultiple: true,
            _shouldReset: true,
          },
        ]}
        tableHeads={[
          {
            _text: "Description",
          },
          {
            _text: "Department",
          },
          {
            _text: "Template",
          },
          {
            _text: "Preference",
          },
          {
            _text: "Preparation",
          },
        ]}
        tableBodies={[
          {
            _key: "name",
            _format: (data, { abbreviation }) => (
              <>
                <p className="fw-bold mb-1">{capitalize(data)}</p>
                <p className="mb-0">{abbreviation.toUpperCase()}</p>
              </>
            ),
          },
          {
            _key: "department",
            _format: capitalize,
          },
          {
            _key: "department",
            _format: (data, { template }) =>
              Templates.find(({ department }) => department === data)
                .components[template],
          },
          {
            _key: "preference",
          },
          {
            _key: "preparation",
          },
        ]}
        handleSearch={handleSearch}
        disablePageSelect
      />
      <Modal show={showModal} toggle={toggleModal} handlePick={handlePick} />
    </>
  );
}
