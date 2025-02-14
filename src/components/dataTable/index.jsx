import React, { useState, useEffect } from "react";
import { MDBCard, MDBCardBody } from "mdbreact";
import Pagination from "../pagination";
import TableRowCount from "../pagination/rows";
import Table from "./table";
import Actions from "./actions";
import { useSelector } from "react-redux";

/**
 * An automatic DataTable.
 *
 * @component
 * @param {boolean} isLoading - Loading status.
 * @param {boolean} disableSearch - Disables search Button.
 * @param {boolean} toggleComponent - Toggles your custom component.
 * @param {JSX.Element} customComponent - Your custom component.
 * @param {string} title - Table Title.
 * @param {object[]} array - Collection of data that will be processed into the table body.
 * @param {object[]} actions - Action buttons that will be shown.
 * @param {object[]} extraActions - Extra actions located at the center.
 * @example
 * const actions = [
 *   { _icon: "sync", _condition: () => {}, _className: "bg-danger", _style: { color: "red" }, _function: () => {}, _shouldReset: true, _haveSelect: true, _allowMultiple: false, _disabledOnSearch = false, _selected = false },
 * ];
 * @param {object[]} tableHeads - Array of Table Heads.
 * @example
 * const tableHeads = [
 *   { _text: "Delete", _condition: () => {}, _className: "bg-danger", _style: { color: "red" } },
 * ];
 * @param {object[]} tableBodies - Array of Table Bodies.
 * @example
 * const tableBodies = [
 *   { _key: "email", _condition: () => {}, _className: "bg-danger", _style: { color: "red" }, _format: () => {}, _isEmpty = false },
 * ];
 * @param {function} liveSelector - Function for live selection.
 * @param {array} liveInjector - Update feature for live selection.
 * @param {function} handleSearch - Function to handle search.
 * @param {JSX.Element} fallbackSearch - Component for incomplete search.
 * @param {function} fallbackFunction - Function for fallbackSearch.
 * @param {string} minHeight - Minimum height.
 * @param {boolean} disablePageSelect - Disables max page selection.
 * @param {boolean} disableSelect - Disables select feature.
 * @param {function} getPage - Returns the current page.
 * @param {number} totalPages - Total pages based on database.
 * @returns {JSX.Element} The rendered DataTable component.
 */
export default function DataTable({
  isLoading = false,
  totalPages: dbTotalPages,
  getPage,
  title = "",
  array = [],
  actions = [],
  extraActions = [],
  tableHeads = [],
  tableBodies = [],
  handleSearch = () => {},
  isLocal = false,
  customComponent,
  toggleComponent = false,
  disableSearch = false,
  liveSelector,
  liveInjector = [],
  fallbackSearch: FallbackSearch,
  fallbackFunction,
  minHeight = "300px",
  disablePageSelect = false,
  disableSelect = false,
  disablePaginate = true,
}) {
  const [search, setSearch] = useState(""),
    [selected, setSelected] = useState([]),
    [selectedAll, setSelectedAll] = useState(false),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    { maxPage } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (dbTotalPages) setTotalPages(dbTotalPages);
  }, [dbTotalPages]);

  useEffect(() => {
    if (!!liveInjector.length) {
      setSelected(liveInjector);
      if (liveInjector.length === array.length) setSelectedAll(true);
    }
  }, [liveInjector, array]);

  useEffect(() => {
    if (array.length > 0 && !getPage) {
      let totalPages = Math.floor(array.length / maxPage);
      if (array.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      if (page > totalPages) setPage(totalPages);
    }
  }, [array, page, maxPage, getPage]);

  const handleSelectReset = () => {
    if (selected.length > 0) {
      setSelected([]);
    }

    if (selectedAll) {
      setSelectedAll(false);
    }
  };

  const handleToggleSelect = (status, index, item) => {
    const _selected = [...selected];

    if (status) {
      _selected.splice(index, 1);
      if (selectedAll) setSelectedAll(false);
    } else {
      _selected.push(item);
      if (array.length === _selected.length) setSelectedAll(true);
    }

    if (liveSelector) liveSelector(_selected);
    setSelected(_selected);
  };

  const handleBody = () => {
    if (customComponent && toggleComponent) {
      return customComponent;
    }

    return (
      <div style={{ minHeight }}>
        <Table
          getPage={getPage}
          disableSelect={disableSelect}
          page={page}
          isLoading={isLoading}
          title={title}
          array={array}
          search={search}
          selectedAll={selectedAll}
          liveSelector={liveSelector}
          setSelectedAll={setSelectedAll}
          setSelected={setSelected}
          tableHeads={tableHeads}
          tableBodies={tableBodies}
          selected={selected}
          handleToggleSelect={handleToggleSelect}
        />
      </div>
    );
  };

  return (
    <MDBCard narrow>
      <Actions
        getPage={getPage}
        extraActions={extraActions}
        isLoading={isLoading}
        search={search}
        setSearch={setSearch}
        setSelected={setSelected}
        arrayLength={array.length}
        title={title}
        actions={actions}
        handleSelectReset={handleSelectReset}
        selected={selected}
        handleSearch={handleSearch}
        isLocal={isLocal}
        disableSearch={disableSearch}
        setSelectedAll={setSelectedAll}
        selectedAll={selectedAll}
      />
      <MDBCardBody className="pb-0">
        {handleBody()}
        <div className="d-flex justify-content-between align-items-center">
          <TableRowCount disablePageSelect={disablePageSelect} />
          {FallbackSearch && (
            <FallbackSearch fallbackFunction={fallbackFunction} />
          )}
          {disablePaginate && (
            <Pagination
              getPage={getPage}
              isLoading={isLoading}
              total={totalPages}
              page={page}
              setPage={setPage}
            />
          )}
        </div>
      </MDBCardBody>
    </MDBCard>
  );
}
