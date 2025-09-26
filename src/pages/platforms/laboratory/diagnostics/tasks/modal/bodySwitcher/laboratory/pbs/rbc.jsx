import { MDBTable } from "mdbreact";
import { Pbs } from "../../../../../../../../../services/fakeDb/diagnostics";
import { EditableSelect } from "../../../../../../../../../components/customizable";
const rbc = {
  a: "",
  b: "",
  c: "",
  d: "",
  e: "",
};
const RBC = () => {
  return (
    <MDBTable small className="mt-n3">
      <thead>
        <tr>
          <th className="text-left">Parameter/Feature</th>
          <th className="text-left">Result</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(rbc).map(([key, value], index) => (
          <tr>
            <td className="text-left">{Pbs.rbc.getLabel(index)}</td>
            <td>
              <div style={{ width: "8rem" }}>
                <EditableSelect
                  collections={Pbs.rbc.getValues(index)}
                  inputClassName="m-0 p-0 mt-n2"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </MDBTable>
  );
};

export default RBC;
