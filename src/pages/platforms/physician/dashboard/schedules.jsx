import {
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBView,
} from "mdbreact";
import { useSelector } from "react-redux";
import { capitalize } from "../../../../services/utilities";
const Schedules = () => {
  const { clinic } = useSelector(({ clinicInfo }) => clinicInfo);
  const { schedules = [] } = clinic;
  const showingTime = ({ hour, min }) => {
    const h = hour % 12 || 12; // convert to 12-hour format
    const m = String(min).padStart(2, "0"); // ensure 2 digits
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${h}:${m} ${ampm}`;
  };

  return (
    <MDBCard narrow>
      <MDBView
        cascade
        className="gradient-card-header blue-gradient narrower py-2 px-4 mb-3 d-flex justify-content-between align-items-center"
      >
        <h5>{clinic?.title}</h5>
      </MDBView>
      <MDBCardBody>
        <MDBTable small bordered>
          <MDBTableHead>
            <tr>
              <th>Location</th>
              <th>Details</th>
              <th>Type</th>
              <th>Days</th>
              <th>Time</th>
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
      </MDBCardBody>
    </MDBCard>
  );
};

export default Schedules;
