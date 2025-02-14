import React, { useState, useEffect } from "react";
import { MDBAnimation, MDBBtn, MDBCol, MDBIcon } from "mdbreact";
import DataTable from "../../../../../../components/dataTable";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  BROWSE,
  RESET,
} from "../../../../../../services/redux/slices/commerce/menus";
// import Pagination from "../../../../../../components/pagination";
import {
  currency,
  globalSearch,
  // handlePagination,
} from "../../../../../../services/utilities";
// import Search from "../../../../../../services/utilities/search";
import { Categories } from "../../../../../../services/fakeDb";

export default function CashierMenu({ categoryIndex, handlePicker }) {
  const [menus, setMenus] = useState([]),
    [page, setPage] = useState([]),
    [totalPages, setTotalPages] = useState(),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ menus }) => menus
    ),
    { token, onDuty, maxPage } = useSelector(({ auth }) => auth),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const { abbr, name } = Categories[categoryIndex];

  useEffect(() => {
    if (token && onDuty._id) {
      dispatch(BROWSE({ token, key: { branchId: onDuty._id } }));
    }

    return () => dispatch(RESET());
  }, [token, dispatch, onDuty]);

  useEffect(() => {
    if (collections > 0 && !setPage) {
      let totalPages = Math.floor(collections.length / maxPage);
      if (collections.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      if (page > totalPages) setPage(totalPages);
    }
  }, [collections, page, maxPage, setPage]);

  useEffect(() => {
    setMenus(collections.filter((c) => String(c[abbr]) !== "0"));
  }, [collections, abbr]);

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  const handleSearch = async (willSearch, key) => {
    if (willSearch) {
      setMenus(globalSearch(collections, key.toUpperCase()));
    } else {
      setMenus(collections.filter((c) => String(c[abbr]) !== "0"));
    }
  };

  return (
    <MDBCol md="7">
      <MDBAnimation type="slideInLeft">
        <DataTable
          disablePageSelect
          disableSelect
          minHeight="375px"
          isLoading={isLoading}
          title="Menus"
          array={menus}
          page={totalPages}
          tableHeads={[
            {
              _text: "Name",
            },
            {
              _text: "SRP",
            },
            {},
          ]}
          tableBodies={[
            {
              _isEmpty: true,
              _key: "description",
              _format: (data, { abbreviation }) => (
                <>
                  <p className="fw-bold mb-1">
                    {String(data || abbreviation).toUpperCase()}
                  </p>
                  {data && <p className="mb-0">{abbreviation.toUpperCase()}</p>}
                </>
              ),
            },
            {
              _key: abbr,
              _format: (data) =>
                data ? (
                  currency(data)
                ) : (
                  <i>This item has no price for {name}.</i>
                ),
            },
            {
              _key: abbr,
              _format: (data, item) =>
                data && (
                  <MDBBtn
                    onClick={() => handlePicker(item)}
                    color="info"
                    size="sm"
                    className="py-1 px-2 m-0"
                  >
                    <MDBIcon icon="share" />
                  </MDBBtn>
                ),
            },
          ]}
          handleSearch={handleSearch}
          isLocal={true}
        />
      </MDBAnimation>
    </MDBCol>
  );
}
