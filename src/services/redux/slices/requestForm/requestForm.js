import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  patient: {
    lastName: "",
    firstName: "",
    middleName: "",
    dob: "",
    sex: "",
    contact: "",
    address: "",
    physician: "",
  },
  tests: {
    Hematology: {
      CBC: false,
      "Platelet Count": false,
      "Blood Typing": false,
      ESR: false,
    },
    "Clinical Microscopy": {
      Urinalysis: false,
      "Pregnancy Test": false,
      Fecalysis: false,
      "Occult Blood": false,
    },
    Serology: {
      "Dengue Duo": false,
      "HBsAg Screening": false,
      "VDRL/RPR": false,
      "HIV Screening": false,
    },
    "Clinical Chemistry": {
      "FBS/RBS": false,
      SGOT: false,
      SGPT: false,
      "Lipid Profile": false,
      Cholesterol: false,
      Triglycerides: false,
      HDL: false,
      LDL: false,
      Creatinine: false,
      BUN: false,
      "Uric Acid": false,
      "Sodium (Na)": false,
      "Potassium (K)": false,
      "Calcium (Ca)": false,
      Bilirubin: false,
      HbA1c: false,
    },
    Others: "",
  },
};

const requestFormSlice = createSlice({
  name: "requestForm",
  initialState,
  reducers: {
    setPatientField: (state, { payload }) => {
      const { field, value } = payload;
      state.patient[field] = value;
    },
    toggleTest: (state, { payload }) => {
      const { section, test } = payload;
      state.tests[section][test] = !state.tests[section][test];
    },
    setOther: (state, { payload }) => {
      state.tests.Others = payload;
    },
    resetForm: () => initialState,
  },
});

export const { setPatientField, toggleTest, setOther, resetForm } =
  requestFormSlice.actions;

export default requestFormSlice.reducer;
