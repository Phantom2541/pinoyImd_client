import { useSelector } from "react-redux";
import { MDBTable, MDBCardBody } from "mdbreact";
import Patient from "./patient";
export default function Table() {
  const {
    filteredStatus,
    byGroup: selectedKey,
    activePage,
    maxPage,
  } = useSelector(({ validator }) => validator);

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedData = filteredStatus.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <MDBCardBody>
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
          {paginatedData.length > 0 ? (
            paginatedData.map((deal, index) => {
              const {
                _id,
                customerId,
                diagnostic,
                category,
                source,
                physicianId: referral,
              } = deal;

              const task = {
                ...diagnostic[selectedKey],
                category,
                source,
                referral,
                _id,
              };

              if (
                ["miscellaneous", "xray", "ultrasound"].includes(
                  selectedKey.toLowerCase()
                )
              ) {
                return diagnostic?.[selectedKey]?.map((t, i) => {
                  const _t = { ...t, category, source, referral, dealId: _id };

                  return (
                    <Patient
                      _key={`subform-${i}-${_id}`}
                      index={`${index + 1}${
                        diagnostic[selectedKey].length > 1 ? `-${i + 1}` : ""
                      }`}
                      form={selectedKey}
                      obj={_t || {}}
                      customer={customerId}
                      deal={deal}
                    />
                  );
                });
              }
              return (
                <Patient
                  _key={`form-${index}-${_id}`}
                  index={startIndex + index + 1}
                  form={selectedKey}
                  obj={task}
                  customer={customerId}
                  deal={deal}
                />
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="text-center ">
                No onboarding task found.
              </td>
            </tr>
          )}
        </tbody>
      </MDBTable>
    </MDBCardBody>
  );
}
