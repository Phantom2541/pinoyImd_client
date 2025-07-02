import React from "react";
import { useSelector } from "react-redux";
import { MDBTable, MDBBtnGroup, MDBBtn, MDBIcon } from "mdbreact";

export default function BodyTemplate() {
  const { filtered, activePage, maxPage } = useSelector(
    ({ validator }) => validator
  );
  // const dispatch = useDispatch();

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <MDBTable responsive hover small>
      <thead>
        <tr>
          <th>#</th>
          <th>Patient</th>
          <th>Services</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData.map((deal, index) => {
          const { _id, customerId, diagnostic } = deal;

          // Collect all actual service names (e.g., fbs, crea, uric)
          const serviceList =
            Object.values(diagnostic || {})
              .flatMap((value) => {
                if (Array.isArray(value)) {
                  return value.map((v) => v?.name || v?.test || ""); // some services use `name`, some `test`
                } else if (typeof value === "object") {
                  return value?.name ? [value.name] : [];
                }
                return [];
              })
              .filter(Boolean)
              .join(", ") || "No Services";

          return (
            <tr key={_id}>
              <td>{startIndex + index + 1}</td>
              <td>{customerId?.name || "Unnamed Patient"}</td>
              <td>{serviceList}</td>
              <td>
                <MDBBtnGroup>
                  <MDBBtn
                    color="danger"
                    size="sm"
                    rounded
                    // onClick={() => dispatch(RESET(_id))}
                  >
                    <MDBIcon icon="trash" />
                  </MDBBtn>
                  <MDBBtn
                    color="primary"
                    size="sm"
                    rounded
                    // onClick={() => dispatch(SetEDIT(deal))}
                  >
                    <MDBIcon icon="pencil-alt" />
                  </MDBBtn>
                </MDBBtnGroup>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
}
