/**
 * Role-Based Authentication Storage Utility
 * Ensures complete session isolation between admin and user roles
 */

export type UserRole = 'admin' | 'user';

// Storage keys for role-based separation
const STORAGE_KEYS = {
    admin: {
        profile: 'admin_profile',
        token: 'admin_token',
    },
    user: {
        profile: 'user_profile',
        token: 'user_token',
    },
} as const;

/**
 * Get the appropriate storage key based on role
 */
function getStorageKey(role: UserRole, type: 'profile' | 'token'): string {
    return STORAGE_KEYS[role][type];
}

/**
 * Save profile to role-specific localStorage
 */
export function saveProfile(profile: any, role: UserRole): void {
    try {
        const key = getStorageKey(role, 'profile');
        localStorage.setItem(key, JSON.stringify(profile));
        console.log(`[Auth Storage] ✓ Saved ${role} profile to ${key}`);
    } catch (error) {
        console.error(`[Auth Storage] Failed to save ${role} profile:`, error);
    }
}

/**
 * Load profile from role-specific localStorage
 */
export function loadProfile(role: UserRole): any | null {
    try {
        const key = getStorageKey(role, 'profile');
        const cached = localStorage.getItem(key);

        if (!cached) {
            console.log(`[Auth Storage] No cached ${role} profile`);
            return null;
        }

        const parsed = JSON.parse(cached);

        // Validate profile has required fields
        if (parsed && parsed.id && parsed.email) {
            console.log(`[Auth Storage] ✓ Loaded ${role} profile:`, parsed.email);
            return parsed;
        }

        // Invalid cache
        console.log(`[Auth Storage] Invalid ${role} profile cache, clearing`);
        localStorage.removeItem(key);
        return null;
    } catch (error) {
        console.error(`[Auth Storage] Error loading ${role} profile:`, error);
        const key = getStorageKey(role, 'profile');
        localStorage.removeItem(key);
        return null;
    }
}

/**
 * Remove profile from role-specific localStorage
 * ONLY removes the specified role's data, leaving other roles intact
 */
export function removeProfile(role: UserRole): void {
    try {
        const key = getStorageKey(role, 'profile');
        localStorage.removeItem(key);
        console.log(`[Auth Storage] ✓ Removed ${role} profile from ${key}`);
    } catch (error) {
        console.error(`[Auth Storage] Failed to remove ${role} profile:`, error);
    }
}

/**
 * Get the current profile from either role
 * Checks both admin and user storage and returns whichever exists
 * Prioritizes admin if both exist (edge case)
 */
export function getCurrentProfile(): { profile: any; role: UserRole } | null {
    // Check admin first
    const adminProfile = loadProfile('admin');
    if (adminProfile) {
        return { profile: adminProfile, role: 'admin' };
    }

    // Check user
    const userProfile = loadProfile('user');
    if (userProfile) {
        return { profile: userProfile, role: 'user' };
    }

    return null;
}

/**
 * Clear ALL authentication data (use only for complete logout/reset)
 * This should rarely be used - prefer removeProfile() for role-specific logout
 */
export function clearAllAuthData(): void {
    console.warn('[Auth Storage] ⚠️ Clearing ALL auth data');
    localStorage.removeItem(STORAGE_KEYS.admin.profile);
    localStorage.removeItem(STORAGE_KEYS.admin.token);
    localStorage.removeItem(STORAGE_KEYS.user.profile);
    localStorage.removeItem(STORAGE_KEYS.user.token);
}

/**
 * Migrate old single-key storage to role-based storage
 * Checks for legacy 'user_profile' key and migrates to appropriate role
 */
export function migrateLegacyStorage(): void {
    try {
        const legacyKey = 'user_profile';
        const legacyData = localStorage.getItem(legacyKey);

        if (!legacyData) {
            return; // No legacy data to migrate
        }

        const parsed = JSON.parse(legacyData);

        if (!parsed || !parsed.email) {
            localStorage.removeItem(legacyKey);
            return;
        }

        // Determine role and migrate
        const role: UserRole = parsed.role || 'user';
        saveProfile(parsed, role);

        // Remove legacy key
        localStorage.removeItem(legacyKey);
        console.log(`[Auth Storage] ✓ Migrated legacy profile to ${role} storage`);
    } catch (error) {
        console.error('[Auth Storage] Failed to migrate legacy storage:', error);
    }
}
