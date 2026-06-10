const icd10Collection = [
  {
    code: "J06.9",
    description: "Acute upper respiratory infection, unspecified",
    category: "Respiratory",
    keywords: ["cough", "colds", "uri", "ubo", "sipon"],
  },
  {
    code: "J18.9",
    description: "Pneumonia, unspecified organism",
    category: "Respiratory",
    keywords: ["pneumonia", "cough", "fever", "chest xray"],
  },
  {
    code: "J45.9",
    description: "Asthma, unspecified",
    category: "Respiratory",
    keywords: ["asthma", "wheezing", "hika"],
  },
  {
    code: "I10",
    description: "Essential hypertension",
    category: "Cardiovascular",
    keywords: ["hypertension", "high blood", "bp"],
  },
  {
    code: "E11.9",
    description: "Type 2 diabetes mellitus without complications",
    category: "Endocrine",
    keywords: ["diabetes", "dm", "sugar", "fbs", "hba1c"],
  },
  {
    code: "E78.5",
    description: "Hyperlipidemia, unspecified",
    category: "Endocrine",
    keywords: ["cholesterol", "lipid", "triglycerides"],
  },
  {
    code: "N39.0",
    description: "Urinary tract infection, site not specified",
    category: "Genitourinary",
    keywords: ["uti", "urine", "dysuria", "ihi"],
  },
  {
    code: "K29.7",
    description: "Gastritis, unspecified",
    category: "Digestive",
    keywords: ["gastritis", "epigastric", "stomach pain"],
  },
  {
    code: "A09",
    description: "Infectious gastroenteritis and colitis, unspecified",
    category: "Digestive",
    keywords: ["diarrhea", "lbm", "gastroenteritis"],
  },
  {
    code: "R50.9",
    description: "Fever, unspecified",
    category: "Symptoms",
    keywords: ["fever", "lagnat"],
  },
  {
    code: "R05",
    description: "Cough",
    category: "Symptoms",
    keywords: ["cough", "ubo"],
  },
  {
    code: "R51",
    description: "Headache",
    category: "Symptoms",
    keywords: ["headache", "migraine", "sakit ulo"],
  },
  {
    code: "R10.4",
    description: "Other and unspecified abdominal pain",
    category: "Symptoms",
    keywords: ["abdominal pain", "sakit tiyan"],
  },
  {
    code: "Z00.0",
    description: "General medical examination",
    category: "Preventive",
    keywords: ["checkup", "ape", "annual", "medical exam"],
  },
  {
    code: "Z02.7",
    description: "Issue of medical certificate",
    category: "Administrative",
    keywords: ["medical certificate", "med cert"],
  },
  {
    code: "J00",
    description: "Acute nasopharyngitis (common cold)",
    category: "Respiratory",
  },
  {
    code: "J02.9",
    description: "Acute pharyngitis, unspecified",
    category: "Respiratory",
  },
  {
    code: "J20.9",
    description: "Acute bronchitis, unspecified",
    category: "Respiratory",
  },
  {
    code: "J30.4",
    description: "Allergic rhinitis",
    category: "Respiratory",
  },
  {
    code: "J44.9",
    description: "Chronic obstructive pulmonary disease, unspecified",
    category: "Respiratory",
  },

  {
    code: "I11.9",
    description: "Hypertensive heart disease without heart failure",
    category: "Cardiovascular",
  },
  {
    code: "I25.9",
    description: "Chronic ischemic heart disease, unspecified",
    category: "Cardiovascular",
  },
  {
    code: "I63.9",
    description: "Cerebral infarction, unspecified",
    category: "Cardiovascular",
  },

  {
    code: "E10.9",
    description: "Type 1 diabetes mellitus without complications",
    category: "Endocrine",
  },
  {
    code: "E03.9",
    description: "Hypothyroidism, unspecified",
    category: "Endocrine",
  },
  {
    code: "E66.9",
    description: "Obesity, unspecified",
    category: "Endocrine",
  },

  {
    code: "N18.9",
    description: "Chronic kidney disease, unspecified",
    category: "Genitourinary",
  },
  {
    code: "N20.0",
    description: "Calculus of kidney",
    category: "Genitourinary",
  },
  {
    code: "N40",
    description: "Benign prostatic hyperplasia",
    category: "Genitourinary",
  },

  {
    code: "K21.9",
    description: "Gastro-esophageal reflux disease without esophagitis",
    category: "Digestive",
  },
  {
    code: "K52.9",
    description: "Noninfective gastroenteritis and colitis, unspecified",
    category: "Digestive",
  },
  {
    code: "K80.2",
    description: "Calculus of gallbladder without cholecystitis",
    category: "Digestive",
  },

  {
    code: "M54.5",
    description: "Low back pain",
    category: "Musculoskeletal",
  },
  {
    code: "M17.9",
    description: "Osteoarthritis of knee, unspecified",
    category: "Musculoskeletal",
  },
  {
    code: "M79.1",
    description: "Myalgia",
    category: "Musculoskeletal",
  },

  {
    code: "L20.9",
    description: "Atopic dermatitis, unspecified",
    category: "Dermatology",
  },
  {
    code: "L23.9",
    description: "Allergic contact dermatitis, unspecified",
    category: "Dermatology",
  },
  {
    code: "B35.9",
    description: "Dermatophytosis, unspecified",
    category: "Dermatology",
  },

  {
    code: "A90",
    description: "Dengue fever",
    category: "Infectious",
  },
  {
    code: "A91",
    description: "Dengue hemorrhagic fever",
    category: "Infectious",
  },
  {
    code: "A09",
    description: "Infectious gastroenteritis",
    category: "Infectious",
  },
  {
    code: "B34.9",
    description: "Viral infection, unspecified",
    category: "Infectious",
  },
  {
    code: "U07.1",
    description: "COVID-19, virus identified",
    category: "Infectious",
  },

  {
    code: "F41.9",
    description: "Anxiety disorder, unspecified",
    category: "Mental Health",
  },
  {
    code: "F32.9",
    description: "Depressive episode, unspecified",
    category: "Mental Health",
  },

  {
    code: "Z01.8",
    description: "Other specified special examinations",
    category: "Preventive",
  },
  {
    code: "Z02.1",
    description: "Pre-employment examination",
    category: "Preventive",
  },
  {
    code: "Z11.3",
    description: "Screening for sexually transmitted diseases",
    category: "Preventive",
  },
  {
    code: "Z13.1",
    description: "Screening for diabetes mellitus",
    category: "Preventive",
  },
  {
    code: "Z13.6",
    description: "Screening for cardiovascular disorders",
    category: "Preventive",
  },

  {
    code: "I20.9",
    description: "Angina pectoris, unspecified",
    category: "Cardiovascular",
  },
  {
    code: "I21.9",
    description: "Acute myocardial infarction, unspecified",
    category: "Cardiovascular",
  },
  {
    code: "I50.9",
    description: "Heart failure, unspecified",
    category: "Cardiovascular",
  },
  {
    code: "I69.4",
    description: "Sequelae of stroke",
    category: "Cardiovascular",
  },
  {
    code: "R07.9",
    description: "Chest pain, unspecified",
    category: "Symptoms",
  },

  {
    code: "E87.1",
    description: "Hyponatremia",
    category: "Endocrine",
  },
  {
    code: "E87.6",
    description: "Hypokalemia",
    category: "Endocrine",
  },
  {
    code: "D64.9",
    description: "Anemia, unspecified",
    category: "Hematology",
  },
  {
    code: "D50.9",
    description: "Iron deficiency anemia",
    category: "Hematology",
  },

  {
    code: "N17.9",
    description: "Acute kidney failure, unspecified",
    category: "Genitourinary",
  },
  {
    code: "N19",
    description: "Unspecified kidney failure",
    category: "Genitourinary",
  },
  {
    code: "N76.0",
    description: "Acute vaginitis",
    category: "Genitourinary",
  },
  {
    code: "N92.6",
    description: "Irregular menstruation",
    category: "Gynecology",
  },

  {
    code: "K30",
    description: "Functional dyspepsia",
    category: "Digestive",
  },
  {
    code: "K59.0",
    description: "Constipation",
    category: "Digestive",
  },
  {
    code: "K64.9",
    description: "Hemorrhoids, unspecified",
    category: "Digestive",
  },
  {
    code: "K76.0",
    description: "Fatty liver",
    category: "Digestive",
  },

  {
    code: "M25.5",
    description: "Pain in joint",
    category: "Musculoskeletal",
  },
  {
    code: "M10.9",
    description: "Gout, unspecified",
    category: "Musculoskeletal",
  },
  {
    code: "M54.2",
    description: "Cervicalgia",
    category: "Musculoskeletal",
  },
  {
    code: "M54.6",
    description: "Pain in thoracic spine",
    category: "Musculoskeletal",
  },

  {
    code: "G43.9",
    description: "Migraine, unspecified",
    category: "Neurology",
  },
  {
    code: "G44.2",
    description: "Tension-type headache",
    category: "Neurology",
  },
  {
    code: "G47.0",
    description: "Insomnia",
    category: "Neurology",
  },
  {
    code: "R42",
    description: "Dizziness and giddiness",
    category: "Neurology",
  },

  {
    code: "H10.9",
    description: "Conjunctivitis, unspecified",
    category: "Ophthalmology",
  },
  {
    code: "H52.4",
    description: "Presbyopia",
    category: "Ophthalmology",
  },
  {
    code: "H66.9",
    description: "Otitis media, unspecified",
    category: "ENT",
  },
  {
    code: "J34.2",
    description: "Deviated nasal septum",
    category: "ENT",
  },

  {
    code: "L02.9",
    description: "Cutaneous abscess, unspecified",
    category: "Dermatology",
  },
  {
    code: "L30.9",
    description: "Dermatitis, unspecified",
    category: "Dermatology",
  },
  {
    code: "B00.9",
    description: "Herpesviral infection, unspecified",
    category: "Dermatology",
  },
  {
    code: "B86",
    description: "Scabies",
    category: "Dermatology",
  },

  {
    code: "A15.9",
    description: "Respiratory tuberculosis, unspecified",
    category: "Infectious",
  },
  {
    code: "A01.0",
    description: "Typhoid fever",
    category: "Infectious",
  },
  {
    code: "B18.1",
    description: "Chronic viral hepatitis B",
    category: "Infectious",
  },
  {
    code: "B18.2",
    description: "Chronic viral hepatitis C",
    category: "Infectious",
  },
  {
    code: "Z00.1",
    description: "Routine child health examination",
    category: "Preventive",
  },
  {
    code: "Z01.4",
    description: "Gynecological examination",
    category: "Preventive",
  },
  {
    code: "Z12.5",
    description: "Screening for malignant neoplasm of prostate",
    category: "Preventive",
  },
  {
    code: "Z23",
    description: "Encounter for immunization",
    category: "Preventive",
  },
  {
    code: "Z71.3",
    description: "Dietary counseling and surveillance",
    category: "Preventive",
  },
  {
    code: "Z71.8",
    description: "Other specified counseling",
    category: "Preventive",
  },
  {
    code: "R53",
    description: "Malaise and fatigue",
    category: "Symptoms",
  },
  {
    code: "R11",
    description: "Nausea and vomiting",
    category: "Symptoms",
  },
  {
    code: "R63.5",
    description: "Abnormal weight gain",
    category: "Symptoms",
  },
  {
    code: "R63.4",
    description: "Abnormal weight loss",
    category: "Symptoms",
  },
  {
    code: "R06.0",
    description: "Dyspnea",
    category: "Symptoms",
  },

  {
    code: "J01.9",
    description: "Acute sinusitis, unspecified",
    category: "Respiratory",
  },
  {
    code: "J04.0",
    description: "Acute laryngitis",
    category: "Respiratory",
  },
  {
    code: "J32.9",
    description: "Chronic sinusitis, unspecified",
    category: "Respiratory",
  },
  {
    code: "J40",
    description: "Bronchitis, not specified as acute or chronic",
    category: "Respiratory",
  },
  {
    code: "J98.9",
    description: "Respiratory disorder, unspecified",
    category: "Respiratory",
  },

  {
    code: "I95.9",
    description: "Hypotension, unspecified",
    category: "Cardiovascular",
  },
  {
    code: "I48.9",
    description: "Atrial fibrillation and flutter, unspecified",
    category: "Cardiovascular",
  },
  {
    code: "I73.9",
    description: "Peripheral vascular disease, unspecified",
    category: "Cardiovascular",
  },
  {
    code: "R00.2",
    description: "Palpitations",
    category: "Cardiovascular",
  },
  {
    code: "R03.0",
    description:
      "Elevated blood-pressure reading without diagnosis of hypertension",
    category: "Cardiovascular",
  },

  {
    code: "E04.9",
    description: "Nontoxic goiter, unspecified",
    category: "Endocrine",
  },
  {
    code: "E16.2",
    description: "Hypoglycemia, unspecified",
    category: "Endocrine",
  },
  {
    code: "E79.0",
    description: "Hyperuricemia without signs of inflammatory arthritis",
    category: "Endocrine",
  },
  {
    code: "E55.9",
    description: "Vitamin D deficiency, unspecified",
    category: "Endocrine",
  },
  {
    code: "E53.8",
    description: "Other specified vitamin B deficiency",
    category: "Endocrine",
  },

  {
    code: "D72.8",
    description: "Other specified disorders of white blood cells",
    category: "Hematology",
  },
  {
    code: "D69.6",
    description: "Thrombocytopenia, unspecified",
    category: "Hematology",
  },
  {
    code: "D75.9",
    description: "Disease of blood and blood-forming organs, unspecified",
    category: "Hematology",
  },

  {
    code: "N30.0",
    description: "Acute cystitis",
    category: "Genitourinary",
  },
  {
    code: "N30.9",
    description: "Cystitis, unspecified",
    category: "Genitourinary",
  },
  {
    code: "N41.9",
    description: "Inflammatory disease of prostate, unspecified",
    category: "Genitourinary",
  },
  {
    code: "N48.9",
    description: "Disorder of penis, unspecified",
    category: "Genitourinary",
  },
  {
    code: "N94.6",
    description: "Dysmenorrhea",
    category: "Gynecology",
  },

  {
    code: "K25.9",
    description: "Gastric ulcer, unspecified",
    category: "Digestive",
  },
  {
    code: "K29.0",
    description: "Acute gastritis",
    category: "Digestive",
  },
  {
    code: "K58.9",
    description: "Irritable bowel syndrome without diarrhea",
    category: "Digestive",
  },
  {
    code: "K62.5",
    description: "Hemorrhage of anus and rectum",
    category: "Digestive",
  },
  {
    code: "R19.7",
    description: "Diarrhea, unspecified",
    category: "Digestive",
  },

  {
    code: "M13.9",
    description: "Arthritis, unspecified",
    category: "Musculoskeletal",
  },
  {
    code: "M25.4",
    description: "Effusion of joint",
    category: "Musculoskeletal",
  },
  {
    code: "M54.3",
    description: "Sciatica",
    category: "Musculoskeletal",
  },
  {
    code: "M62.8",
    description: "Other specified disorders of muscle",
    category: "Musculoskeletal",
  },
  {
    code: "M79.6",
    description: "Pain in limb",
    category: "Musculoskeletal",
  },

  {
    code: "G40.9",
    description: "Epilepsy, unspecified",
    category: "Neurology",
  },
  {
    code: "G51.0",
    description: "Bell's palsy",
    category: "Neurology",
  },
  {
    code: "R20.2",
    description: "Paresthesia of skin",
    category: "Neurology",
  },
  {
    code: "R55",
    description: "Syncope and collapse",
    category: "Neurology",
  },

  {
    code: "H25.9",
    description: "Senile cataract, unspecified",
    category: "Ophthalmology",
  },
  {
    code: "H40.9",
    description: "Glaucoma, unspecified",
    category: "Ophthalmology",
  },
  {
    code: "H57.9",
    description: "Disorder of eye and adnexa, unspecified",
    category: "Ophthalmology",
  },

  {
    code: "H61.2",
    description: "Impacted cerumen",
    category: "ENT",
  },
  {
    code: "J03.9",
    description: "Acute tonsillitis, unspecified",
    category: "ENT",
  },
  {
    code: "R07.0",
    description: "Pain in throat",
    category: "ENT",
  },

  {
    code: "L03.9",
    description: "Cellulitis, unspecified",
    category: "Dermatology",
  },
  {
    code: "L50.9",
    description: "Urticaria, unspecified",
    category: "Dermatology",
  },
  {
    code: "L70.0",
    description: "Acne vulgaris",
    category: "Dermatology",
  },

  {
    code: "A49.9",
    description: "Bacterial infection, unspecified",
    category: "Infectious",
  },
  {
    code: "B27.9",
    description: "Infectious mononucleosis, unspecified",
    category: "Infectious",
  },
  {
    code: "B37.9",
    description: "Candidiasis, unspecified",
    category: "Infectious",
  },

  {
    code: "F43.9",
    description: "Reaction to severe stress, unspecified",
    category: "Mental Health",
  },
  {
    code: "F51.0",
    description: "Nonorganic insomnia",
    category: "Mental Health",
  },

  {
    code: "Z00.6",
    description: "Examination for normal comparison and control",
    category: "Preventive",
  },
  {
    code: "Z51.8",
    description: "Other specified medical care",
    category: "Preventive",
  },
  {
    code: "Z76.0",
    description: "Issue of repeat prescription",
    category: "Administrative",
  },
];

export default icd10Collection;
