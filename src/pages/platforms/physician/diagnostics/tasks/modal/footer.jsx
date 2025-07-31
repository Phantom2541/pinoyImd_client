import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn } from "mdbreact";
import { LABRESULT } from "./../../../../../../services/redux/slices/commerce/pos/services/deals";
import {
  SetTASK,
  SetMODAL,
  SetHEALTHY,
  SetVALIDATOR,
} from "./../../../../../../services/redux/slices/diagnostics/laboratory/validator";

const Footer = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { success, task } = useSelector(({ validator }) => validator);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const department = activePlatform?.department;
  useEffect(() => {
    if (success) {
      dispatch(SetHEALTHY(false));
    }
  }, [success, dispatch]);

  const handleSave = () => {
    const { form } = task;

    // if laboratory =pathogist
    // if radiologist  and xray = radiologist
    // if radiologist  and ultrasound = sonographer
    // if radiologist  and ecg   = cardiologist

    const data = ["xray", "ultrasound", "miscellaneous"].includes(form)
      ? (() => {
          const { _id, ...rest } = task;
          return {
            ...rest,
            department,
            hasRead: true,
          };
        })()
      : {
          ...task,
          department,
          hasRead: true,
        };
    setIsLoading(true);
    dispatch(
      LABRESULT({
        token,
        data,
      })
    ).then(({ payload }) => {
      setIsLoading(false);
      dispatch(SetVALIDATOR(payload?.item || payload?.payload));
      dispatch(SetMODAL(false));
    });
  };

  const handleDisablePost = () => {
    if (task.form === "Ecg") return task.findings ? false : true;
    return ["Xray", "Ultrasound"].includes(task.form)
      ? task.description && task.impression
        ? false
        : true
      : false;
  };

  return (
    <div className="text-center mb-1-half border-top pt-2">
      <textarea
        placeholder="Remarks"
        value={task?.remarks}
        onChange={(e) =>
          dispatch(
            SetTASK({
              form: task?.form,
              task: { ...task, remarks: e.target.value },
            })
          )
        }
        className="w-100"
      />

      <div className="text-right">
        <MDBBtn
          disabled={isLoading || handleDisablePost()}
          id="task-post-btn"
          onClick={() => handleSave(true)}
          color="success"
        >
          Post
        </MDBBtn>
      </div>
    </div>
  );
};

export default Footer;
