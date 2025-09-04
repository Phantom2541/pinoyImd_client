import React from "react";
import { useSelector } from "react-redux";
import { Cloudinary } from "../../../../../services/utilities";

export default function Print() {
  const { filtered } = useSelector(({ personnels }) => personnels);
  const { ct: branch } = useSelector(({ branches }) => branches);
  const { company, activePlatform } = useSelector((state) => state.auth);
  const { icgId = {} } = branch || {};

  const employees = filtered.map((item) => {
    const empName = item.front?.emp?.trim() || "NoName";
    const dob = item.back?.dob || "NoDOB";
    console.log("dob", dob);

    //   companies/Smart Care/General Tinio/ic/generatedID/  Thomas Emmanuel R. Pajarillaga-Dec, 24, 2005

    // Construct the exact Cloudinary URL using the employee name + DOB
    // Make sure to encode the URL because Cloudinary URLs can't have raw commas or spaces
    const imageNameRaw = `${empName}-${dob}`;
    const imageName = imageNameRaw.replace(/\s+/g, "");
    const frontUrl = `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
      company?.name
    )}/${encodeURIComponent(
      activePlatform?.branch?.name
    )}/ic/generatedID/${imageName}`;

    console.log(frontUrl);
    console.log("imageName", imageName);

    return { emp: empName, dob, frontUrl };
  });

  return (
    <div>
      <h3>Employees</h3>
      {employees.map(({ emp, dob, frontUrl }, idx) => (
        <div key={idx} style={{ marginBottom: "20px" }}>
          <p>
            {emp}-{dob}
          </p>
          <img
            src={frontUrl}
            alt={`${emp} Front ID`}
            style={{ maxWidth: "200px", border: "1px solid #ccc" }}
          />
        </div>
      ))}
    </div>
  );
}
