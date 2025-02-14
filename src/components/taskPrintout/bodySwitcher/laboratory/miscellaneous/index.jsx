import React from "react";
import BodySwitcher from "./bodySwitcher";
import Troupe from "./troupe";
import Category from "./category";

export default function Miscellaneous({ task, fontSize }) {
  const { specimen, packages } = task;
  const style = { fontSize: `${fontSize}rem` };
  console.log(fontSize);
  return (
    <div
      style={{
        border: "solid 2px",
        marginBottom: "3%",
        minHeight: "300px",
      }}
    >
      {!packages.includes(146, 11) && (
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
