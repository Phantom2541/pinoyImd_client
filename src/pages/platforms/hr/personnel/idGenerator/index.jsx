import React, { useEffect } from "react";
import ID from "./id";
import Setting from "./setting";
import { useDispatch, useSelector } from "react-redux";
import { CTBROWSE } from "../../../../../services/redux/slices/assets/branches";

export default function IDGenerator() {
  const { activePlatform, token } = useSelector(({ auth }) => auth);
  const { ct: branch } = useSelector(({ branches }) => branches);
  const dispatch = useDispatch();
  try {
    const ctData = branch.ct ? JSON.parse(branch.ct) : null;
    console.log("ct", ctData);
  } catch (err) {
    console.error("Invalid JSON in branch.ct:", branch.ct, err);
  }

  useEffect(() => {
    dispatch(CTBROWSE({ token, data: { _id: activePlatform.branchId } }));
  }, []);
  return (
    <div
      className="id-generator-wrapper"
      style={{ display: "flex", gap: "20px" }}
    >
      <ID
        frontImage={null}
        backImage={null}
        layout="landscape"
        placedValues={[]}
      />
      <Setting setLayout={() => {}} options={["landscape", "portrait"]} />
    </div>
  );
}
