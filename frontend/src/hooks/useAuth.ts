import { useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as updateFirebaseProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Check if email is admin (matches ADMIN_EMAIL from backend)
const ADMIN_EMAIL = 'guntaganideepak1234@gmail.com';
const isAdminEmail = (email: string | null): boolean => {
  return email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
};

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  field: string | null;
  branch: string | null;
  specialization: string | null;
  career_path: string | null;
  current_semester: number;
  career_phase: 'student' | 'fresher' | 'professional';
  avatar_url: string | null;
  bio: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  website_url: string | null;
  role: 'admin' | 'user';
  isBlocked?: boolean;

  // Intelligence & Progress Fields
  skills: string[];
  experience_years: number;
  preferred_roles: string[];
  skill_gap_analysis: Record<string, unknown>;
  resume_url: string | null;
  completed_projects: string[];
  roadmap_progress: number;

  // Subscription Plan Fields
  userPlan: 'free' | 'pro' | 'premium';
  planStartDate: string;

  // Notifications
  notificationPreference?: boolean;

  // Onboarding & Flow Control
  onboardingCompleted?: boolean;
  selectedField?: string | null;
  selectedSpecialization?: string | null;

  created_at: string;
  updated_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(() => {
    try {
      const cached = localStorage.getItem('user_profile');
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      if (parsed && parsed.id && parsed.email) return parsed;
      return null;
    } catch (error) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('[Auth State Change]', currentUser ? `User: ${currentUser.email}` : 'Logged out');
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Initial Fetch
        await fetchProfile(currentUser.uid);

        // REAL-TIME SYNC & FORCE LOGOUT IF BLOCKED
        unsubProfile = onSnapshot(doc(db, 'users', currentUser.uid), (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as Profile;
            setProfile(data);
            localStorage.setItem('user_profile', JSON.stringify(data));

            if (data.isBlocked) {
              console.warn('[AUTH] Session blocked by admin.');
              firebaseSignOut(auth);
            }
          }
        });
      } else {
        if (unsubProfile) unsubProfile();
        setProfile(null);
        localStorage.removeItem('user_profile');
      }
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
    };
  }, []);


  const fetchProfile = async (userId: string) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.role) {
          const role = isAdminEmail(data.email) ? 'admin' : 'user';
          const updatedData = { ...data, role } as Profile;
          await updateDoc(docRef, { role });
          setProfile(updatedData);
          localStorage.setItem('user_profile', JSON.stringify(updatedData));
        } else {
          setProfile(data as Profile);
          localStorage.setItem('user_profile', JSON.stringify(data));
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const newProfile: Profile = {
        id: user.uid,
        user_id: user.uid,
        full_name: fullName,
        email: user.email,
        phone: null,
        date_of_birth: null,
        field: null,
        branch: null,
        specialization: null,
        career_path: null,
        current_semester: 1,
        career_phase: 'student',
        avatar_url: null,
        bio: null,
        linkedin_url: null,
        github_url: null,
        twitter_url: null,
        website_url: null,
        role: isAdminEmail(user.email) ? 'admin' : 'user',
        isBlocked: false,

        skills: [],
        experience_years: 0,
        preferred_roles: [],
        skill_gap_analysis: {},
        resume_url: null,
        completed_projects: [],
        roadmap_progress: 0,

        notificationPreference: true,
        userPlan: 'free',
        planStartDate: new Date().toISOString(),

        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), newProfile);
      await updateFirebaseProfile(user, { displayName: fullName });

      setProfile(newProfile);
      localStorage.setItem('user_profile', JSON.stringify(newProfile));
      return user;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please sign in instead.');
      }
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, 'users', result.user.uid);

      // Check if blocked before allowing entry
      const snap = await getDoc(userRef);
      if (snap.exists() && snap.data().isBlocked) {
        await firebaseSignOut(auth);
        throw new Error('This account has been disabled by an administrator.');
      }

      updateDoc(userRef, {
        lastLogin: Timestamp.now(),
      }).catch(err => console.error('Error updating lastLogin:', err));

      return result;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).code === 'auth/invalid-credential' || (error as any).code === 'auth/user-not-found' || (error as any).code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Please try again.');
      }
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setProfile(null);
    localStorage.removeItem('user_profile');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');

    // Optimistically update local state first
    const newItem = { ...profile, ...updates, updated_at: new Date().toISOString() } as Profile;
    setProfile(newItem);
    localStorage.setItem('user_profile', JSON.stringify(newItem));

    try {
      const docRef = doc(db, 'users', user.uid);
      const updatedData = { ...updates, updated_at: new Date().toISOString() };
      await updateDoc(docRef, updatedData);
      return newItem;
    } catch (error: unknown) {
      console.error("Error updating profile in Firestore:", error);

      // If quota is exceeded, we still consider the update "locally successful"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.code === 'resource-exhausted') {
        console.warn("Firestore quota exceeded, acting in local-only mode.");
        return newItem;
      }

      // For other serious errors, we might still want to proceed to avoid breaking the UI flow
      return newItem;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const newProfile: Profile = {
          id: user.uid,
          user_id: user.uid,
          full_name: user.displayName || '',
          email: user.email,
          phone: null,
          date_of_birth: null,
          field: null,
          branch: null,
          specialization: null,
          career_path: null,
          current_semester: 1,
          career_phase: 'student',
          avatar_url: user.photoURL,
          bio: null,
          linkedin_url: null,
          github_url: null,
          twitter_url: null,
          website_url: null,
          role: isAdminEmail(user.email) ? 'admin' : 'user',
          isBlocked: false,

          skills: [],
          experience_years: 0,
          preferred_roles: [],
          skill_gap_analysis: {},
          resume_url: null,
          completed_projects: [],
          roadmap_progress: 0,

          notificationPreference: true,
          userPlan: 'free',
          planStartDate: new Date().toISOString(),

          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await setDoc(docRef, newProfile);
        setProfile(newProfile);
        localStorage.setItem('user_profile', JSON.stringify(newProfile));
      } else {
        const data = docSnap.data() as Profile;
        if (data.isBlocked) {
          await firebaseSignOut(auth);
          throw new Error('This account has been disabled by an administrator.');
        }
        setProfile(data);
        localStorage.setItem('user_profile', JSON.stringify(data));
      }

      return result;
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).code === 'auth/popup-closed-by-user') {
        throw new Error('Sign in cancelled');
      }
      throw error;
    }
  };

  return {
    user,
    session: null,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    refreshProfile: () => user && fetchProfile(user.uid),
  };
}
