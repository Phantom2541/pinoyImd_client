import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBInput } from "mdbreact";

export default function Troupe() {
  const { task } = useSelector(({ validator }) => validator),
    dispatch = useDispatch();
  const { troupe } = task;
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      SetTASK({
        form: task?.form,
        task: { ...task, troupe: { ...troupe, [name]: value } },
      })
    );
    dispatch(SetPARAMS({ key: "troupe", value: { ...troupe, [name]: value } }));
  };

  return (
    <>
      <MDBInput
        label="Method"
        name="method"
        type="text"
        value={troupe?.method || ""}
        onChange={handleChange}
      />
      <MDBInput
        label="Kit"
        name="kit"
        type="text"
        value={troupe?.kit || ""}
        onChange={handleChange}
      />
      <MDBInput
        label="Lot Number"
        name="lot"
        type="text"
        value={troupe?.lot || ""}
        onChange={handleChange}
      />
      <MDBInput
        label="Expiry"
        name="expiry"
        type="text"
        value={troupe?.expiry || ""}
        onChange={handleChange}
      />
    </>
  );
}
