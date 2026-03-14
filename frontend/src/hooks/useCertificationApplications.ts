import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface CertificationApplication {
  id: string;
  user_id: string;
  certification_id: string;
  certification_name: string;
  provider: string;
  status: 'applied' | 'in_progress' | 'completed';
  applied_at: string;
  started_at: string | null;
  completed_at: string | null;
  certificate_url: string | null;
  notes: string | null;
}

export function useCertificationApplications() {
  const { user } = useAuthContext();
  const [applications, setApplications] = useState<CertificationApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('certification_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data as CertificationApplication[]);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const applyForCertification = async (
    certificationId: string,
    certificationName: string,
    provider: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('certification_applications')
      .insert({
        user_id: user.id,
        certification_id: certificationId,
        certification_name: certificationName,
        provider: provider,
        status: 'applied',
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('You have already applied for this certification');
      }
      throw error;
    }

    setApplications(prev => [data as CertificationApplication, ...prev]);
    return data;
  };

  const updateApplicationStatus = async (
    applicationId: string,
    status: 'applied' | 'in_progress' | 'completed',
    additionalData?: { certificate_url?: string; notes?: string }
  ) => {
    if (!user) throw new Error('User not authenticated');

    const updateData: Record<string, unknown> = { status };
    
    if (status === 'in_progress') {
      updateData.started_at = new Date().toISOString();
    } else if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    if (additionalData) {
      Object.assign(updateData, additionalData);
    }

    const { data, error } = await supabase
      .from('certification_applications')
      .update(updateData)
      .eq('id', applicationId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    setApplications(prev =>
      prev.map(app => (app.id === applicationId ? (data as CertificationApplication) : app))
    );
    return data;
  };

  const getApplicationStatus = (certificationId: string) => {
    return applications.find(app => app.certification_id === certificationId);
  };

  return {
    applications,
    loading,
    applyForCertification,
    updateApplicationStatus,
    getApplicationStatus,
    refreshApplications: fetchApplications,
  };
}
