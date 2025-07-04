import { useState } from "react";
import { Categories } from "../../../../services/fakeDb";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE,
  RESET,
} from "../../../../services/redux/slices/assets/companies";
import Spinner from "../../../../components/spinner";
import { SetPatientCategories } from "../../../../services/redux/slices/assets/persons/auth";
import { MDBCard, MDBCardBody, MDBView } from "mdbreact";

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
      setCategories(JSON.parse(fakeDB)?.branch?.companyId?.pc);
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

  return (
    <MDBCard narrow>
      <MDBView
        cascade
        className="gradient-card-header blue-gradient narrower py-2 mx-4  d-flex justify-content-between align-items-center"
      >
        <span className="white-text mx-3 text-nowrap mt-0 py-1">
          Patient Categories
        </span>
      </MDBView>
      <MDBCardBody>
        <div className=" rounded  bg-white   ">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)", // 3 columns
            }}
          >
            {Categories.map((cat, index) => {
              const isSelect = categories.includes(index);
              return (
                <div
                  key={cat.abbr}
                  className="d-flex align-items-center px-2 py-2"
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
                    {cat.name}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default PatientCategories;
