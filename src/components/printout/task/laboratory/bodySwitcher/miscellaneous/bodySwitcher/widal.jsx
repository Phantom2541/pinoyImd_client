import { MDBTable } from "mdbreact";
import { Widal } from "../../../../../../../services/fakeDb/diagnostics";

const WDL = ({ task }) => {
  const { results = {} } = task;
  return (
    <div className="p-1">
      <h3 className="text-center mt-1">WIDAL SLIDE AGGLUTINATION TEST</h3>

      <MDBTable small>
        <thead>
          <tr>
            <th>Investigation</th>
            <th className="text-center">Result</th>
            <th className="text-center">Interpretation</th>
          </tr>
        </thead>
        <tbody>
          {Widal.collections.map(({ name, abbr }, index) => (
            <tr key={index}>
              <td>{name}</td>
              <td style={{ fontWeight: 600 }} className="text-center">
                {results[abbr]}
              </td>
              <td
                style={{
                  fontWeight: 600,
                  color: Widal.get.color(results[abbr]),
                }}
                className="text-center"
              >
                {Widal.get.interpretation(results[abbr])}
              </td>
            </tr>
          ))}
        </tbody>
      </MDBTable>
    </div>
  );
};

export default WDL;
