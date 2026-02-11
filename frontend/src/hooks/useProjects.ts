
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthContext } from '@/contexts/AuthContext';
import { Project, UserPlan } from '@/types/project';

export function useProjects() {
    const { user, profile } = useAuthContext();
    const fieldId = profile?.field;

    // Determine user plan (mocked or actual)
    // Assuming profile has planType, or we default to free
    // The prompt says "Get user.planType".
    const planType: UserPlan = (profile?.planType as UserPlan) || 'free';

    // Determine allowed plans based on user plan
    const allowedPlans: UserPlan[] = ['free'];
    if (planType === 'pro') allowedPlans.push('pro');
    if (planType === 'premium') {
        allowedPlans.push('pro');
        allowedPlans.push('premium');
    }

    return useQuery({
        queryKey: ['projects', fieldId, planType],
        queryFn: async (): Promise<Project[]> => {
            if (!fieldId) return [];

            try {
                const projectsRef = collection(db, 'projects');

                // Query: fieldId == selectedField AND planAccess in allowedPlans
                // Note: 'in' query allows up to 10 values, which is fine here (3 max).
                const q = query(
                    projectsRef,
                    where('fieldId', '==', fieldId),
                    where('planAccess', 'in', allowedPlans)
                    // orderBy('createdAt', 'desc') // Requires index, optional
                );

                const snapshot = await getDocs(q);
                const projects = snapshot.docs.map(doc => doc.data() as Project);

                return projects;
            } catch (error) {
                console.error('Error fetching projects:', error);
                return [];
            }
        },
        enabled: !!fieldId,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}
