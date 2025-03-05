import React from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { branch = {} } = activePlatform || {};
  const { name = "", subName = "" } = branch;

  return (
    <>
      <h5 className="text-center font-weight-bold">List of Personnel</h5>
      <div>
        <h5 className="font-weight-bold">Annex A</h5>
        <div
          className="d-flex justify-items-center"
          style={{ marginTop: "-8px" }}
        >
          <h5 style={{ fontWeight: 400 }}>Name of labaratory</h5>
          <h5 className="ml-5" style={{ fontWeight: 400 }}>
            : {name} {subName}
          </h5>
        </div>

        <div
          className="d-flex justify-items-center"
          style={{ marginTop: "-8px" }}
        >
          <h5 style={{ fontWeight: 400 }}>Address of labaratory </h5>
          <h5 className="ml-4" style={{ fontWeight: 400 }}>
            : 096 QUEZON ST., F. C. OTIC, CARRANGLAN, NUEVA ECIJA
          </h5>
        </div>
      </div>
    </>
  );
};

export default Header;
