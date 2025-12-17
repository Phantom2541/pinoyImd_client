import { MDBTable } from "mdbreact";
import { EditableSelect } from "../../../../../../../../../components/customizable";
import { Widal } from "../../../../../../../../../services/fakeDb/diagnostics";

const WDL = ({ task, setTask = () => {} }) => {
  const { results = {} } = task;
  const handleChange = (titer, result) =>
    setTask({ ...task, results: { ...results, [titer]: result } });
  return (
    <MDBTable small>
      <thead>
        <tr>
          <th className="text-left">Investigation</th>
          <th className="text-left">Result</th>
          <th className="text-left">Interpretation</th>
        </tr>
      </thead>
      <tbody>
        {Widal.collections.map(({ name, abbr }, index) => (
          <tr key={index}>
            <td className="text-left">{name}</td>
            <td className="text-left">
              <div style={{ width: "5rem" }} className="m-0 p-0 mt-n2 mb-n2">
                <EditableSelect
                  inputClassName="m-0 p-0 "
                  collections={Widal.titers}
                  preValue={results[abbr] || ""}
                  onChange={(e) => handleChange(abbr, e)}
                />
              </div>
            </td>
            <td className="text-left">
              {Widal.get.interpretation(results[abbr] || "")}
            </td>
          </tr>
        ))}
      </tbody>
    </MDBTable>
  );
};

export default WDL;
