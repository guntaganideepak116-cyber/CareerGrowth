
export interface Certification {
    id: string;
    title: string;
    provider: string;
    description: string;
    fieldId: string;
    specializationId?: string;
    level: "beginner" | "intermediate" | "advanced";
    planAccess: "free" | "pro" | "premium";
    officialLink: string;
    industryRecognitionLevel: "high" | "medium" | "low";
    validity: string;
    skillsCovered: string[];
    createdAt: string;

    // Additional fields from original data to keep UI working if needed (mapped)
    valueScore?: number;
    timeToComplete?: string;
    cost?: string;
    rolesUnlocked?: string[];
    salaryRange?: string;
    logoUrl?: string;
    duration?: string;
    salaryImpact?: string;
    certificationType?: string;
    eligibility?: string;
}

export type UserPlan = "free" | "pro" | "premium";

export interface CertificationFilter {
    fieldId?: string;
    planAccess?: UserPlan[];
}
