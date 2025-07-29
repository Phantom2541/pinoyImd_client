import { useSelector, useDispatch } from "react-redux";
import { Select } from "./../../../../../../../../../components/customizable";
import { SetTASK } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBCol, MDBInput } from "mdbreact";
const choices = [
  {
    str: "Negative",
    index: 0,
  },
  {
    str: "Positive",
    index: 1,
  },
];

export default function Results() {
  const { task } = useSelector(({ validator }) => validator),
    dispatch = useDispatch();
  const { method, met, thc } = task;

  const handleSelectChange = (name, value) =>
    dispatch(SetTASK({ form: task?.form, task: { ...task, [name]: value } }));

  return (
    <>
      <MDBInput
        type="text"
        label="Test Method"
        value={method}
        onChange={(e) => handleSelectChange("method", e.target.value)}
        required
      />
      <MDBCol>
        <Select
          inputClassName={met && "text-danger"}
          collections={choices}
          label="Methamphetamine"
          preValue={String(met)}
          values="str"
          keys="index"
          onChange={(e) => handleSelectChange("met", Number(e))}
        />
      </MDBCol>
      <MDBCol>
        <Select
          inputClassName={thc && "text-danger"}
          collections={choices}
          label="Tetrahydrocannabinol"
          preValue={String(thc)}
          values="str"
          keys="index"
          onChange={(e) => handleSelectChange("thc", Number(e))}
        />
      </MDBCol>
    </>
  );
}
