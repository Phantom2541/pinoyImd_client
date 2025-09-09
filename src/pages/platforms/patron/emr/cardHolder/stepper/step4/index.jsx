import { MDBCol, MDBContainer, MDBRow } from "mdbreact";
import { useEffect, useState } from "react";

const Schedule = ({ branches: _branches, setForm, form }) => {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const customOrder = {
      Active: 1,
      Expired: 2,
      Cancelled: 3,
      Draft: 99,
      Suspended: 100,
    };

    const sorted = [..._branches].sort((a, b) => {
      const aStatus = (a.status || "").trim();
      const bStatus = (b.status || "").trim();
      const aOrder = customOrder[aStatus] ?? 999;
      const bOrder = customOrder[bStatus] ?? 999;
      return aOrder - bOrder;
    });

    setBranches(sorted);
  }, [_branches]);

  const handleConfig = (status) => {
    if (status === "Draft") {
      return {
        remarks: "(Under Maintenance)",
        disabled: true,
        className: "text-warning bg-light",
      };
    }

    return {};
  };

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
              required
              className="form-control"
              onChange={(e) => {
                setForm({ ...form, branch: e.target.value });
              }}
            >
              <option value={""}>Select Branch</option>
              {branches?.map((branch, index) => {
                const { settings = {} } = branch;
                const { status } = settings;
                const {
                  className = "",
                  disabled = false,
                  remarks = "",
                } = handleConfig(status);
                return (
                  <option
                    key={`${index}-branch`}
                    value={branch._id}
                    className={className}
                    disabled={disabled}
                  >
                    {branch.name} {branch.subName} {remarks}
                  </option>
                );
              })}
            </select>
          </div>
        </MDBCol>
      </MDBRow>
      <MDBRow className="mt-3">
        <MDBCol>
          <span>Schedule:</span>
          <input
            required
            type="date"
            min={new Date().toISOString().split("T")[0]}
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
