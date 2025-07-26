import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  SetActivePAGE,
  SetMaxPage,
} from "../../../../../services/redux/slices/commerce/pos/services/taskGenerator.js";
import Pagination from "../../../../../components/pagination/index.jsx";

export default function Footer() {
  const { isLoading, totalPages, activePage, maxPage } = useSelector(
      ({ taskGenerator }) => taskGenerator
    ),
    dispatch = useDispatch();

  const handlePageChange = (action) => {
    const newPage = activePage + (action ? 1 : -1);
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(SetActivePAGE(newPage));
    }
  };

  return (
    <div className=" d-flex justify-content-between align-items-center px-4">
      <TableRowCount
        disablePageSelect={false}
        handleChange={(value) => dispatch(SetMaxPage(Number(value)))}
        maxPage={maxPage}
      />
      <Pagination
        isLoading={isLoading}
        total={totalPages}
        page={activePage}
        setPage={handlePageChange}
      />
    </div>
  );
}

const TableRowCount = ({ handleChange, maxPage }) => {
  return (
    <MDBSelect
      getValue={handleChange}
      className={`colorful-select dropdown-primary mt-2 hidden-md-down`}
    >
      <MDBSelectInput selected={`${maxPage} rows`} />
      <MDBSelectOptions>
        <MDBSelectOption value="6">6 rows</MDBSelectOption>
        <MDBSelectOption value="30">30 rows</MDBSelectOption>
        <MDBSelectOption value="60">60 rows</MDBSelectOption>
        <MDBSelectOption value="120">120 rows</MDBSelectOption>
      </MDBSelectOptions>
    </MDBSelect>
  );
};
