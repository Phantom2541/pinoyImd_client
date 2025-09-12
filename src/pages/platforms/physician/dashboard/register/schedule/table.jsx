import {
  MDBBtn,
  MDBIcon,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import { capitalize } from "../../../../../../services/utilities";

const Table = ({ form, setForm = () => {} }) => {
  const { schedules = [] } = form;

  const showingTime = ({ hour, min }) => {
    const h = hour % 12 || 12; // convert to 12-hour format
    const m = String(min).padStart(2, "0"); // ensure 2 digits
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${h}:${m} ${ampm}`;
  };

  return (
    <>
      <span style={{ fontWeight: 500 }}>Schedule List</span>
      <MDBTable small bordered>
        <MDBTableHead>
          <tr>
            <th>Location</th>
            <th>Details</th>
            <th>Type</th>
            <th>Days</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {schedules.length > 0 ? (
            schedules.map((schedule, index) => {
              const {
                capacity,
                days = [],
                start,
                end,
                type,
                duration,
                slot,
                location = {},
              } = schedule;
              const { address, building, floor, room } = location;

              const renderDetail = (label, value) =>
                value ? (
                  <span className="mr-2">
                    <span style={{ fontWeight: 500 }} className="mr-1">
                      {label}:
                    </span>
                    <span>{value}</span>
                  </span>
                ) : null;

              return (
                <tr key={index}>
                  {/* Address & Location */}
                  <td>
                    <div>
                      {renderDetail("Address", address)}
                      <div>
                        {renderDetail("Building", building)}
                        {renderDetail("Floor", floor)}
                        {renderDetail("Room", room)}
                      </div>
                    </div>
                  </td>

                  {/* Duration, Slot, Capacity */}
                  <td>
                    <div>
                      {renderDetail(
                        "Duration",
                        duration ? `${duration} mins` : null
                      )}
                      <div>
                        {renderDetail("Slot", slot)}
                        {renderDetail("Capacity", capacity)}
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td>{type ? capitalize(type) : "-"}</td>

                  {/* Days */}
                  <td>{days.length > 0 ? days.join(", ") : "-"}</td>

                  {/* Time */}
                  <td>
                    {start && end ? (
                      <>
                        <span>{showingTime(start)}</span> -{" "}
                        <span>{showingTime(end)}</span>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <MDBBtn
                      rounded
                      color="danger"
                      size="sm"
                      className="px-2"
                      onClick={() =>
                        setForm({
                          schedules: schedules.filter((_, i) => i !== index),
                        })
                      }
                    >
                      <MDBIcon icon="trash" />
                    </MDBBtn>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No Schedule Created
              </td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>
    </>
  );
};

export default Table;
