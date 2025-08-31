import React, { useState, useEffect } from "react";
import { MDBBadge, MDBBtn, MDBCol, MDBIcon } from "mdbreact";
import DataTable from "../../../../../../../components/dataTable";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import {
  BROWSE,
  RESET,
} from "../../../../../../../services/redux/slices/commerce/catalog/menus";
// import Pagination from "../../../../../../components/pagination";
import {
  currency,
  globalSearch,
  // handlePagination,
} from "../../../../../../../services/utilities";
// import Search from "../../../../../../services/utilities/search";
import { Categories, Services } from "../../../../../../../services/fakeDb";
import "./../../cashierOld/style.css";

export default function CashierMenu({ handlePicker }) {
  const [menus, setMenus] = useState([]),
    { selected } = useSelector(({ deals }) => deals),
    [page, setPage] = useState([]),
    [totalPages, setTotalPages] = useState(),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ menus }) => menus
    ),
    { token, activePlatform, maxPage } = useSelector(({ auth }) => auth),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const _abbr = ["wi", "bp", "mc", "is", "sc"].includes(selected.category)
    ? "opd"
    : selected.category;

  const { abbr, name } = Categories.find(({ abbr }) => abbr === _abbr);

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, key: { branchId: activePlatform?.branchId } }));
    }

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

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
    if (willSearch && key) {
      setMenus(globalSearch(collections, key?.toUpperCase()));
    } else {
      setMenus(collections.filter((c) => String(c[abbr]) !== "0"));
    }
  };

  return (
    <MDBCol md="7">
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
            _text: "Services",
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
            _isEmpty: true,
            _key: "packages",
            _format: (packages) => {
              return (
                <>
                  {Services.whereIn(packages)?.map((pack) => (
                    <MDBBadge key={pack} className="mr-1" title={pack?.name}>
                      {pack?.abbreviation}
                    </MDBBadge>
                  ))}
                </>
              );
            },
          },
          {
            _key: abbr,
            _format: (data) => {
              return data
                ? currency.format(data)
                : `This item has no price for ${name}.`;
            },
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
    </MDBCol>
  );
}
