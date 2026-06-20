require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Test = require('../models/Test');

const tests = [
  // HEMATOLOGY
  { testCode: 'H033', testName: 'Hb (Hemoglobin)', category: 'Hematology', sampleType: 'Blood', mrp: 100, isFeatured: false },
  { testCode: 'H059', testName: 'TLC (Total Leucocyte Count)', category: 'Hematology', sampleType: 'Blood', mrp: 180, isFeatured: false },
  { testCode: 'H026', testName: 'Differential Leucocyte Count (DLC)', category: 'Hematology', sampleType: 'Blood', mrp: 180, isFeatured: false },
  { testCode: 'H054', testName: 'TLC + DLC', category: 'Hematology', sampleType: 'Blood', mrp: 180, isFeatured: false },
  { testCode: 'H028', testName: 'ESR (Erythrocyte Sedimentation Rate)', category: 'Hematology', sampleType: 'Blood', mrp: 100, isFeatured: false },
  { testCode: 'H023', testName: 'Complete Blood Count (CBC)', category: 'Hematology', sampleType: 'Blood', mrp: 400, isFeatured: true },
  { testCode: 'P330', testName: 'Haemogram (CBC + ESR)', category: 'Hematology', sampleType: 'Blood', mrp: 400, isFeatured: false },
  { testCode: 'P1196', testName: 'Complete Blood Count with Peripheral Smear', category: 'Hematology', sampleType: 'Blood', mrp: 450, isFeatured: false },
  { testCode: 'H046', testName: 'Platelet Count', category: 'Hematology', sampleType: 'Blood', mrp: 150, isFeatured: false },
  { testCode: 'H016', testName: 'Peripheral Blood Smear (PBS/PBF)', category: 'Hematology', sampleType: 'Blood', mrp: 300, isFeatured: false },
  { testCode: 'H056', testName: 'Absolute Eosinophil Count (AEC)', category: 'Hematology', sampleType: 'Blood', mrp: 180, isFeatured: false },
  { testCode: 'H015', testName: 'Blood Group (ABO Group & Rh Type)', category: 'Hematology', sampleType: 'Blood', mrp: 100, isFeatured: false },
  { testCode: 'H049', testName: 'PT (Prothrombin Time)', category: 'Hematology', sampleType: 'Plasma', mrp: 300, isFeatured: false },
  { testCode: 'H010', testName: 'APTT (Activated Partial Thromboplastin Time)', category: 'Hematology', sampleType: 'Other', mrp: 500, isFeatured: false },
  { testCode: 'H060', testName: 'Hb HPLC / Electrophoresis', category: 'Hematology', sampleType: 'Blood', mrp: 800, isFeatured: false },
  { testCode: 'H035-FC', testName: 'HLA B-27 by Flow Cytometry', category: 'Hematology', sampleType: 'Blood', mrp: 2000, isFeatured: false },
  { testCode: 'H035-PCR', testName: 'HLA B-27 by PCR', category: 'Hematology', sampleType: 'Blood', mrp: 2000, isFeatured: false },

  // BIOCHEMISTRY
  { testCode: 'C257', testName: 'GCT (Glucose Challenge Test)', category: 'Biochemistry', sampleType: 'Plasma', mrp: 100, isFeatured: false },
  { testCode: 'C101', testName: 'Glucose Fasting', category: 'Biochemistry', sampleType: 'Plasma', mrp: 100, isFeatured: true },
  { testCode: 'C103', testName: 'Glucose Post Prandial', category: 'Biochemistry', sampleType: 'Plasma', mrp: 100, isFeatured: false },
  { testCode: 'C102', testName: 'Glucose Random', category: 'Biochemistry', sampleType: 'Plasma', mrp: 100, isFeatured: false },
  { testCode: 'C062', testName: 'Cholesterol Total', category: 'Biochemistry', sampleType: 'Serum', mrp: 150, isFeatured: false },
  { testCode: 'C172', testName: 'Triglyceride', category: 'Biochemistry', sampleType: 'Serum', mrp: 230, isFeatured: false },
  { testCode: 'C063', testName: 'Cholesterol HDL (Direct)', category: 'Biochemistry', sampleType: 'Serum', mrp: 200, isFeatured: false },
  { testCode: 'C064', testName: 'Cholesterol LDL (Direct)', category: 'Biochemistry', sampleType: 'Serum', mrp: 200, isFeatured: false },
  { testCode: 'C079', testName: 'Creatinine', category: 'Biochemistry', sampleType: 'Serum', mrp: 150, isFeatured: false },
  { testCode: 'C177', testName: 'Urea', category: 'Biochemistry', sampleType: 'Serum', mrp: 150, isFeatured: false },
  { testCode: 'C048', testName: 'Blood Urea Nitrogen (BUN)', category: 'Biochemistry', sampleType: 'Serum', mrp: 150, isFeatured: false },
  { testCode: 'C178', testName: 'Uric Acid', category: 'Biochemistry', sampleType: 'Serum', mrp: 200, isFeatured: false },
  { testCode: 'C054', testName: 'Calcium', category: 'Biochemistry', sampleType: 'Serum', mrp: 200, isFeatured: false },
  { testCode: 'C144', testName: 'Phosphorus Inorganic', category: 'Biochemistry', sampleType: 'Serum', mrp: 150, isFeatured: false },
  { testCode: 'C162', testName: 'Sodium', category: 'Biochemistry', sampleType: 'Serum', mrp: 200, isFeatured: false },
  { testCode: 'C059', testName: 'Chloride', category: 'Biochemistry', sampleType: 'Serum', mrp: 200, isFeatured: false },
  { testCode: 'C146', testName: 'Potassium', category: 'Biochemistry', sampleType: 'Serum', mrp: 200, isFeatured: false },
  { testCode: 'P39', testName: 'Electrolyte Panel (Sodium, Potassium, Chloride)', category: 'Biochemistry', sampleType: 'Serum', mrp: 600, isFeatured: false },
  { testCode: 'C208', testName: 'eGFR (Estimated Glomerular Filtration Rate)', category: 'Biochemistry', sampleType: 'Serum', mrp: 600, isFeatured: false },
  { testCode: 'C046', testName: 'Bilirubin Total', category: 'Biochemistry', sampleType: 'Serum', mrp: 150, isFeatured: false },
  { testCode: 'C045', testName: 'Bilirubin Direct', category: 'Biochemistry', sampleType: 'Serum', mrp: 150, isFeatured: false },
  { testCode: 'C047', testName: 'Bilirubin (Total, Direct, Indirect)', category: 'Biochemistry', sampleType: 'Serum', mrp: 400, isFeatured: false },
  { testCode: 'C037', testName: 'SGOT / AST (Aspartate Aminotransferase)', category: 'Biochemistry', sampleType: 'Serum', mrp: 150, isFeatured: false },
  { testCode: 'C018', testName: 'Alkaline Phosphatase (ALP)', category: 'Biochemistry', sampleType: 'Serum', mrp: 150, isFeatured: false },
  { testCode: 'C157', testName: 'Protein Total', category: 'Biochemistry', sampleType: 'Serum', mrp: 300, isFeatured: false },
  { testCode: 'C012', testName: 'Albumin', category: 'Biochemistry', sampleType: 'Serum', mrp: 150, isFeatured: false },
  { testCode: 'C158', testName: 'Protein / Albumin', category: 'Biochemistry', sampleType: 'Serum', mrp: 300, isFeatured: false },
  { testCode: 'C099', testName: 'GGT (Gamma Glutamyl Transferase)', category: 'Biochemistry', sampleType: 'Serum', mrp: 250, isFeatured: false },
  { testCode: 'C027', testName: 'Amylase', category: 'Biochemistry', sampleType: 'Serum', mrp: 600, isFeatured: false },
  { testCode: 'C128', testName: 'Lipase', category: 'Biochemistry', sampleType: 'Serum', mrp: 600, isFeatured: false },
  { testCode: 'P64', testName: 'Lipid Profile', category: 'Biochemistry', sampleType: 'Serum', mrp: 600, isFeatured: true },
  { testCode: 'P66', testName: 'Liver Function Test (LFT)', category: 'Biochemistry', sampleType: 'Serum', mrp: 700, isFeatured: true },
  { testCode: 'P60', testName: 'Kidney Function Test (KFT)', category: 'Biochemistry', sampleType: 'Serum', mrp: 700, isFeatured: true },
  { testCode: 'C077', testName: 'CRP (C-Reactive Protein) Quantitative', category: 'Biochemistry', sampleType: 'Serum', mrp: 500, isFeatured: false },
  { testCode: 'C1377', testName: 'C-Reactive Protein Qualitative', category: 'Biochemistry', sampleType: 'Serum', mrp: 450, isFeatured: false },
  { testCode: 'C107', testName: 'HbA1c (Glycosylated Hemoglobin)', category: 'Biochemistry', sampleType: 'Blood', mrp: 600, isFeatured: true },
  { testCode: 'P110', testName: 'Iron Studies (Iron, TIBC, Saturation Index)', category: 'Biochemistry', sampleType: 'Serum', mrp: 600, isFeatured: false },
  { testCode: 'P59', testName: 'Iron Profile (Iron Studies with Ferritin)', category: 'Biochemistry', sampleType: 'Serum', mrp: 850, isFeatured: false },
  { testCode: 'C175', testName: 'Troponin I', category: 'Biochemistry', sampleType: 'Serum', mrp: 1650, isFeatured: false },
  { testCode: 'C209', testName: 'Troponin T', category: 'Biochemistry', sampleType: 'Serum', mrp: 1650, isFeatured: false },

  // HORMONES
  { testCode: 'P91', testName: 'Thyroid Profile Total (T3, T4, TSH)', category: 'Hormones', sampleType: 'Serum', mrp: 650, isFeatured: true },
  { testCode: 'P92', testName: 'Thyroid Profile Free (FT3, FT4, TSH)', category: 'Hormones', sampleType: 'Serum', mrp: 700, isFeatured: false },
  { testCode: 'C168', testName: 'TSH (Thyroid Stimulating Hormone)', category: 'Hormones', sampleType: 'Serum', mrp: 300, isFeatured: false },
  { testCode: 'C150', testName: 'Prolactin', category: 'Hormones', sampleType: 'Serum', mrp: 450, isFeatured: false },
  { testCode: 'C131', testName: 'LH (Luteinising Hormone)', category: 'Hormones', sampleType: 'Serum', mrp: 450, isFeatured: false },
  { testCode: 'C098', testName: 'FSH (Follicle Stimulating Hormone)', category: 'Hormones', sampleType: 'Serum', mrp: 400, isFeatured: false },
  { testCode: 'C089', testName: 'Estradiol (E2)', category: 'Hormones', sampleType: 'Serum', mrp: 600, isFeatured: false },
  { testCode: 'C166', testName: 'Testosterone Total', category: 'Hormones', sampleType: 'Serum', mrp: 700, isFeatured: false },
  { testCode: 'C152', testName: 'PSA Total (Prostate Specific Antigen)', category: 'Hormones', sampleType: 'Serum', mrp: 650, isFeatured: false },
  { testCode: 'C041', testName: 'Beta HCG Total', category: 'Hormones', sampleType: 'Serum', mrp: 700, isFeatured: false },
  { testCode: 'P99', testName: 'Triple Marker Test (AFP, HCG, Estriol)', category: 'Hormones', sampleType: 'Serum', mrp: 2200, isFeatured: false },
  { testCode: 'P85', testName: 'Quadruple Marker Test', category: 'Hormones', sampleType: 'Serum', mrp: 3000, isFeatured: false },
  { testCode: 'P38', testName: 'Double Marker Test (PAPP-A & Free B-HCG)', category: 'Hormones', sampleType: 'Serum', mrp: 2000, isFeatured: false },
  { testCode: 'S110', testName: 'AMH (Anti Mullerian Hormone)', category: 'Hormones', sampleType: 'Serum', mrp: 1500, isFeatured: false },
  { testCode: 'AB031', testName: 'Anti Thyroglobulin (ATG)', category: 'Hormones', sampleType: 'Serum', mrp: 1200, isFeatured: false },

  // VITAMINS
  { testCode: 'C189', testName: 'Vitamin D (25-OH)', category: 'Vitamins', sampleType: 'Serum', mrp: 1200, isFeatured: true },
  { testCode: 'C180', testName: 'Vitamin B12', category: 'Vitamins', sampleType: 'Serum', mrp: 850, isFeatured: true },

  // INFECTION
  { testCode: 'H038', testName: 'Malaria Parasite Antigen', category: 'Infection', sampleType: 'Blood', mrp: 400, isFeatured: false },
  { testCode: 'H039', testName: 'Malaria Parasite Smear', category: 'Infection', sampleType: 'Blood', mrp: 150, isFeatured: false },
  { testCode: 'M031', testName: 'Microfilaria Smear', category: 'Infection', sampleType: 'Blood', mrp: 550, isFeatured: false },
  { testCode: 'S055', testName: 'Microfilaria Antigen', category: 'Infection', sampleType: 'Blood', mrp: 1050, isFeatured: false },
  { testCode: 'S111', testName: 'Typhi IgM', category: 'Infection', sampleType: 'Serum', mrp: 650, isFeatured: false },
  { testCode: 'S117', testName: 'Typhi IgG', category: 'Infection', sampleType: 'Serum', mrp: 650, isFeatured: false },
  { testCode: 'S070', testName: 'Widal Test', category: 'Infection', sampleType: 'Serum', mrp: 150, isFeatured: false },
  { testCode: 'P1032', testName: 'Dengue Combo Screen (NS1, IgM, IgG)', category: 'Infection', sampleType: 'Serum', mrp: 1200, isFeatured: true },
  { testCode: 'S236', testName: 'Hepatitis B Surface Antigen (HBsAg) Rapid', category: 'Infection', sampleType: 'Serum', mrp: 450, isFeatured: false },
  { testCode: 'S235', testName: 'Hepatitis C Antibodies Rapid', category: 'Infection', sampleType: 'Serum', mrp: 700, isFeatured: false },
  { testCode: 'S237', testName: 'HIV Detection Rapid', category: 'Infection', sampleType: 'Serum', mrp: 450, isFeatured: false },
  { testCode: 'P514', testName: 'HIV, HBsAg, HCV Panel', category: 'Infection', sampleType: 'Serum', mrp: 1000, isFeatured: false },
  { testCode: 'S113', testName: 'Chikungunya Virus Ab IgM', category: 'Infection', sampleType: 'Serum', mrp: 700, isFeatured: false },
  { testCode: 'S112', testName: 'TB-Gamma Interferon (QuantiFERON)', category: 'Infection', sampleType: 'Blood', mrp: 2000, isFeatured: false },
  { testCode: 'P001', testName: 'Hepatitis B Virus Viral Load (Quantitative)', category: 'Infection', sampleType: 'Blood', mrp: 3500, isFeatured: false },

  // SEROLOGY
  { testCode: 'S059', testName: 'Rheumatoid Factor (RA Factor) Quantitative', category: 'Serology', sampleType: 'Serum', mrp: 600, isFeatured: false },
  { testCode: 'C1378', testName: 'Rheumatoid Factor Qualitative', category: 'Serology', sampleType: 'Serum', mrp: 550, isFeatured: false },
  { testCode: 'C228', testName: 'Anti Streptolysin O (ASLO) Qualitative', category: 'Serology', sampleType: 'Serum', mrp: 550, isFeatured: false },
  { testCode: 'S131', testName: 'VDRL (RPR)', category: 'Serology', sampleType: 'Serum', mrp: 250, isFeatured: false },
  { testCode: 'P93', testName: 'TORCH Panel IgG & IgM (10 Parameter)', category: 'Serology', sampleType: 'Serum', mrp: 2000, isFeatured: false },
  { testCode: 'P98', testName: 'TORCH Panel IgG & IgM (8 Parameter)', category: 'Serology', sampleType: 'Serum', mrp: 2000, isFeatured: false },
  { testCode: 'AB003', testName: 'Anti CCP', category: 'Serology', sampleType: 'Serum', mrp: 1000, isFeatured: false },
  { testCode: 'S043', testName: 'Herpes Simplex Virus 1 & 2 IgM', category: 'Serology', sampleType: 'Serum', mrp: 1000, isFeatured: false },
  { testCode: 'S044', testName: 'Herpes Simplex Virus 1 & 2 IgG', category: 'Serology', sampleType: 'Serum', mrp: 1000, isFeatured: false },
  { testCode: 'S103', testName: 'Tissue Transglutaminase Antibody IgA', category: 'Serology', sampleType: 'Serum', mrp: 1100, isFeatured: false },

  // ONCOLOGY
  { testCode: 'C049', testName: 'CA 125 Cancer Marker', category: 'Oncology', sampleType: 'Serum', mrp: 800, isFeatured: false },
  { testCode: 'C051', testName: 'CA 19.9 Cancer Marker', category: 'Oncology', sampleType: 'Serum', mrp: 1100, isFeatured: false },
  { testCode: 'C057', testName: 'CEA (Carcinoembryonic Antigen)', category: 'Oncology', sampleType: 'Serum', mrp: 800, isFeatured: false },
  { testCode: 'A076', testName: 'Pap Test by Liquid Based Cytology', category: 'Oncology', sampleType: 'Other', mrp: 1000, isFeatured: false },

  // URINE
  { testCode: 'H001', testName: 'Urine Routine Examination', category: 'Urine', sampleType: 'Urine', mrp: 150, isFeatured: false },
  { testCode: 'C148', testName: 'Urine Pregnancy Test', category: 'Urine', sampleType: 'Urine', mrp: 200, isFeatured: false },
  { testCode: 'H198', testName: 'Urine Ketone', category: 'Urine', sampleType: 'Urine', mrp: 200, isFeatured: false },
  { testCode: 'C517', testName: 'Bile Salts & Pigments', category: 'Urine', sampleType: 'Urine', mrp: 200, isFeatured: false },

  // STOOL
  { testCode: 'H501', testName: 'Stool for Reducing Substances', category: 'Stool', sampleType: 'Stool', mrp: 200, isFeatured: false },
  { testCode: 'H004', testName: 'Stool Occult Blood', category: 'Stool', sampleType: 'Stool', mrp: 200, isFeatured: false },
  { testCode: 'H003', testName: 'Stool Routine Examination', category: 'Stool', sampleType: 'Stool', mrp: 200, isFeatured: false },

  // MICROBIOLOGY
  { testCode: 'M033', testName: 'AFB (Acid Fast Bacilli) Stain', category: 'Microbiology', sampleType: 'Other', mrp: 190, isFeatured: false },
  { testCode: 'M013', testName: 'Culture (Aerobic) & Susceptibility - Urine', category: 'Microbiology', sampleType: 'Urine', mrp: 350, isFeatured: false },
  { testCode: 'M014', testName: 'Culture Blood (Aerobic)', category: 'Microbiology', sampleType: 'Blood', mrp: 1000, isFeatured: false },
  { testCode: 'P015', testName: 'MTB-DNA PCR (Qualitative)', category: 'Microbiology', sampleType: 'Other', mrp: 1800, isFeatured: false },

  // OTHER
  { testCode: 'H002', testName: 'Mantoux Skin Test', category: 'Other', sampleType: 'Other', mrp: 300, isFeatured: false },
  { testCode: 'H005', testName: 'Semen Analysis', category: 'Other', sampleType: 'Other', mrp: 400, isFeatured: false },
  { testCode: 'C096', testName: 'Fluid Analysis (Routine, Excluding CSF)', category: 'Other', sampleType: 'Other', mrp: 400, isFeatured: false },
  { testCode: 'A079', testName: 'Histopathology Biopsy (Small Specimen)', category: 'Other', sampleType: 'Other', mrp: 600, isFeatured: false },
  { testCode: 'A082', testName: 'Histopathology Biopsy (Medium Specimen)', category: 'Other', sampleType: 'Other', mrp: 1000, isFeatured: false },
  { testCode: 'A085', testName: 'Histopathology Biopsy (Large Specimen)', category: 'Other', sampleType: 'Other', mrp: 1500, isFeatured: false },
  { testCode: 'R001', testName: 'Chromosome Analysis - Blood', category: 'Other', sampleType: 'Blood', mrp: 3000, isFeatured: false },
];

async function seedTests() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  let created = 0;
  let skipped = 0;

  for (const test of tests) {
    const exists = await Test.findOne({ testCode: test.testCode });
    if (!exists) {
      await Test.create(test);
      created++;
    } else {
      skipped++;
    }
  }

  console.log(`✅ Tests seeded: ${created} created, ${skipped} already existed`);
  await mongoose.disconnect();
}

seedTests().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
