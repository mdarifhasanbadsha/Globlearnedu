// ── Shared types for the 9-step application form ──────────────────────────────

export type UniversityChoice = {
  id: string;
  slug: string;
  nameEn: string;
  city: string;
  province: string;
  tier985: boolean;
  tier211: boolean;
  isPartner: boolean;
};

export type AcademicEntry = {
  institution: string;
  degree: string;
  field: string;
  country: string;
  startYear: string;
  endYear: string;
  grade: string;
};

export type WorkEntry = {
  employer: string;
  title: string;
  country: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type FormData = {
  // Step 1 — Program
  fundingType: string;
  degreeLevel: string;
  selectedUniversities: UniversityChoice[];
  universityMajors: Record<string, string>;    // keyed by university id
  interestMajors: string[];                    // additional interested fields
  // Step 2 — Personal
  surname: string;
  givenNames: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  gender: string;
  nationality: string;
  passportNumber: string;
  passportIssueDay: string;
  passportIssueMonth: string;
  passportIssueYear: string;
  passportExpiryDay: string;
  passportExpiryMonth: string;
  passportExpiryYear: string;
  religion: string;
  maritalStatus: string;
  // Step 3 — Contact
  whatsapp: string;
  email: string;
  address: string;
  addressCity: string;
  addressPostcode: string;
  residenceCountry: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  // Step 4 — Family
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  fatherEmail: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
  motherEmail: string;
  differentSponsor: boolean;
  sponsorName: string;
  sponsorRelationship: string;
  sponsorOccupation: string;
  sponsorPhone: string;
  sponsorIncome: string;
  // Step 5 — Academic
  academicHistory: AcademicEntry[];
  hasWorkExperience: boolean;
  workHistory: WorkEntry[];
  // Step 6 — Language
  englishTestType: string;
  englishScore: string;
  englishTestDate: string;
  hasChineseProficiency: boolean;
  hskLevel: string;
  hskScore: string;
  hskTestDate: string;
  hskkLevel: string;
  hskkScore: string;
  hskkTestDate: string;
  // Step 7 — China Status
  inChina: boolean;
  chinaVisaType: string;
  chinaVisaEntry: string;
  chinaVisaExpiry: string;
  chinaCurrentUniversity: string;
  chinaCurrentAddress: string;
  chinaAcknowledge: boolean;
  // Step 8 — Documents
  documents: Record<string, string>;
  // Step 9 — Review & Pay
  term1: boolean;
  term2: boolean;
  term3: boolean;
  term4: boolean;
  paymentMethod: "card" | "qr" | "bank";
  paymentProof: string;
};

export const EMPTY_ACADEMIC: AcademicEntry = {
  institution: "", degree: "", field: "",
  country: "", startYear: "", endYear: "", grade: "",
};

export const EMPTY_WORK: WorkEntry = {
  employer: "", title: "", country: "",
  startDate: "", endDate: "", description: "",
};

export const INITIAL_FORM: FormData = {
  fundingType: "", degreeLevel: "",
  selectedUniversities: [], universityMajors: {}, interestMajors: [],
  surname: "", givenNames: "",
  dobDay: "", dobMonth: "", dobYear: "",
  gender: "", nationality: "",
  passportNumber: "",
  passportIssueDay: "", passportIssueMonth: "", passportIssueYear: "",
  passportExpiryDay: "", passportExpiryMonth: "", passportExpiryYear: "",
  religion: "", maritalStatus: "",
  whatsapp: "", email: "", address: "",
  addressCity: "", addressPostcode: "", residenceCountry: "",
  emergencyName: "", emergencyPhone: "", emergencyRelationship: "",
  fatherName: "", fatherOccupation: "", fatherPhone: "", fatherEmail: "",
  motherName: "", motherOccupation: "", motherPhone: "", motherEmail: "",
  differentSponsor: false,
  sponsorName: "", sponsorRelationship: "",
  sponsorOccupation: "", sponsorPhone: "", sponsorIncome: "",
  academicHistory: [{ ...EMPTY_ACADEMIC }],
  hasWorkExperience: false, workHistory: [],
  englishTestType: "", englishScore: "", englishTestDate: "",
  hasChineseProficiency: false,
  hskLevel: "", hskScore: "", hskTestDate: "",
  hskkLevel: "", hskkScore: "", hskkTestDate: "",
  inChina: false,
  chinaVisaType: "", chinaVisaEntry: "", chinaVisaExpiry: "",
  chinaCurrentUniversity: "", chinaCurrentAddress: "", chinaAcknowledge: false,
  documents: {},
  term1: false, term2: false, term3: false, term4: false,
  paymentMethod: "card", paymentProof: "",
};

// ── Shared field style constants ───────────────────────────────────────────────

export const INPUT_CLS =
  "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/20 focus:border-[#1B3A6B] transition-colors";
export const LABEL_CLS = "block text-sm font-semibold text-gray-700 mb-1.5";
export const SELECT_CLS = INPUT_CLS;

// ── Countries list ─────────────────────────────────────────────────────────────

export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus",
  "Belgium", "Benin", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil",
  "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon",
  "Canada", "Chad", "Chile", "Colombia", "Congo", "Costa Rica",
  "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark",
  "DR Congo", "Ecuador", "Egypt", "Eritrea", "Ethiopia", "Finland", "France",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Guinea",
  "Honduras", "Hungary", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
  "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", "Liberia", "Libya", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Mauritania", "Mauritius", "Mexico",
  "Moldova", "Mongolia", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway",
  "Oman", "Pakistan", "Palestine", "Panama", "Peru", "Philippines",
  "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saudi Arabia", "Senegal", "Sierra Leone", "Singapore", "Somalia",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka",
  "Sudan", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania",
  "Thailand", "Togo", "Tunisia", "Turkey", "Turkmenistan", "Uganda",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];
