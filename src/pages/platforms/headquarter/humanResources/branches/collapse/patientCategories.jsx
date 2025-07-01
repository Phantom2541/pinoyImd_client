import { useState } from "react";
import { Categories } from "../../../../../../services/fakeDb";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE,
  RESET,
} from "../../../../../../services/redux/slices/assets/branches";
import Spinner from "../../../../../../components/spinner";

const PatientCategories = ({ branch, isOpen = false }) => {
  const { token } = useSelector(({ auth }) => auth),
    { formSubmitted, isSuccess } = useSelector(({ branches }) => branches),
    [indexUpdated, setIndexUpdated] = useState(-1),
    [categories, setCategories] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    setIndexUpdated(-1);
    setCategories(branch?.pc || []);
  }, [branch]);

  useEffect(() => {
    if (isOpen && !formSubmitted && isSuccess) {
      setIndexUpdated(-1);
      dispatch(RESET());
    }
  }, [formSubmitted, isSuccess, isOpen, dispatch]);

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
      UPDATE({ token, data: { _id: branch._id, pc: _categories } })
    ).then(() => {
      setIndexUpdated(-1);
      setCategories(_categories);
    });
  };

  return (
    <div className="transition-all mt-2 px-2">
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
                    id={`category-${index}`}
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={isSelect}
                    disabled={formSubmitted}
                    onClick={() => handleUpdate(index)}
                  />
                )}

                <label
                  htmlFor={`category-${index}`}
                  className="form-check-label"
                >
                  {cat.name}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PatientCategories;
