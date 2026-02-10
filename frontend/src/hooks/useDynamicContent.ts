import { useState, useEffect, useCallback } from 'react';
import { generateContent } from '@/services/apiService';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(type: string, ...params: (string | undefined)[]): string {
  return [type, ...params.filter(Boolean)].join(':');
}

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

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
  const [fields, setFields] = useState<DynamicField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = useCallback(async () => {
    const cacheKey = getCacheKey('fields');
    const cached = getFromCache<DynamicField[]>(cacheKey);

    if (cached) {
      setFields(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchDynamicContent<DynamicField[]>({ type: 'fields' });
      setFields(data);
      setCache(cacheKey, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch fields');
      console.error('Error fetching fields:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  return { fields, loading, error, refetch: fetchFields };
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
  const [specializations, setSpecializations] = useState<DynamicSpecialization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecializations = useCallback(async () => {
    if (!fieldId) {
      setSpecializations([]);
      return;
    }

    const cacheKey = getCacheKey('specializations', fieldId);
    const cached = getFromCache<DynamicSpecialization[]>(cacheKey);

    if (cached) {
      setSpecializations(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchDynamicContent<DynamicSpecialization[]>({
        type: 'specializations',
        fieldId,
      });
      setSpecializations(data);
      setCache(cacheKey, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch specializations');
      console.error('Error fetching specializations:', err);
    } finally {
      setLoading(false);
    }
  }, [fieldId]);

  useEffect(() => {
    fetchSpecializations();
  }, [fetchSpecializations]);

  return { specializations, loading, error, refetch: fetchSpecializations };
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
  const [careerPaths, setCareerPaths] = useState<DynamicCareerPath[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCareerPaths = useCallback(async () => {
    if (!fieldId || !specializationId) {
      setCareerPaths([]);
      return;
    }

    const cacheKey = getCacheKey('career-paths', fieldId, specializationId);
    const cached = getFromCache<DynamicCareerPath[]>(cacheKey);

    if (cached) {
      setCareerPaths(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchDynamicContent<DynamicCareerPath[]>({
        type: 'career-paths',
        fieldId,
        specializationId,
      });
      setCareerPaths(data);
      setCache(cacheKey, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch career paths');
      console.error('Error fetching career paths:', err);
    } finally {
      setLoading(false);
    }
  }, [fieldId, specializationId]);

  useEffect(() => {
    fetchCareerPaths();
  }, [fetchCareerPaths]);

  return { careerPaths, loading, error, refetch: fetchCareerPaths };
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
  const [phases, setPhases] = useState<DynamicRoadmapPhase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmap = useCallback(async () => {
    if (!fieldId || !specializationId) {
      setPhases([]);
      return;
    }

    const cacheKey = getCacheKey('roadmap', fieldId, specializationId, String(userProfile?.semester));
    const cached = getFromCache<DynamicRoadmapPhase[]>(cacheKey);

    if (cached) {
      setPhases(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchDynamicContent<DynamicRoadmapPhase[]>({
        type: 'roadmap',
        fieldId,
        specializationId,
        userProfile,
      });
      setPhases(data);
      setCache(cacheKey, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch roadmap');
      console.error('Error fetching roadmap:', err);
    } finally {
      setLoading(false);
    }
  }, [fieldId, specializationId, userProfile?.semester, userProfile?.careerGoal]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  return { phases, loading, error, refetch: fetchRoadmap };
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
  const [certifications, setCertifications] = useState<DynamicCertification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertifications = useCallback(async () => {
    if (!fieldId || !specializationId) {
      setCertifications([]);
      return;
    }

    const cacheKey = getCacheKey('certifications', fieldId, specializationId);
    const cached = getFromCache<DynamicCertification[]>(cacheKey);

    if (cached) {
      setCertifications(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchDynamicContent<DynamicCertification[]>({
        type: 'certifications',
        fieldId,
        specializationId,
      });
      setCertifications(data);
      setCache(cacheKey, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch certifications');
      console.error('Error fetching certifications:', err);
    } finally {
      setLoading(false);
    }
  }, [fieldId, specializationId]);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  return { certifications, loading, error, refetch: fetchCertifications };
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
  const [projects, setProjects] = useState<DynamicProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!fieldId || !specializationId) {
      setProjects([]);
      return;
    }

    const cacheKey = getCacheKey('projects', fieldId, specializationId);
    const cached = getFromCache<DynamicProject[]>(cacheKey);

    if (cached) {
      setProjects(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchDynamicContent<DynamicProject[]>({
        type: 'projects',
        fieldId,
        specializationId,
        userProfile,
      });
      setProjects(data);
      setCache(cacheKey, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, [fieldId, specializationId, userProfile?.skills, userProfile?.careerGoal]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}

// Utility to clear cache (useful when user wants fresh data)
export function clearContentCache() {
  cache.clear();
}
