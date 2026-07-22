// Lab Tests Database - Categorized by health check type
window.testsDatabase = {
    "Full Body Checkup": [
        { name: "Complete Health Package - Basic", testsCount: 50, price: 999, originalPrice: 2498, discount: 60, icon: "fas fa-user" },
        { name: "Complete Health Package - Advanced", testsCount: 70, price: 1499, originalPrice: 3748, discount: 60, icon: "fas fa-user" },
        { name: "Complete Health Package - Premium", testsCount: 90, price: 1999, originalPrice: 4998, discount: 60, icon: "fas fa-user" },
        { name: "Executive Health Checkup", testsCount: 85, price: 2499, originalPrice: 6248, discount: 60, icon: "fas fa-briefcase" },
        { name: "Comprehensive Full Body Checkup", testsCount: 65, price: 1799, originalPrice: 4498, discount: 60, icon: "fas fa-stethoscope" },
        { name: "Master Health Checkup", testsCount: 75, price: 2199, originalPrice: 5498, discount: 60, icon: "fas fa-heartbeat" },
        { name: "Basic Full Body Checkup", testsCount: 45, price: 899, originalPrice: 2248, discount: 60, icon: "fas fa-clipboard-check" }
    ],
    "Diabetes": [
        { name: "HbA1c Test (Hemoglobin A1c)", testsCount: 3, price: 629, originalPrice: 1572, discount: 60, icon: "fas fa-tint" },
        { name: "FBS (Fasting Blood Sugar) Test", testsCount: 1, price: 100, originalPrice: 250, discount: 60, icon: "fas fa-tint" },
        { name: "PPBS (Post Prandial Blood Sugar) Test", testsCount: 1, price: 100, originalPrice: 250, discount: 60, icon: "fas fa-tint" },
        { name: "Diabetes Profile - Basic", testsCount: 5, price: 799, originalPrice: 1998, discount: 60, icon: "fas fa-vial" },
        { name: "Diabetes Profile - Comprehensive", testsCount: 8, price: 1299, originalPrice: 3248, discount: 60, icon: "fas fa-vial" },
        { name: "Random Blood Sugar Test", testsCount: 1, price: 100, originalPrice: 250, discount: 60, icon: "fas fa-tint" },
        { name: "Glucose Tolerance Test (GTT)", testsCount: 4, price: 499, originalPrice: 1248, discount: 60, icon: "fas fa-flask" }
    ],
    "Women's Health": [
        { name: "Women's Health Package - Basic", testsCount: 25, price: 1299, originalPrice: 3248, discount: 60, icon: "fas fa-venus" },
        { name: "Women's Health Package - Advanced", testsCount: 40, price: 1999, originalPrice: 4998, discount: 60, icon: "fas fa-venus" },
        { name: "Pregnancy Profile", testsCount: 12, price: 899, originalPrice: 2248, discount: 60, icon: "fas fa-baby" },
        { name: "PCOS Profile", testsCount: 15, price: 1199, originalPrice: 2998, discount: 60, icon: "fas fa-venus-double" },
        { name: "Thyroid Profile for Women", testsCount: 5, price: 549, originalPrice: 1372, discount: 60, icon: "fas fa-seedling" },
        { name: "Bone Health Profile", testsCount: 8, price: 799, originalPrice: 1998, discount: 60, icon: "fas fa-bone" },
        { name: "Vitamin D & B12 Test", testsCount: 2, price: 899, originalPrice: 2248, discount: 60, icon: "fas fa-pills" }
    ],
    "Thyroid": [
        { name: "Thyroid Profile Test", testsCount: 3, price: 450, originalPrice: 1125, discount: 60, icon: "fas fa-seedling" },
        { name: "Thyroid Profile - Complete", testsCount: 5, price: 649, originalPrice: 1622, discount: 60, icon: "fas fa-seedling" },
        { name: "T3, T4, TSH Test", testsCount: 3, price: 450, originalPrice: 1125, discount: 60, icon: "fas fa-vial" },
        { name: "Thyroid Function Test", testsCount: 4, price: 549, originalPrice: 1372, discount: 60, icon: "fas fa-flask" },
        { name: "Free T3, Free T4, TSH Test", testsCount: 3, price: 549, originalPrice: 1372, discount: 60, icon: "fas fa-seedling" }
    ],
    "Vitamin": [
        { name: "Vitamin D Test", testsCount: 1, price: 749, originalPrice: 1872, discount: 60, icon: "fas fa-pills" },
        { name: "Vitamin B12 Test", testsCount: 1, price: 549, originalPrice: 1372, discount: 60, icon: "fas fa-pills" },
        { name: "Vitamin D & B12 Test", testsCount: 2, price: 899, originalPrice: 2248, discount: 60, icon: "fas fa-pills" },
        { name: "Complete Vitamin Profile", testsCount: 5, price: 1999, originalPrice: 4998, discount: 60, icon: "fas fa-capsules" },
        { name: "Vitamin D, B12, Folate Test", testsCount: 3, price: 1299, originalPrice: 3248, discount: 60, icon: "fas fa-pills" }
    ],
    "Blood Studies": [
        { name: "CBC Test (Complete Blood Count)", testsCount: 30, price: 398, originalPrice: 995, discount: 60, icon: "fas fa-vial" },
        { name: "Blood Group & Rh Factor", testsCount: 2, price: 199, originalPrice: 498, discount: 60, icon: "fas fa-tint" },
        { name: "ESR (Erythrocyte Sedimentation Rate)", testsCount: 1, price: 150, originalPrice: 375, discount: 60, icon: "fas fa-vial" },
        { name: "Blood Sugar (Random)", testsCount: 1, price: 100, originalPrice: 250, discount: 60, icon: "fas fa-tint" },
        { name: "Complete Hemogram", testsCount: 25, price: 449, originalPrice: 1122, discount: 60, icon: "fas fa-search" },
        { name: "Peripheral Blood Smear", testsCount: 1, price: 299, originalPrice: 748, discount: 60, icon: "fas fa-microscope" }
    ],
    "Heart": [
        { name: "Lipid Profile Test", testsCount: 8, price: 800, originalPrice: 2000, discount: 60, icon: "fas fa-heart" },
        { name: "Cardiac Risk Markers", testsCount: 5, price: 2499, originalPrice: 6248, discount: 60, icon: "fas fa-heartbeat" },
        { name: "Complete Cardiac Profile", testsCount: 12, price: 2999, originalPrice: 7498, discount: 60, icon: "fas fa-heart" },
        { name: "Cholesterol Test - Total", testsCount: 1, price: 250, originalPrice: 625, discount: 60, icon: "fas fa-heartbeat" },
        { name: "ECG (Electrocardiogram)", testsCount: 1, price: 299, originalPrice: 748, discount: 60, icon: "fas fa-wave-square" },
        { name: "Troponin Test", testsCount: 1, price: 899, originalPrice: 2248, discount: 60, icon: "fas fa-heart" }
    ],
    "Kidney": [
        { name: "Kidney Function Test (KFT)", testsCount: 8, price: 499, originalPrice: 1248, discount: 60, icon: "fas fa-stethoscope" },
        { name: "Creatinine Test", testsCount: 1, price: 200, originalPrice: 500, discount: 60, icon: "fas fa-vial" },
        { name: "Urea Test", testsCount: 1, price: 200, originalPrice: 500, discount: 60, icon: "fas fa-flask" },
        { name: "Complete Renal Function Test", testsCount: 12, price: 799, originalPrice: 1998, discount: 60, icon: "fas fa-stethoscope" },
        { name: "Urine Analysis", testsCount: 15, price: 299, originalPrice: 748, discount: 60, icon: "fas fa-vial" },
        { name: "Serum Creatinine & Urea", testsCount: 2, price: 399, originalPrice: 998, discount: 60, icon: "fas fa-flask" }
    ],
    "Liver": [
        { name: "Liver Function Test (LFT)", testsCount: 10, price: 550, originalPrice: 1375, discount: 60, icon: "fas fa-prescription-bottle" },
        { name: "SGOT/SGPT Test", testsCount: 2, price: 300, originalPrice: 750, discount: 60, icon: "fas fa-vial" },
        { name: "Bilirubin Test", testsCount: 3, price: 299, originalPrice: 748, discount: 60, icon: "fas fa-flask" },
        { name: "Complete Liver Profile", testsCount: 12, price: 799, originalPrice: 1998, discount: 60, icon: "fas fa-prescription-bottle" },
        { name: "Alkaline Phosphatase Test", testsCount: 1, price: 250, originalPrice: 625, discount: 60, icon: "fas fa-vial" }
    ],
    "Hairfall": [
        { name: "Hairfall Profile - Basic", testsCount: 5, price: 1499, originalPrice: 3748, discount: 60, icon: "fas fa-cut" },
        { name: "Hairfall Profile - Complete", testsCount: 8, price: 2499, originalPrice: 6248, discount: 60, icon: "fas fa-cut" },
        { name: "Ferritin Test (Hairfall)", testsCount: 1, price: 899, originalPrice: 2248, discount: 60, icon: "fas fa-vial" },
        { name: "Vitamin D & B12 (Hairfall)", testsCount: 2, price: 1299, originalPrice: 3248, discount: 60, icon: "fas fa-pills" },
        { name: "Thyroid Profile (Hairfall)", testsCount: 3, price: 549, originalPrice: 1372, discount: 60, icon: "fas fa-seedling" }
    ],
    "Fever": [
        { name: "Fever Profile - Basic", testsCount: 3, price: 499, originalPrice: 1248, discount: 60, icon: "fas fa-thermometer-half" },
        { name: "Fever Profile - Complete", testsCount: 8, price: 999, originalPrice: 2498, discount: 60, icon: "fas fa-thermometer-half" },
        { name: "CBC with ESR", testsCount: 31, price: 549, originalPrice: 1372, discount: 60, icon: "fas fa-vial" },
        { name: "Malaria Test", testsCount: 1, price: 299, originalPrice: 748, discount: 60, icon: "fas fa-vial" },
        { name: "Dengue Test", testsCount: 1, price: 599, originalPrice: 1498, discount: 60, icon: "fas fa-vial" },
        { name: "Typhoid Test", testsCount: 1, price: 299, originalPrice: 748, discount: 60, icon: "fas fa-flask" }
    ],
    "Senior Citizen": [
        { name: "Senior Citizen Health Package", testsCount: 60, price: 1999, originalPrice: 4998, discount: 60, icon: "fas fa-wheelchair" },
        { name: "Bone Health Profile", testsCount: 8, price: 799, originalPrice: 1998, discount: 60, icon: "fas fa-bone" },
        { name: "Cardiac Profile for Seniors", testsCount: 10, price: 1299, originalPrice: 3248, discount: 60, icon: "fas fa-heart" },
        { name: "Vitamin D & B12 (Senior)", testsCount: 2, price: 1299, originalPrice: 3248, discount: 60, icon: "fas fa-pills" },
        { name: "Complete Health Checkup (Senior)", testsCount: 75, price: 2499, originalPrice: 6248, discount: 60, icon: "fas fa-stethoscope" }
    ]
};

