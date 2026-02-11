export interface Project {
    id: string;
    title: string;
    description: string;
    fieldId: string;
    specializationId?: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    requiredSkills: string[];
    planAccess: "free" | "pro" | "premium";
    industryRelevance: string;
    toolsRequired: string[];
    estimatedTime: string;
    resumeStrength: number;
    careerImpact: "high" | "medium" | "low";
    createdAt: string;
}

export type UserPlan = "free" | "pro" | "premium";

export interface ProjectFilter {
    fieldId?: string;
    planAccess?: UserPlan[];
}
