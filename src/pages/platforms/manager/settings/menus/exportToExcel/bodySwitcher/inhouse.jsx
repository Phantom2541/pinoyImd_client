import { MDBTypography } from "mdbreact";

const Inhouse = ({ form, setForm }) => {
  return (
    <>
      <MDBTypography
        noteTitle="Tip: "
        note
        noteColor="primary"
        className="mt-4"
      >
        Select one or more price categories to include:
      </MDBTypography>
      {[
        { value: "opd", text: "SRP ( OPD/Walkin )" },
        { value: "er", text: "Emergency Room" },
        { value: "cw", text: "Charity Ward" },
        { value: "pw", text: "Private Ward" },
        { value: "sr", text: "Suite Room" },
      ].map((menuType, index) => {
        const selectedIndex = form.priceCategories.findIndex(
          ({ value }) => value === menuType.value
        );
        return (
          <div key={index} className="form-check mt-2 mr-2">
            <input
              className="form-check-input"
              type="checkbox"
              checked={selectedIndex > -1}
              onChange={() => {
                if (selectedIndex > -1) {
                  const _priceCategories = [...form.priceCategories];
                  _priceCategories.splice(selectedIndex, 1);
                  setForm({ ...form, priceCategories: _priceCategories });
                } else {
                  setForm({
                    ...form,
                    priceCategories: [...form.priceCategories, menuType],
                  });
                }
              }}
              id={`inhouse${index}`}
              value={menuType.value}
            />
            <label
              className="form-check-label pl-4"
              htmlFor={`inhouse${index}`}
            >
              {menuType.text}
            </label>
          </div>
        );
      })}
    </>
  );
};

export default Inhouse;
