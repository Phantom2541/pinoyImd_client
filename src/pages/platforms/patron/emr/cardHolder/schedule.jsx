import { MDBCol, MDBContainer, MDBRow } from "mdbreact";

const Schedule = ({ branches, setForm, form }) => {
  return (
    <MDBContainer className="mt-2">
      <MDBRow>
        <MDBCol size="sm">
          <div>
            <span>Branch:</span>
            <select
              name="branch"
              id="branch"
              value={form.branch}
              className="form-control"
              onChange={(e) => {
                setForm({ ...form, branch: e.target.value });
              }}
            >
              <option value={""}>Select Branch</option>
              {branches?.map((branch, index) => (
                <option key={`${index}-branch`} value={branch._id}>
                  {branch.name} {branch.subName}
                </option>
              ))}
            </select>
          </div>
        </MDBCol>
      </MDBRow>
      <MDBRow className="mt-3">
        <MDBCol>
          <span>Schedule:</span>
          <input
            type="date"
            className="form-control"
            value={form.schedule}
            onChange={(e) => setForm({ ...form, schedule: e.target.value })}
          />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Schedule;
