import { useSelector } from "react-redux";
import { MDBBtn, MDBIcon, MDBTable } from "mdbreact";
import { fullName, timeFormat } from "../../../../../services/utilities";
import { Services } from "../../../../../services/fakeDb";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(({ deals }) => deals);
  const { activePlatform } = useSelector(({ auth }) => auth);
  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);
  const { department } = activePlatform;
  const handlePrint = (item) => {
    const { sendouts, outsource } = item;
    const services = Services.whereIn(sendouts.servicesId);
    localStorage.setItem(
      "outsource_request",
      JSON.stringify({
        deal: { ...item },
        sentOut: outsource,
        isRad: department === "Radiology",
        outsources: services,
      })
    );
    window.open(
      "/printout/request/outsource",
      "request",
      "top=100px,left=0px,width=950px,height=750px"
    );
  };
  return (
    <MDBTable responsive hover>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Outsource</th>
          <th>Customer</th>
          <th>Services</th>
          <th>Time</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { sendouts = {}, outsource = {}, customerId } = item;
          const { name = "", displayname = "" } = outsource;
          const baseOutsource = name || displayname;
          return (
            <tr key={index}>
              <td>{index + startIndex + 1}</td>
              <td>{baseOutsource}</td>
              <td>{fullName(customerId.fullName)}</td>
              <td className="mb-1">
                {sendouts?.servicesId
                  ?.map((id) => Services.getAbbr(id))
                  ?.join(", ")}
              </td>
              <td>{timeFormat(sendouts?.createdAt)}</td>
              <td>
                <MDBBtn
                  color="primary"
                  rounded
                  size="sm"
                  onClick={() => handlePrint(item)}
                >
                  <MDBIcon icon="print" />
                </MDBBtn>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
