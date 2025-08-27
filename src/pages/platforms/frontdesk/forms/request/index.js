import React from "react";

export default function RequestForm() {
  return (
    <div className="w-[105mm] h-[148mm] border border-black p-2 text-[10px] leading-tight">
      {/* Header */}
      <div className="text-center font-bold underline mb-1">REQUEST FORM</div>

      {/* Patient Info */}
      <div className="grid grid-cols-2 gap-1 text-[9px] mb-1">
        <div>
          <label>Name:</label>
          <div className="border-b border-black h-3"></div>
        </div>
        <div className="grid grid-cols-3 gap-1 text-center">
          <span className="border-b border-black h-3">Last Name</span>
          <span className="border-b border-black h-3">First Name</span>
          <span className="border-b border-black h-3">Middle Name</span>
        </div>
        <div>
          <label>Date of Birth:</label>
          <span className="border-b border-black ml-1 inline-block w-16"></span>
        </div>
        <div className="flex justify-between">
          <span>
            Sex:{" "}
            <span className="border-b border-black w-8 inline-block"></span>
          </span>
          <span>
            Contact No:{" "}
            <span className="border-b border-black w-16 inline-block"></span>
          </span>
        </div>
        <div className="col-span-2">
          Address:{" "}
          <span className="border-b border-black w-[80%] inline-block"></span>
        </div>
        <div className="col-span-2">
          Physician:{" "}
          <span className="border-b border-black w-[80%] inline-block"></span>
        </div>
      </div>

      {/* Request Categories */}
      <div className="grid grid-cols-2 gap-2 border border-black p-1">
        {/* Left column */}
        <div>
          <div className="font-bold text-[9px]">Hematology</div>
          <div>
            <input type="checkbox" /> CBC
          </div>
          <div>
            <input type="checkbox" /> CBC with APC
          </div>
          <div>
            <input type="checkbox" /> Platelet Count
          </div>
          <div>
            <input type="checkbox" /> Blood Typing
          </div>
          <div>
            <input type="checkbox" /> ESR
          </div>

          <div className="font-bold text-[9px] mt-1">Clinical Microscopy</div>
          <div>
            <input type="checkbox" /> Urinalysis
          </div>
          <div>
            <input type="checkbox" /> Pregnancy Test
          </div>
          <div>
            <input type="checkbox" /> Fecalysis
          </div>
          <div>
            <input type="checkbox" /> Occult Blood
          </div>

          <div className="font-bold text-[9px] mt-1">Serology</div>
          <div>
            <input type="checkbox" /> Dengue Duo
          </div>
          <div>
            <input type="checkbox" /> HBsAg Screening
          </div>
          <div>
            <input type="checkbox" /> VDRL/RPR
          </div>
          <div>
            <input type="checkbox" /> HIV Screening
          </div>
        </div>

        {/* Right column */}
        <div>
          <div className="font-bold text-[9px]">Clinical Chemistry</div>
          <div>
            <input type="checkbox" /> FBS/RBS
          </div>
          <div>
            <input type="checkbox" /> SGOT/AST
          </div>
          <div>
            <input type="checkbox" /> SGPT/ALT
          </div>
          <div>
            <input type="checkbox" /> Lipid Profile
          </div>
          <div>
            <input type="checkbox" /> Cholesterol
          </div>
          <div>
            <input type="checkbox" /> Triglycerides
          </div>
          <div>
            <input type="checkbox" /> HDL/LDL
          </div>
          <div>
            <input type="checkbox" /> Creatinine
          </div>
          <div>
            <input type="checkbox" /> BUN
          </div>
          <div>
            <input type="checkbox" /> Uric Acid
          </div>
          <div>
            <input type="checkbox" /> Sodium (Na)
          </div>
          <div>
            <input type="checkbox" /> Potassium (K)
          </div>
          <div>
            <input type="checkbox" /> Ionized Calcium (iCa)
          </div>
          <div>
            <input type="checkbox" /> Bilirubin
          </div>
          <div>
            <input type="checkbox" /> HbA1c
          </div>

          <div className="mt-1">
            Others:{" "}
            <span className="border-b border-black w-24 inline-block"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
