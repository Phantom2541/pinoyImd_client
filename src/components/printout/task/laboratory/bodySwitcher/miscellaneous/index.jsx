import BodySwitcher from "./bodySwitcher";
import Troupe from "./troupe";
import Category from "./category";

export default function Miscellaneous({ task, fontSize }) {
  const { specimen, data } = task;
  const style = { fontSize: `${fontSize}rem` };
  return (
    <div
      style={{
        border: "solid 1px",
        marginBottom: "3%",
        minHeight: "300px",
      }}
    >
      {!data.includes(146) && !data.includes(11) && (
        <label className="mt-2 ml-5" style={style}>
          <h6>
            Specimen :
            <strong>
              <b>
                <u>{String(specimen).toUpperCase()}</u>
              </b>
            </strong>
          </h6>
        </label>
      )}
      <BodySwitcher task={task} fontSize={fontSize} />
      {data.includes(146) ? (
        <>
          <hr />
          <Category task={task} fontSize={fontSize} />
        </>
      ) : (
        !data.includes(66) && (
          <>
            {!data.includes(11) && (
              <>
                <hr />
                <Troupe task={task} fontSize={fontSize} />
              </>
            )}
          </>
        )
      )}
    </div>
  );
}
