import React, { useState, useEffect } from "react";
import { MDBCol, MDBContainer, MDBInput, MDBRow } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import CompanyCards from "./cards";
import {
  BROWSE,
  RESET,
} from "../../../../services/redux/slices/assets/companies";

// const path = [
//   {
//     path: "List of Companies",
//   },
// ];

export default function UnsetApply() {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ companies }) => companies),
    [companies, setCompanies] = useState([]),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    dispatch = useDispatch();

  console.log("unused variable total pages", totalPages);

  useEffect(() => {
    if (token) dispatch(BROWSE(token));

    return () => dispatch(RESET());
  }, [token, dispatch]);

  useEffect(() => {
    if (!!collections.length) {
      setCompanies(collections);
    }
  }, [collections]);

  useEffect(() => {
    if (!!companies.length) {
      //Pagination
      let totalPages = Math.floor(companies.length / maxPage);
      if (companies.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      page > totalPages && setPage(totalPages);
    }
  }, [companies, page, maxPage]);

  const handleSearch = (string) => {
    if (string) {
      setCompanies(
        collections?.filter((catalog) =>
          String(catalog.name).toLowerCase().startsWith(string.toLowerCase())
        )
      );
    } else {
      setCompanies(collections);
    }
  };

  return (
    <>
      <MDBContainer className="py-5 mt-4">
        <MDBRow className="mb-3">
          <MDBCol md="6">
            <MDBInput
              onChange={(e) => handleSearch(e.target.value)}
              type="search"
              label="Search by Company name"
            />
          </MDBCol>
        </MDBRow>
        <CompanyCards companies={companies} page={page} />
        {/* Modal must be here */}
      </MDBContainer>
    </>
  );
}
