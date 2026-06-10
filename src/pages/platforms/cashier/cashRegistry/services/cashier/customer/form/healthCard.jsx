import { SelectUser } from "../../../../../../../../components/searchables";

const HealthCardFields = ({ form = {}, setForm, providerType }) => {
  const update = (key, value) =>
    setForm((prev) => {
      const next = {
        ...prev,
        [key]: value,
      };

      if (key === "memberType" && value !== "dependent") {
        delete next.relationship;
        delete next.account;
      }

      return next;
    });

  const isPhilHealth = providerType === "philhealth";
  const isHmo = providerType === "hmo";
  const isCompany = providerType === "company";

  return (
    <>
      <div className="mb-3">
        <label>
          {isPhilHealth ? "PhilHealth PIN" : "Card / Account Number"}
        </label>
        <input
          className="form-control"
          value={form.number || ""}
          onChange={(e) => update("number", e.target.value)}
          placeholder={isPhilHealth ? "Enter PhilHealth PIN" : "Enter number"}
        />
      </div>

      {(isPhilHealth || isHmo) && (
        <div className="mb-3">
          <label>Member Type</label>
          <select
            className="form-control"
            value={form.memberType || ""}
            onChange={(e) => update("memberType", e.target.value)}
          >
            <option value="">Select member type</option>

            {isPhilHealth ? (
              <>
                <option value="direct">Direct Contributor</option>
                <option value="dependent">Dependent</option>
                <option value="senior">Senior Citizen</option>
                <option value="sponsored">Sponsored</option>
              </>
            ) : (
              <>
                <option value="principal">Principal</option>
                <option value="dependent">Dependent</option>
              </>
            )}
          </select>
        </div>
      )}

      {(form.memberType === "dependent" || isCompany) && (
        <div className="mb-3">
          <label>Relationship</label>
          <select
            className="form-control"
            value={form.relationship || ""}
            onChange={(e) => update("relationship", e.target.value)}
          >
            <option value="">Select relationship</option>
            <option value="self">Self</option>
            <option value="spouse">Spouse</option>
            <option value="child">Child</option>
            <option value="parent">Parent</option>
          </select>
        </div>
      )}

      {form.memberType === "dependent" && (
        <div className="mb-3">
          <label className="d-block mb-1">Primary Account Holder</label>
          <SelectUser
            label="Search account holder"
            displayWithLabel={false}
            setUser={(user) => update("account", user?._id || undefined)}
          />
        </div>
      )}

      {(isPhilHealth || isHmo || isCompany) && (
        <>
          <div className="mb-3">
            <label>Employer / Company</label>
            <input
              className="form-control"
              value={form.employer || ""}
              onChange={(e) => update("employer", e.target.value)}
              placeholder="Enter employer or company"
            />
          </div>

          {isHmo && (
            <div className="mb-3">
              <label>Plan</label>
              <input
                className="form-control"
                value={form.plan || ""}
                onChange={(e) => update("plan", e.target.value)}
                placeholder="Enter plan (e.g. Premium, Plus, Regular)"
              />
            </div>
          )}

          {isHmo && (
            <div className="mb-3">
              <label>Expiry Date</label>
              <input
                type="date"
                className="form-control"
                value={form.expiry || ""}
                onChange={(e) => update("expiry", e.target.value)}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default HealthCardFields;
