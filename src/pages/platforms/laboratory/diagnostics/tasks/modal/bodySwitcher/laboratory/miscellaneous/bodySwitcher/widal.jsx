import { MDBTable } from "mdbreact";
import { EditableSelect } from "../../../../../../../../../../components/customizable";
import { useState } from "react";
const widalAntigens = [
  { name: "O-somatic (TO) antigen", abbr: "TO" },
  { name: "H-somatic (TH) antigen", abbr: "TH" },
  { name: "O-somatic (AO) antigen", abbr: "AO" },
  { name: "H-somatic (AH) antigen", abbr: "AH" },
  { name: "O-somatic (BO) antigen", abbr: "BO" },
  { name: "H-somatic (BH) antigen", abbr: "BH" },
];

const interpretation = {
  "<1:40": "Normal",
  "1:40": "High",
  "1:80": "Warning",
  "1:160": "Positive",
  "1:320": "Maximum",
};

const Widal = () => {
  const [form, setForm] = useState({});
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
        {widalAntigens.map(({ name, abbr }, index) => (
          <tr key={index}>
            <td className="text-left">{name}</td>
            <td className="text-left">
              <div style={{ width: "5rem" }} className="m-0 p-0 mt-n2 mb-n2">
                <EditableSelect
                  inputClassName="m-0 p-0"
                  collections={["<1:40", "1:40", "1:80", "1:160", "1:320"]}
                  value={form[abbr] || ""}
                  onChange={(e) => setForm({ ...form, [abbr]: e })}
                />
              </div>
            </td>
            <td className="text-left">
              {form[abbr] && interpretation[form[abbr]]}
            </td>
          </tr>
        ))}
      </tbody>
    </MDBTable>
  );
};

export default Widal;
