import { MDBCol, MDBContainer, MDBRow } from "mdbreact";

const Schedule = ({ branches, setForm, form }) => {
  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol size="sm">
          <div className="d-flex align-items-center">
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
          <input type="date" className="form-control" />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Schedule;
