import { useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as updateFirebaseProfile,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { saveProfile, loadProfile, removeProfile, saveToken, removeToken, migrateLegacyStorage } from '@/lib/authStorage';

// Check if email is admin (matches ADMIN_EMAIL from backend)
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'guntaganideepak1234@gmail.com';
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
  userPlan: 'free' | 'premium' | 'enterprise'; // Current subscription plan
  planStartDate: string; // ISO timestamp when plan started

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
    // Migrate legacy storage if it exists (handles single key logic now)
    migrateLegacyStorage();
    return loadProfile();
  });

  // Start as loading=true, will be set to false after Firebase auth initializes
  // OPTIMIZATION: If we already have a cached profile, we can skip the initial loading flicker
  const [loading, setLoading] = useState(!profile);

  useEffect(() => {
    // Single Global Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('[Auth State Change]', currentUser ? `User: ${currentUser.email}` : 'Logged out');

      setUser(currentUser);
      if (currentUser) {
        // Fetch fresh profile data
        await fetchProfile(currentUser.uid);

        // Update token in storage
        const token = await currentUser.getIdToken();
        saveToken(token);
      } else {
        // Clear local profile state but don't force redirects here 
        // to handle multi-tab stability
        setProfile(null);
        removeProfile();
        removeToken();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const fetchProfile = async (userId: string) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as any;

        // Ensure role exists
        if (!data.role) {
          const role = isAdminEmail(data.email) ? 'admin' : 'user';
          const updatedData = { ...data, role } as Profile;
          await updateDoc(docRef, { role });
          setProfile(updatedData);
          saveProfile(updatedData);
        } else {
          const profileData = data as Profile;
          setProfile(profileData);
          saveProfile(profileData);
        }

        // Refresh token to ensure custom claims are synced
        const token = await auth.currentUser?.getIdToken(true);
        if (token) saveToken(token);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Ensure tab-level isolation
      await setPersistence(auth, browserSessionPersistence);
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
        skills: [],
        experience_years: 0,
        preferred_roles: [],
        skill_gap_analysis: {},
        resume_url: null,
        completed_projects: [],
        roadmap_progress: 0,
        userPlan: 'free',
        planStartDate: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), newProfile);
      await updateFirebaseProfile(user, { displayName: fullName });

      setProfile(newProfile);
      saveProfile(newProfile);

      const token = await user.getIdToken();
      saveToken(token);
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
      // Ensure tab-level isolation before sign in
      await setPersistence(auth, browserSessionPersistence);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      saveToken(token);

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
    try {
      // Clear storage manually first for instant feedback
      setProfile(null);
      removeProfile();
      removeToken();
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Firebase signout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const docRef = doc(db, 'users', user.uid);
      const updatedData = { ...updates, updated_at: new Date().toISOString() };

      await updateDoc(docRef, updatedData);

      const newItem = { ...profile, ...updatedData } as Profile;
      setProfile(newItem);
      saveProfile(newItem);
      return newItem;

    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Ensure tab-level isolation
      await setPersistence(auth, browserSessionPersistence);
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
          skills: [],
          experience_years: 0,
          preferred_roles: [],
          skill_gap_analysis: {},
          resume_url: null,
          completed_projects: [],
          roadmap_progress: 0,
          userPlan: 'free',
          planStartDate: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await setDoc(docRef, newProfile);
        setProfile(newProfile);
        saveProfile(newProfile);
      } else {
        const data = docSnap.data() as Profile;
        setProfile(data);
        saveProfile(data);
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
