import { MDBTable } from "mdbreact";
import { useSelector } from "react-redux";
import { Echo } from "../../../../../../../../../../services/fakeDb";

const Tissue = () => {
  const { task } = useSelector(({ validator }) => validator);
  const { tissue = [] } = task;
  return (
    <>
      <span className="font-weight-bold mt-n2 mb-1 d-block">
        TISSUE DOPPLER STUDY
      </span>
      <MDBTable small bordered>
        <tbody>
          {Echo.TissueDoppler.map((field, index) => {
            const extras = ["E:", "A:"];
            return (
              <tr key={`echo-flowDoppler-${index}`}>
                <td
                  className="py-1 text-nowrap"
                  style={{ fontWeight: 500, width: "20%" }}
                >
                  {field}
                </td>
                {tissue[index]?.map((result, cIdx) => (
                  <td
                    className="py-1 "
                    style={{ fontWeight: 400 }}
                    key={`echo-flowDoppler-${index}-${cIdx}`}
                  >
                    <div className="d-flex justify-content-between">
                      <span className="text-left d-block">{extras[cIdx]}</span>
                      <span className="d-block text-center">
                        {result || ""}
                      </span>
                      <span></span>
                    </div>
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

export default Tissue;
