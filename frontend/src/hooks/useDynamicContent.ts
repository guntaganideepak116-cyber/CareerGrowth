import { useQuery } from '@tanstack/react-query';
import { generateContent, getCareerPaths } from '@/services/apiService';

interface ContentRequest {
  type: 'fields' | 'specializations' | 'career-paths' | 'roadmap' | 'certifications' | 'projects';
  fieldId?: string;
  specializationId?: string;
  userProfile?: {
    semester?: number;
    skills?: string[];
    careerGoal?: string;
  };
}

async function fetchDynamicContent<T>(request: ContentRequest): Promise<T> {
  return await generateContent<T>(request);
}

// Field type for dynamic fields
export interface DynamicField {
  id: string;
  name: string;
  iconName: string;
  description: string;
  demand: string;
  growth: string;
  color: string;
}

// Hook for fetching fields
export function useFields() {
  const { data: fields = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['dynamic_fields'],
    queryFn: () => fetchDynamicContent<DynamicField[]>({ type: 'fields' }),
    staleTime: 1000 * 60 * 30, // 30 mins
  });

  return { fields, loading, error: error ? (error as Error).message : null, refetch };
}

// Specialization type
export interface DynamicSpecialization {
  id: string;
  name: string;
  type: 'core' | 'emerging' | 'hybrid';
  growthPotential: 'high' | 'medium' | 'low';
  riskLevel: 'low' | 'medium' | 'high';
  marketDemand: number;
  description: string;
  skills: string[];
}

// Hook for fetching specializations
export function useSpecializations(fieldId: string | null) {
  const { data: specializations = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['dynamic_specializations', fieldId],
    queryFn: () => fetchDynamicContent<DynamicSpecialization[]>({
      type: 'specializations',
      fieldId: fieldId!,
    }),
    enabled: !!fieldId,
    staleTime: 1000 * 60 * 30,
  });

  return { specializations, loading, error: error ? (error as Error).message : null, refetch };
}

// Career path type
export interface DynamicCareerPath {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeToStability: string;
  riskScore: number;
  growthScope: 'high' | 'medium' | 'low';
  description: string;
  milestones: string[];
  avgSalary: string;
}

// Hook for fetching career paths
export function useCareerPaths(fieldId: string | null, specializationId: string | null) {
  const { data: careerPaths = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['dynamic_career_paths', fieldId, specializationId],
    queryFn: () => getCareerPaths({ fieldId: fieldId!, specializationId: specializationId || undefined }),
    enabled: !!fieldId,
    staleTime: 1000 * 60 * 30,
  });

  return { careerPaths, loading, error: error ? (error as Error).message : null, refetch };
}

// Roadmap phase type
export interface DynamicRoadmapPhase {
  id: number;
  title: string;
  duration: string;
  focus: string;
  skills: string[];
  tools: string[];
  projects: string[];
  certifications: string[];
  careerRelevance: string;
}

// Hook for fetching roadmap
export function useRoadmap(
  fieldId: string | null,
  specializationId: string | null,
  userProfile?: { semester?: number; careerGoal?: string }
) {
  const { data: phases = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['dynamic_roadmap', fieldId, specializationId, userProfile?.semester, userProfile?.careerGoal],
    queryFn: () => fetchDynamicContent<DynamicRoadmapPhase[]>({
      type: 'roadmap',
      fieldId: fieldId!,
      specializationId: specializationId!,
      userProfile,
    }),
    enabled: !!fieldId && !!specializationId,
    staleTime: 1000 * 60 * 30,
  });

  return { phases, loading, error: error ? (error as Error).message : null, refetch };
}

// Certification type
export interface DynamicCertification {
  id: string;
  name: string;
  provider: string;
  valueScore: number;
  industryAcceptance: 'high' | 'medium' | 'low';
  timeToComplete: string;
  cost: string;
  skills: string[];
  overview: string;
  syllabus: string[];
  prerequisites: string[];
  officialUrl: string;
  preparationResources: string[];
  rolesUnlocked: string[];
  salaryRange: string;
  targetAudience: string[];
}

// Hook for fetching certifications
export function useCertifications(fieldId: string | null, specializationId: string | null) {
  const { data: certifications = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['dynamic_certifications', fieldId, specializationId],
    queryFn: () => fetchDynamicContent<DynamicCertification[]>({
      type: 'certifications',
      fieldId: fieldId!,
      specializationId: specializationId!,
    }),
    enabled: !!fieldId && !!specializationId,
    staleTime: 1000 * 60 * 30,
  });

  return { certifications, loading, error: error ? (error as Error).message : null, refetch };
}

// Project type
export interface DynamicProject {
  id: string;
  name: string;
  description: string;
  skills: string[];
  resumeStrength: number;
  careerImpact: 'high' | 'medium' | 'low';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  realWorldApplication: string;
  techStack: string[];
}

// Hook for fetching projects
export function useProjects(
  fieldId: string | null,
  specializationId: string | null,
  userProfile?: { skills?: string[]; careerGoal?: string }
) {
  const { data: projects = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['dynamic_projects', fieldId, specializationId, userProfile?.skills, userProfile?.careerGoal],
    queryFn: () => fetchDynamicContent<DynamicProject[]>({
      type: 'projects',
      fieldId: fieldId!,
      specializationId: specializationId!,
      userProfile,
    }),
    enabled: !!fieldId && !!specializationId,
    staleTime: 1000 * 60 * 30,
  });

  return { projects, loading, error: error ? (error as Error).message : null, refetch };
}

// Utility to clear cache (useful when user wants fresh data)
export function clearContentCache() {
  // QueryClient instance should be imported or passed if we need to clear specific queries
  // But for simple "refresh" usage, React Query's refetch() from hooks is preferred.
  // We can keep this empty or remove it. Keeping for backward compatibility but making it no-op or log warning.
  // Ideally, use queryClient.invalidateQueries() where needed.
}
