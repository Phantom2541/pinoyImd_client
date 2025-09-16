import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TRACKER } from "../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable, MDBTableHead } from "mdbreact";
import { dateFormat } from "../../../../../../../services/utilities";
import Results from "./results";
const RadForms = ["Ecg", "Xray", "Ultrasound", "2DEcho"];
const Step2 = ({ form, setForm }) => {
  const { token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ validator }) => validator),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      TRACKER({
        token,
        key: {
          customerId: form?.user?._id,
          limit: 10,
        },
      })
    );
  }, [dispatch]);
  return (
    <div>
      <Results />
    </div>
  );
};

export default Step2;
