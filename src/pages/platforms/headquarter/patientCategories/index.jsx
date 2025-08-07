import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE,
  RESET,
} from "../../../../services/redux/slices/assets/companies";
import Spinner from "../../../../components/spinner";
import { Categories } from "../../../../services/fakeDb";
import { SetPatientCategories } from "../../../../services/redux/slices/assets/persons/auth";
import { MDBCard, MDBCardBody, MDBView } from "mdbreact";

const TypeLabels = {
  walkin: "🏃 Walk-in",
  inpatient: "🏥 Inpatient",
  outpatient: "🧍 Outpatient",
  corporate: "👥 Corporate Accounts",
  clearance: "📄 Permit / Clearance",
  promo: "🎁 Promotional",
};

const TypeTooltips = {
  walkin: "Pasok kahit walang appointment",
  inpatient: "Admitted / naka-confine",
  outpatient: "Nagpa-checkup pero hindi admitted",
  corporate: "Under company (Health Card/Phil Health) / wellness program",
  clearance: "Pre-employment, surgical, or business requirement",
  promo: "Naka-sale o naka-bundle",
};

const PatientCategories = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { formSubmitted, isSuccess } = useSelector(({ companies }) => companies),
    [indexUpdated, setIndexUpdated] = useState(-1),
    [categories, setCategories] = useState([]),
    dispatch = useDispatch();
  const { branch = {} } = activePlatform;
  const { companyId = {} } = branch || {};

  useEffect(() => {
    setIndexUpdated(-1);
    const fakeDB = localStorage.getItem("activePlatform");
    if (fakeDB) {
      setCategories(JSON.parse(fakeDB)?.branch?.companyId?.pc || []);
    }
  }, []);

  useEffect(() => {
    if (!formSubmitted && isSuccess) {
      setIndexUpdated(-1);
      dispatch(RESET());
    }
  }, [formSubmitted, isSuccess, dispatch]);

  const handleUpdate = (pk) => {
    const _categories = [...categories];
    const removeIndex = _categories.indexOf(pk);
    setIndexUpdated(pk);
    if (removeIndex > -1) {
      _categories.splice(removeIndex, 1);
    } else {
      _categories.unshift(pk);
    }
    dispatch(
      UPDATE({ token, data: { _id: companyId?._id, pc: _categories } })
    ).then(() => {
      setIndexUpdated(-1);
      setCategories(_categories);
      dispatch(SetPatientCategories(_categories));
    });
  };

  const groupedCategories = Categories.reduce((acc, cat, index) => {
    if (!acc[cat.type]) acc[cat.type] = [];
    acc[cat.type].push({ ...cat, index });
    return acc;
  }, {});

  // const toggleGroup = (type, allChecked) => {
  //   let updated = [...categories];
  //   groupedCategories[type].forEach(({ index }) => {
  //     const exists = updated.includes(index);
  //     if (allChecked && exists) {
  //       updated = updated.filter((i) => i !== index); // uncheck
  //     } else if (!allChecked && !exists) {
  //       updated.push(index); // check
  //     }
  //   });
  //   dispatch(UPDATE({ token, data: { _id: companyId?._id, pc: updated } }));
  //   dispatch(SetPatientCategories(updated));
  //   setCategories(updated);
  // };

  return (
    <MDBCard narrow>
      <MDBView
        cascade
        className="gradient-card-header blue-gradient narrower py-2 mx-4 d-flex justify-content-between align-items-center"
      >
        <span className="white-text mx-3 text-nowrap mt-0 py-1">
          Patient Categories
        </span>
      </MDBView>
      <MDBCardBody>
        <div className="bg-white rounded">
          {Object.entries(groupedCategories).map(([type, group]) => {
            // const allChecked = group.every((cat) =>
            //   categories.includes(cat.index)
            // );

            return (
              <div key={type} className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <h6 className="text-uppercase font-weight-bold mb-0 me-2">
                    {TypeLabels[type] || type}
                  </h6>
                  <small className="text-muted me-3">
                    {TypeTooltips[type]}
                  </small>

                  <div className="form-check form-switch ms-auto">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id={`toggle-${type}`}
                      checked={group.every((cat) =>
                        categories.includes(cat.index)
                      )}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        let updated = [...categories];

                        if (checked) {
                          // Add all group items
                          group.forEach(({ index }) => {
                            if (!updated.includes(index)) {
                              updated.push(index);
                            }
                          });
                        } else {
                          // Remove all group items
                          updated = updated.filter(
                            (i) => !group.map((g) => g.index).includes(i)
                          );
                        }

                        setCategories(updated);
                        dispatch(
                          UPDATE({
                            token,
                            data: { _id: companyId?._id, pc: updated },
                          })
                        );
                        dispatch(SetPatientCategories(updated));
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`toggle-${type}`}
                    >
                      {group.every((cat) => categories.includes(cat.index))
                        ? "Selected"
                        : "None"}
                    </label>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                  }}
                >
                  {group.map(({ name, abbr, index }) => {
                    const isSelect = categories.includes(index);
                    const tooltip = `${name} (${abbr.toUpperCase()}) — ${
                      TypeTooltips[type] || "Category"
                    }`;

                    return (
                      <div
                        key={abbr}
                        className="d-flex align-items-center px-2 py-1"
                        title={tooltip}
                      >
                        {formSubmitted && indexUpdated === index ? (
                          <div className="mr-3 ml-n1">
                            <Spinner formSubmitted={formSubmitted} />
                          </div>
                        ) : (
                          <input
                            id={`category-${index}-${companyId?._id}`}
                            type="checkbox"
                            className="form-check-input me-2"
                            checked={isSelect}
                            disabled={formSubmitted}
                            onClick={() => handleUpdate(index)}
                          />
                        )}
                        <label
                          htmlFor={`category-${index}-${companyId?._id}`}
                          className="form-check-label"
                        >
                          {name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default PatientCategories;
