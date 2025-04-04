import React from "react";
import BodySwitcher from "./bodySwitcher";
import Troupe from "./troupe";
import Category from "./category";

export default function Miscellaneous({ task, fontSize }) {
  const { specimen, packages = [] } = task; // Ensure `packages` is always an array
  const style = { fontSize: `${fontSize}rem` };

  const hasCategory = packages.includes(146);
  const hasTroupe = packages.includes(11);
  const hasBloodTyping = packages.includes(66);
  const hasSpecialPackage = packages.some((pkg) => [146, 11].includes(pkg));

  return (
    <div
      style={{
        border: "solid 2px",
        marginBottom: "3%",
        minHeight: "300px",
      }}
    >
      {!hasSpecialPackage && (
        <label className="mt-2 ml-5" style={style}>
          <h6>
            Specimen :
            <strong>
              <b>
                <u>{String(specimen || "N/A").toUpperCase()}</u>
              </b>
            </strong>
          </h6>
        </label>
      )}

      <BodySwitcher task={task} fontSize={fontSize} />

      {hasCategory && (
        <>
          <hr />
          <Category task={task} fontSize={fontSize} />
        </>
      )}

      {!hasCategory && !hasBloodTyping && !hasTroupe && (
        <>
          <hr />
          <Troupe task={task} fontSize={fontSize} />
        </>
      )}
    </div>
  );
}
