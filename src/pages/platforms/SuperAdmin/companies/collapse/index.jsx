import { useState } from "react";
import ReactDOM from "react-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
  MDBRow,
  MDBCol,
} from "mdbreact";
import CollapsableBody from "./body";
import CollapsableHeader from "./header";
import { collapse, fullName } from "../../../../../services/utilities";
import Swal from "sweetalert2";
import {
  UPDATE,
  SETCEO,
} from "../../../../../services/redux/slices/assets/companies";
import Search from "../../../../../components/searchables/users";
import { SearchUser } from "../../../../../components/searchables";

export default function Body() {
  const { filtered, activePage, maxPage } = useSelector(
    ({ companies }) => companies
  );
  const { token } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({});
  const [user, setUser] = useState({});
  console.log("user", user);

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page

  /**
   * Active states
   */
  const [activeId, setActiveId] = useState(-1);
  const [didHoverId, setDidHoverId] = useState(-1);

  const handleceo = (CEO) => {
    setUser(CEO);
    dispatch(SETCEO(CEO));
  };

  const handleCEO = () => {};

  return (
    <MDBContainer
      style={{
        minHeight: "300px",
      }}
      fluid
    >
      {paginatedData?.map((company, index) => {
        const actualIndex = startIndex + index; // Get the real index in filtered array
        const { color, border } = collapse.getStyle(
          actualIndex,
          activeId,
          didHoverId
        );

        const { branches = [], ceo = {} } = company || {};

        return (
          <MDBCard
            key={`company-${actualIndex}`}
            style={{ boxShadow: "0px 0px 0px 0px", backgroundColor: "white" }}
          >
            <MDBCollapseHeader
              className={border}
              onMouseLeave={() => setDidHoverId(-1)}
              onMouseEnter={() => setDidHoverId(actualIndex)}
              style={{ borderRadius: "50%" }}
            >
              <CollapsableHeader
                company={company}
                isOpen={activeId === actualIndex}
                textColor={color}
                setActiveId={setActiveId}
                index={actualIndex}
              />
            </MDBCollapseHeader>

            <MDBCollapse
              id={`collapse-${actualIndex}`}
              className="mb-2 border border-black m-0 p-0"
              isOpen={actualIndex === activeId}
            >
              <MDBCardBody className="m-0 p-0">
                <CollapsableBody cid={company._id} branches={branches} />
                <MDBRow className="mt-2 ml-2">
                  <MDBCol>
                    <h5 onClick={() => handleCEO()}>
                      <strong>CEO:</strong>
                      {/* <Search
                        label="CEO"
                        setUser={(value) =>
                          setForm({ ...form, ceo: value || "" })
                        }
                        className="mt-4"
                      /> */}
                      {ceo?.fullName ? fullName(ceo?.fullName) : "N/A"}
                    </h5>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
