import {
  MDBAlert,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBSpinner,
  MDBTypography,
} from "mdbreact";
import React, { useEffect, useState } from "react";
import CompanyCard from "../card";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/companies";

export default function Laboratories() {
  const { token } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ companies }) => companies),
    [favorites, setFavorites] = useState([]), //collection of ids the user has set to favorite
    [companies, setCompanies] = useState([]),
    [searchKey, setSearchKey] = useState(""),
    dispatch = useDispatch();

  //console.log("unused variable setFavorites", setFavorites);

  useEffect(() => {
    setCompanies(collections);
  }, [collections]);

  useEffect(() => {
    if (token) dispatch(BROWSE(token));

    return () => dispatch(RESET());
  }, [token, dispatch]);

  useEffect(() => {
    const handleSearch = () => {
      if (!searchKey) return setCompanies(collections);

      setCompanies(
        collections?.filter((c) =>
          String(c.name).toLowerCase().includes(searchKey.toLowerCase())
        )
      );
    };

    handleSearch();
  }, [searchKey, collections]);

  return (
    <MDBContainer>
      <MDBRow className="mb-3">
        <MDBCol size="6" className="d-flex align-items-center">
          <MDBTypography variant="h2">Laboratories</MDBTypography>
        </MDBCol>
        {!isLoading && (
          <MDBCol size="6">
            <MDBInput
              onChange={(e) => setSearchKey(e.target.value)}
              type="search"
              label="Search by Company name"
            />
          </MDBCol>
        )}
      </MDBRow>
      {/* if still loading, display loading animation */}
      {isLoading && (
        <div className="mt-5 d-flex">
          <MDBSpinner className="mx-auto" />
        </div>
      )}
      {/* if no companies and not loading, display placeholder */}
      {!Boolean(companies.length) && !isLoading && !searchKey && (
        <div className="w-50 mx-auto">
          <CompanyCard
            company={{
              name: "No companies available",
              subName: "Nothing is listed for this yet.",
            }}
            placeholder
          />
        </div>
      )}
      {/* if no companies, not loading and searchKey has a value, display warning */}
      {!Boolean(companies.length) && !isLoading && searchKey && (
        <MDBAlert color="info">
          <MDBIcon icon="info-circle" className="mr-2" />
          Oops, no company matches your search <strong>{searchKey}</strong>.
        </MDBAlert>
      )}
      {/* if companies have value, it will display */}
      {Boolean(companies.length) && (
        <MDBRow>
          {companies.map((company) => (
            <MDBCol md="3" key={company._id} className="p-2">
              <CompanyCard
                company={company}
                isFavorite={favorites.includes(company._id)}
              />
            </MDBCol>
          ))}
        </MDBRow>
      )}
    </MDBContainer>
  );
}
