import { MDBTable } from "mdbreact";
import { useSelector } from "react-redux";
import { Echo } from "../../../../../../../../../../services/fakeDb";

const Regurgitation = () => {
  const { task } = useSelector(({ validator }) => validator);
  const { regur = [] } = task;
  return (
    <>
      <span className="font-weight-bold mt-n2 mb-1 d-block">REGURGITATION</span>
      <MDBTable small bordered>
        <tbody>
          {Echo.Regurgitation.map((field, index) => {
            return (
              <tr key={`echo-flowDoppler-${index}`}>
                <td
                  className="py-1 text-nowrap"
                  style={{ fontWeight: 500, width: "20%" }}
                >
                  {field}
                </td>
                {regur[index]?.map((result, cIdx) => (
                  <td
                    className="py-1 "
                    style={{ fontWeight: 400 }}
                    key={`echo-flowDoppler-${index}-${cIdx}`}
                  >
                    {result || ""}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </MDBTable>
    </>
  );
};

export default Regurgitation;
