import { MDBTypography } from "mdbreact";
import { useEffect, useState } from "react";
import { Categories } from "../../../../../../../services/fakeDb";

const Inhouse = ({ form, setForm }) => {
  const fakeDB = localStorage.getItem("activePlatform");
  var categoryIndexes = [];
  if (fakeDB) {
    categoryIndexes = JSON.parse(fakeDB)?.branch?.companyId?.pc;
  }
  const srpIndexs = [2, 3, 4, 5]; //Emergency Room,Charity Ward,Private Ward,Suite Room
  const foundIndexs = [...categoryIndexes]
    .filter((pk) => srpIndexs.includes(pk))
    .sort((a, b) => a - b);
  const categories = foundIndexs.map((cIndex) => Categories[cIndex]);

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
      {[{ value: "opd", name: "SRP ( OPD/Walkin )" }, ...categories]
        .filter((menuType) => menuType)
        .map((menuType, index) => {
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
                {menuType.name}
              </label>
            </div>
          );
        })}
    </>
  );
};

export default Inhouse;
