import React, { useState, useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBAnimation,
  MDBProgress,
  MDBView,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import CompanyCards from "./cards";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/companies";
import Search from "../../../../../components/searchables/physicians";
import "./style.css";

// const path = [
//   {
//     path: "List of Companies",
//   },
// ];

export default function UnsetApply() {
  const { token, maxPage } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ companies }) => companies),
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
    <MDBContainer className="mt-4" fluid>
      {/* <MDBRow className="mb-3">
        <MDBCol md="6">
          <MDBInput
            onChange={(e) => handleSearch(e.target.value)}
            type="search"
            label="Search by Company name"
          />
        </MDBCol>
      </MDBRow> */}
      <MDBCard narrow>
        <MDBView
          cascade
          className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
        >
          <div>Company List</div>
          <div>
            <Search />
          </div>
        </MDBView>
        <MDBCardBody>
          {!isLoading ? (
            <CompanyCards companies={companies} page={page} />
          ) : (
            <MDBRow style={{ marginTop: "-2rem" }}>
              {new Array(12).fill("").map((_, index) => (
                <MDBCol md="3" key={index} className="mt-4">
                  <MDBCard>
                    <MDBCardBody>
                      <MDBAnimation
                        type="flash"
                        infinite
                        delay={`${index + 1}00ms`}
                        duration="3000ms"
                      >
                        <MDBProgress
                          animated
                          color="light"
                          value={3000}
                          id="company-loading-1"
                        ></MDBProgress>
                      </MDBAnimation>
                      <MDBAnimation
                        type="flash"
                        infinite
                        delay={`${index + 1}00ms`}
                        duration="3000ms"
                      >
                        <MDBProgress
                          animated
                          color="light"
                          value={3000}
                          id="company-loading-2"
                        ></MDBProgress>
                      </MDBAnimation>
                      <MDBAnimation
                        type="flash"
                        infinite
                        delay={`${index + 1}00ms`}
                        duration="3000ms"
                      >
                        <MDBProgress
                          animated
                          color="light"
                          value={3000}
                          id="company-loading-3"
                        ></MDBProgress>
                      </MDBAnimation>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              ))}
            </MDBRow>
          )}
        </MDBCardBody>
      </MDBCard>
      {/* Modal must be here */}
    </MDBContainer>
  );
}
