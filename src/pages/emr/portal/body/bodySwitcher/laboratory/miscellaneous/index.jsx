import BodySwitcher from "./bodySwitcher";
import Troupe from "./troupe";
import Category from "./category";

export default function Miscellaneous({ task, fontSize }) {
  const { specimen, packages } = task;
  const style = { fontSize: `${fontSize}rem` };
  //console.log(fontSize);
  return (
    <div
      style={{
        border: "solid 1px",
      }}
    >
      {!packages.includes(146, 11) && (
        <label style={style} className="ml-2">
          <h6>
            Specimen:
            <strong className="ml-1">
              <b>
                <u>{String(specimen).toUpperCase()}</u>
              </b>
            </strong>
          </h6>
        </label>
      )}
      <BodySwitcher task={task} fontSize={fontSize} />
      {packages.includes(146) ? (
        <>
          <hr />
          <Category task={task} fontSize={fontSize} />
        </>
      ) : (
        !packages.includes(66) && (
          <>
            {!packages.includes(11) && (
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
