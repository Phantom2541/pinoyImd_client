import { MDBBtn, MDBBtnGroup } from "mdbreact";
import Spinner from "../../../../../../components/spinner";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE,
  RESET,
} from "../../../../../../services/redux/slices/assets/branches";
import { Categories } from "../../../../../../services/fakeDb";

const UpdateCategories = ({
  branch,
  isOpen,
  setShowCategoryChoices: setShowChoices,
}) => {
  const { token } = useSelector(({ auth }) => auth),
    { formSubmitted, isSuccess } = useSelector(({ branches }) => branches),
    [categories, setCategories] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    setCategories(branch.pc);
  }, [branch]);

  useEffect(() => {
    if (isOpen && !formSubmitted && isSuccess) {
      setShowChoices(false);
      dispatch(RESET());
    }
  }, [formSubmitted, isSuccess, isOpen, dispatch, setShowChoices]);

  const handleUpdate = () => {
    dispatch(UPDATE({ token, data: { _id: branch._id, pc: categories } }));
  };

  return (
    <div
      className="overflow-auto rounded border bg-white shadow-sm position-absolute "
      style={{ zIndex: 9999, left: "auto", right: 0, width: "42rem" }}
    >
      <h6 className="m-2 mt-1" style={{ fontWeight: 500 }}>
        Update Categories
      </h6>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", // 3 columns
        }}
      >
        {Categories.map((cat, index) => {
          const isSelect = categories.includes(index);
          return (
            <div key={cat.abbr} className="d-flex align-items-center px-2 py-2">
              <input
                id={`category-${index}`}
                type="checkbox"
                className="form-check-input me-2"
                checked={isSelect}
                onChange={() => {
                  const _categories = [...categories];
                  const removeIndex = _categories.indexOf(index);
                  if (removeIndex > -1) {
                    _categories.splice(removeIndex, 1);
                  } else {
                    _categories.unshift(index);
                  }
                  setCategories(_categories);
                }}
              />
              <label htmlFor={`category-${index}`} className="form-check-label">
                {cat.name}
              </label>
            </div>
          );
        })}
      </div>
      <hr className="mt-n1" />
      <div className="text-right mt-n2 mb-2">
        <MDBBtnGroup size="sm">
          <MDBBtn
            color="white"
            disabled={formSubmitted}
            onClick={() => {
              setShowChoices(false);
              setCategories(branch?.pc || []);
            }}
          >
            Close
          </MDBBtn>
          <MDBBtn
            color="primary"
            onClick={handleUpdate}
            disabled={formSubmitted}
          >
            Update <Spinner formSubmitted={formSubmitted} />
          </MDBBtn>
        </MDBBtnGroup>
      </div>
    </div>
  );
};

export default UpdateCategories;
