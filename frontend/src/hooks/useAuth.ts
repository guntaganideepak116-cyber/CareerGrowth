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
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Check if email is admin (matches ADMIN_EMAIL from backend)
const ADMIN_EMAIL = 'guntaganideepak1234@gmail.com'; // Should match backend .env
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
  branch: string | null; // Engineering branch (CSE, ECE, EEE, etc.)
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
  role: 'admin' | 'user'; // User role for access control

  // Intelligence & Progress Fields
  skills: string[]; // List of acquired skills
  experience_years: number;
  preferred_roles: string[]; // Target roles for match scoring
  skill_gap_analysis: Record<string, any>; // Cached analysis
  resume_url: string | null;
  completed_projects: string[]; // IDs of completed projects
  roadmap_progress: number; // 0-100 percentage

  // Subscription Plan Fields
  userPlan: 'free' | 'pro' | 'premium'; // Current subscription plan
  planStartDate: string; // ISO timestamp when plan started

  // Notifications
  notificationPreference?: boolean; // Email notification preference

  // Onboarding & Flow Control
  onboardingCompleted?: boolean;
  selectedField?: string | null;
  selectedSpecialization?: string | null;

  created_at: string;
  updated_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  // Initialize from local storage for instant load
  const [profile, setProfile] = useState<Profile | null>(() => {
    try {
      const cached = localStorage.getItem('user_profile');
      if (!cached) {
        console.log('[Auth Init] No cached profile');
        return null;
      }

      const parsed = JSON.parse(cached);

      // Validate cached profile has required fields
      if (parsed && parsed.id && parsed.email) {
        // Auto-add role if missing (backward compatibility)
        if (!parsed.role) {
          console.log('[Auth Init] Cached profile missing role, will auto-add as "user"');
          parsed.role = 'user'; // Default to user, will be corrected by server if admin
        }
        console.log('[Auth Init] ✅ Using cached profile:', parsed.email, 'Role:', parsed.role);
        return parsed;
      }

      // Invalid cache
      console.log('[Auth Init] Invalid cached profile, clearing');
      localStorage.removeItem('user_profile');
      return null;
    } catch (error) {
      console.error('[Auth Init] Error parsing cached profile:', error);
      localStorage.removeItem('user_profile');
      return null;
    }
  });

  // Start as loading=true, will be set to false after Firebase auth initializes
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase Auth listener - this is BROWSER-SPECIFIC
    // Each browser/tab has its own Firebase auth instance and won't interfere with others
    // Browser A: User session  -> auth.currentUser = user instance
    // Browser B: Admin session -> auth.currentUser = admin instance (completely separate)
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('[Auth State Change]', currentUser ? `User: ${currentUser.email}` : 'Logged out');

      setUser(currentUser);

      // Stop loading IMMEDIATELY after getting auth state
      // This prevents "Redirecting..." loops while waiting for profile
      setLoading(false);

      if (currentUser) {
        // Fetch profile in background - does not block UI
        await fetchProfile(currentUser.uid);
      } else {
        setProfile(null);
        localStorage.removeItem('user_profile');
      }
    });

    return () => unsubscribe();
  }, []); // Empty deps is correct - we want this listener to run once per component mount


  const fetchProfile = async (userId: string) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as any; // Use 'any' temporarily for migration check

        // Auto-migrate: Add role if missing (for existing users)
        if (!data.role) {
          console.log('[Migration] Adding role field to existing user profile');
          const role = isAdminEmail(data.email) ? 'admin' : 'user';
          const updatedData = { ...data, role } as Profile;

          // Update in Firestore
          await updateDoc(docRef, { role });

          // Update local state
          setProfile(updatedData);
          localStorage.setItem('user_profile', JSON.stringify(updatedData));
        } else {
          // Profile already has role
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

      // Create profile in Firestore
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

        // Initialize new fields
        skills: [],
        experience_years: 0,
        preferred_roles: [],
        skill_gap_analysis: {},
        resume_url: null,
        completed_projects: [],
        roadmap_progress: 0,

        // Notifications
        notificationPreference: true,

        // Initialize Free Plan
        userPlan: 'free',
        planStartDate: new Date().toISOString(),

        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), newProfile);

      // Update display name in Auth
      await updateFirebaseProfile(user, { displayName: fullName });

      setProfile(newProfile);
      localStorage.setItem('user_profile', JSON.stringify(newProfile));
      return user;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please sign in instead.');
      }
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Sign in creates a session ONLY for this browser/tab
      // Multiple independent sessions are fully supported:
      // - Browser A: user@example.com logged in
      // - Browser B: admin@example.com logged in
      // Both remain active simultaneously without interference
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Update lastLogin timestamp in Firestore
      // Fire and forget - don't await this
      const userRef = doc(db, 'users', result.user.uid);
      updateDoc(userRef, {
        lastLogin: Timestamp.now(),
      }).catch(err => console.error('Error updating lastLogin:', err));

      return result;
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Please try again.');
      }
      throw error;
    }
  };

  const signOut = async () => {
    // Sign out ONLY in this browser/tab
    // This will NOT affect any other browser where the user (or admin) is logged in
    // Each browser has its own Firebase auth token
    await firebaseSignOut(auth);
    setProfile(null);
    localStorage.removeItem('user_profile');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const docRef = doc(db, 'users', user.uid);
      const updatedData = { ...updates, updated_at: new Date().toISOString() };

      await updateDoc(docRef, updatedData);

      // Refresh local state
      const newItem = { ...profile, ...updatedData } as Profile;
      setProfile(newItem);
      localStorage.setItem('user_profile', JSON.stringify(newItem));
      return newItem;

    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Google sign-in creates a session ONLY for this browser/tab
      // Same independence as email/password login
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if profile exists, if not create one
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

          // Initialize new fields
          skills: [],
          experience_years: 0,
          preferred_roles: [],
          skill_gap_analysis: {},
          resume_url: null,
          completed_projects: [],
          roadmap_progress: 0,

          // Notifications
          notificationPreference: true,

          // Initialize Free Plan
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
        setProfile(data);
        localStorage.setItem('user_profile', JSON.stringify(data));
      }

      return result;
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign in cancelled');
      }
      throw error;
    }
  };

  return {
    user,
    session: null, // Deprecated in Firebase, keeping for compatibility if needed
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
