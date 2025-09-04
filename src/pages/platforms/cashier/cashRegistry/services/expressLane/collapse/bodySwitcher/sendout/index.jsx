import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBBtnGroup,
  MDBBadge,
} from "mdbreact";
import { Services } from "../../../../../../../../../services/fakeDb";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPROCESS,
  UPDATE,
} from "../../../../../../../../../services/redux/slices/commerce/pos/services/onBoardings";
export default function Sendout({ item }) {
  const { token } = useSelector(({ auth }) => auth),
    { client, createdAt, services, cancelled = [], status } = item,
    dispatch = useDispatch();

  const handleProcess = (deal) => {
    dispatch(SetPROCESS(deal));
  };

  const handleDeny = async () => {
    const source = client?.name || client?.displayname;
    const { value: reason } = await Swal.fire({
      title: `${source}`,
      input: "textarea",
      inputLabel: "Reason for denial",
      inputPlaceholder: "Enter your reason here...",
      inputAttributes: {
        "aria-label": "Reason",
      },
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You must provide a reason!";
        }
      },
    });

    if (reason) {
      dispatch(
        UPDATE({
          token,
          data: { ...item, reason, status: "denied" },
        })
      );
      Swal.fire({
        icon: "success",
        title: "Request Denied",
        html: `The action for <b>${source}</b> has been saved successfully.`,
      });
    }
  };

  return (
    <>
      <MDBTable bordered className="m-0 p-0">
        <MDBTableHead>
          <tr>
            <th>Sources</th>
            <th>Services</th>
            <th>Generated At</th>
            <th>Action</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          <tr>
            <td className="fw-bold">{client?.name || client?.displayname}</td>
            <td>
              {services?.map((id) => {
                const notProcess = cancelled.includes(id);
                return (
                  <MDBBadge
                    color={
                      !notProcess && status === "done" ? "light" : "primary"
                    }
                    className="mr-2"
                    key={id}
                  >
                    <span
                      title={
                        status === "done" &&
                        `${
                          notProcess ? "Not Available" : "Completed"
                        } \n ${Services.getName(id)}`
                      }
                      style={{
                        fontSize: "0.8rem",
                        ...(!notProcess &&
                          status === "done" && {
                            textDecoration: "line-through",
                            textDecorationThickness: "3px", // thicker line
                            textDecorationColor: "gray",
                          }),
                      }}
                    >
                      {Services.getAbbr(id)}
                    </span>
                  </MDBBadge>
                );
              })}
            </td>
            <td>
              {`${new Intl.DateTimeFormat("default", {
                month: "long",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(createdAt || Date.now()))}`}
            </td>
            <td>
              {status !== "done" ? (
                <MDBBtnGroup>
                  <MDBBtn
                    size="sm"
                    color="primary"
                    onClick={() => handleProcess(item)}
                  >
                    Process
                  </MDBBtn>
                  <MDBBtn
                    size="sm"
                    color="danger"
                    onClick={() => handleDeny(item)}
                  >
                    Deny
                  </MDBBtn>
                </MDBBtnGroup>
              ) : (
                <span className="text-success fw-bold">Done</span>
              )}
            </td>
          </tr>
        </MDBTableBody>
      </MDBTable>
    </>
  );
}
