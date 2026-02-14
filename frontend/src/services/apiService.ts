// API service to call Express backend instead of Supabase
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import { auth } from '@/lib/firebase';

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

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function generateContent<T>(request: ContentRequest): Promise<T> {
    const response = await fetch(`${API_URL}/api/content/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<T> = await response.json();

    if (!result.success) {
        throw new Error(result.error || 'Failed to generate content');
    }

    return result.data as T;
}

export async function getProjects(params: { field?: string; specialization?: string; careerPath?: string; branch?: string }): Promise<any[]> {
    try {
        const query = new URLSearchParams(params as any).toString();
        const response = await fetch(`${API_URL}/api/projects?${query}`);
        if (!response.ok) throw new Error('API Error');
        const result = await response.json();
        return result.success ? result.data : [];
    } catch (error) {
        console.error('Projects API failure:', error);
        return [];
    }
}

export async function getCertifications(params: { field?: string; specialization?: string; careerPath?: string; branch?: string }): Promise<any[]> {
    try {
        const query = new URLSearchParams(params as any).toString();
        const response = await fetch(`${API_URL}/api/certifications?${query}`);
        if (!response.ok) throw new Error('API Error');
        const result = await response.json();
        return result.success ? result.data : [];
    } catch (error) {
        console.error('Certifications API failure:', error);
        return [];
    }
}
export async function getQuotaStats(): Promise<any> {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(`${API_URL}/api/admin/quota`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch quota');
    return await response.json();
}
