import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { logUserActivity } from '@/services/userAnalyticsService';

export interface RoadmapProgressData {
  id: string;
  user_id: string;
  field_id: string;
  specialization_id: string;
  current_phase: number;
  completed_phases: number[];
  overall_progress: number;
  last_accessed_at: string;
}

// Helper functions for localStorage
function getStorageKey(userId: string, fieldId: string, specializationId: string): string {
  return `roadmap_progress_${userId}_${fieldId}_${specializationId}`;
}

function loadProgressFromStorage(userId: string, fieldId: string, specializationId: string): RoadmapProgressData | null {
  const key = getStorageKey(userId, fieldId, specializationId);
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

function saveProgressToStorage(progress: RoadmapProgressData): void {
  const key = getStorageKey(progress.user_id, progress.field_id, progress.specialization_id);
  localStorage.setItem(key, JSON.stringify(progress));
}

export function useRoadmapProgress(fieldId: string, specializationId: string) {
  const { user } = useAuthContext();
  const [progress, setProgress] = useState<RoadmapProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user || !fieldId || !specializationId) {
      setProgress(null);
      setLoading(false);
      return;
    }

    try {
      // Try to load from localStorage
      let progressData = loadProgressFromStorage(user.uid, fieldId, specializationId);

      if (!progressData) {
        // Create initial progress record
        progressData = {
          id: `${user.uid}_${fieldId}_${specializationId}`,
          user_id: user.uid,
          field_id: fieldId,
          specialization_id: specializationId,
          current_phase: 1,
          completed_phases: [],
          overall_progress: 0,
          last_accessed_at: new Date().toISOString(),
        };
        saveProgressToStorage(progressData);
      }

      setProgress(progressData);
    } catch (error) {
      console.error('Error fetching progress:', error);
      // Create default progress on error
      const defaultProgress: RoadmapProgressData = {
        id: `${user.uid}_${fieldId}_${specializationId}`,
        user_id: user.uid,
        field_id: fieldId,
        specialization_id: specializationId,
        current_phase: 1,
        completed_phases: [],
        overall_progress: 0,
        last_accessed_at: new Date().toISOString(),
      };
      setProgress(defaultProgress);
    } finally {
      setLoading(false);
    }
  }, [user, fieldId, specializationId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const markPhaseComplete = async (phaseId: number, totalPhases: number, skills: string[] = []) => {
    if (!user || !progress) return;

    const newCompletedPhases = [...progress.completed_phases, phaseId].filter(
      (v, i, a) => a.indexOf(v) === i
    );
    const newCurrentPhase = Math.min(phaseId + 1, totalPhases);
    const newOverallProgress = Math.round((newCompletedPhases.length / totalPhases) * 100);

    try {
      const updatedProgress: RoadmapProgressData = {
        ...progress,
        completed_phases: newCompletedPhases,
        current_phase: newCurrentPhase,
        overall_progress: newOverallProgress,
        last_accessed_at: new Date().toISOString(),
      };

      saveProgressToStorage(updatedProgress);
      setProgress(updatedProgress);

      // Log activity for analytics
      await logUserActivity(user.uid, 'ROADMAP_SEMESTER_COMPLETED', {
        fieldId: progress.field_id,
        metadata: { phaseId, totalPhases }
      });

      // Log skills as completed if any
      if (skills && skills.length > 0) {
        for (const skill of skills) {
          await logUserActivity(user.uid, 'SKILL_MARKED_COMPLETE', {
            relatedId: skill,
            fieldId: progress.field_id
          });
        }
      }

      return updatedProgress;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  const resetProgress = async () => {
    if (!user || !progress) return;

    try {
      const resetData: RoadmapProgressData = {
        ...progress,
        completed_phases: [],
        current_phase: 1,
        overall_progress: 0,
        last_accessed_at: new Date().toISOString(),
      };

      saveProgressToStorage(resetData);
      setProgress(resetData);
      return resetData;
    } catch (error) {
      console.error('Error resetting progress:', error);
      throw error;
    }
  };

  return {
    progress,
    loading,
    markPhaseComplete,
    resetProgress,
    refreshProgress: fetchProgress,
  };
}
