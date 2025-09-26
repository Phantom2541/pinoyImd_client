import { MDBContainer, MDBInput } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { SetTASK } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";

export default function Pbs() {
  const { task } = useSelector(({ validator }) => validator);
  const { findings = "" } = task;
  const dispatch = useDispatch();
  return (
    <MDBContainer>
      <MDBInput
        type="textarea"
        label="Type the findings here..."
        value={findings}
        onChange={({ target }) =>
          dispatch(
            SetTASK({
              form: task?.form,
              task: { ...task, findings: target.value },
            })
          )
        }
        style={{ height: "130px" }}
      />
    </MDBContainer>
  );
}
