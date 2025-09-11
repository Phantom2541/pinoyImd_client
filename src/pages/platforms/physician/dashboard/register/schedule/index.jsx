import EditableSelect from "../../../../../../components/customizable/editableSelect";
import { MDBCol, MDBInput, MDBRow, MDBBtn } from "mdbreact";

const Schedule = () => {
  return (
    <MDBCol>
      <span className="fw-bold">Schedule</span>
      <MDBRow>
        <MDBCol>
          <MDBInput label="Address" />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <MDBInput label="Building" />
        </MDBCol>
        <MDBCol>
          <MDBInput label="Floor" />
        </MDBCol>
        <MDBCol>
          <MDBInput label="Room" />
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol>
          <MDBInput label="Slot" />
        </MDBCol>
        <MDBCol>
          <MDBInput label="Capacity" />
        </MDBCol>
        <MDBCol>
          <div className="mt-4">
            <EditableSelect
              collections={["15", "30", "45"]}
              label="Duration in minutes"
            />
          </div>
        </MDBCol>
        <MDBCol>
          <div className="mt-4">
            <EditableSelect
              collections={["onsite", "telemedicine"]}
              label="Type"
            />
          </div>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <div className="d-flex justify-content-around">
            {["M", "T", "W", "TH", "F", "Sat", "Sun"].map((day) => (
              <MDBBtn rounded floating color="primary" key={day} outline>
                {day}
              </MDBBtn>
            ))}
          </div>
        </MDBCol>
      </MDBRow>
      <MDBRow className="mt-3">
        <MDBCol>
          <span>Start Time:</span>
          <div className="d-flex align items-center mt-4">
            <EditableSelect
              collections={[7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5]}
              label="Hours"
            />
            <EditableSelect
              collections={["00", "15", "30", "45"]}
              label="Minutes"
              className="mx-4"
            />
            <EditableSelect collections={["AM", "PM"]} label="Period" />
          </div>
        </MDBCol>
        <MDBCol>
          <span>End Time:</span>
          <div className="d-flex align items-center mt-4">
            <EditableSelect
              collections={[7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5]}
              label="Hours"
            />
            <EditableSelect
              collections={["00", "15", "30", "45"]}
              label="Minutes"
              className="mx-4"
            />
            <EditableSelect collections={["AM", "PM"]} label="Period" />
          </div>
        </MDBCol>
      </MDBRow>
    </MDBCol>
  );
};

export default Schedule;
