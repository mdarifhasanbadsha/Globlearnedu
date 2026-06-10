import { z } from "zod";

export const step1Schema = z.object({
  scholarshipType: z.enum(["csc", "university", "provincial", "self_sponsored"]),
  programLevel: z.enum(["bachelor", "master", "phd", "language", "diploma", "foundation", "short_course", "mbbs"]),
  selectedUniversities: z
    .array(
      z.object({
        universityId: z.string().uuid(),
        universityName: z.string(),
        programName: z.string(),
      })
    )
    .min(1)
    .max(5),
});

export const step2Schema = z.object({
  passportSurname: z.string().min(1).max(100),
  passportGivenName: z.string().min(1).max(100),
  dateOfBirth: z.string().min(1),
  gender: z.enum(["male", "female", "prefer_not_to_say"]),
  nationality: z.string().min(1),
  passportNumber: z.string().min(1).max(50),
  passportExpiry: z.string().min(1),
  religion: z.string().optional(),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
});

export const step3Schema = z.object({
  phone: z.string().min(7).max(30),
  email: z.string().email(),
  addressDetailed: z.string().min(1),
  addressCity: z.string().min(1),
  addressPostcode: z.string().optional(),
  addressCountry: z.string().min(1),
  emergencyContactName: z.string().min(1),
  emergencyContactPhone: z.string().min(7),
  emergencyContactRelationship: z.string().min(1),
});

export const step4Schema = z.object({
  parentInfo: z.object({
    fatherName: z.string().optional(),
    fatherOccupation: z.string().optional(),
    fatherPhone: z.string().optional(),
    motherName: z.string().optional(),
    motherOccupation: z.string().optional(),
    motherPhone: z.string().optional(),
  }),
  sponsorInfo: z.object({
    isSameAsParent: z.boolean(),
    sponsorName: z.string().optional(),
    sponsorRelationship: z.string().optional(),
    sponsorOccupation: z.string().optional(),
    sponsorPhone: z.string().optional(),
    annualIncomeRange: z.string().optional(),
  }),
});

export const step5Schema = z.object({
  academicHistory: z
    .array(
      z.object({
        institution: z.string().min(1),
        qualification: z.string().min(1),
        fieldOfStudy: z.string().min(1),
        country: z.string().min(1),
        startYear: z.number().int(),
        endYear: z.number().int(),
        grade: z.string().min(1),
      })
    )
    .min(1)
    .max(3),
  workExperience: z
    .array(
      z.object({
        employer: z.string(),
        jobTitle: z.string(),
        country: z.string(),
        startDate: z.string(),
        endDate: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
});

export const step6Schema = z.object({
  englishProficiency: z.object({
    testType: z.enum(["ielts", "toefl", "duolingo", "pte", "efset", "cambridge", "moi", "none"]),
    score: z.string().optional(),
    testDate: z.string().optional(),
    institution: z.string().optional(),
  }),
  chineseProficiency: z.object({
    hasHSK: z.boolean(),
    hskLevel: z.number().int().min(1).max(6).optional(),
    hskScore: z.string().optional(),
    hasHSKK: z.boolean().optional(),
    hskkLevel: z.string().optional(),
  }),
});

export const step7Schema = z.object({
  isCurrentlyInChina: z.boolean(),
  chinaStatus: z
    .object({
      visaType: z.string().optional(),
      visaEntryDate: z.string().optional(),
      visaExpiryDate: z.string().optional(),
      currentUniversity: z.string().optional(),
      currentAddress: z.string().optional(),
      acknowledgement: z.boolean().optional(),
    })
    .optional(),
});
