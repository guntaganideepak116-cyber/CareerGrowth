/**
 * Authentication Storage Utility
 * Manages user profile and token in sessionStorage for tab-level isolation.
 * Role-based access is handled via the 'role' field within the profile.
 */

const STORAGE_KEYS = {
    PROFILE: 'auth_profile',
    TOKEN: 'auth_token',
} as const;

/**
 * Save profile to sessionStorage
 */
export function saveProfile(profile: any): void {
    try {
        sessionStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (error) {
        console.error('[Auth Storage] Failed to save profile:', error);
    }
}

/**
 * Load profile from sessionStorage
 */
export function loadProfile(): any | null {
    try {
        const cached = sessionStorage.getItem(STORAGE_KEYS.PROFILE);
        if (!cached) return null;

        const parsed = JSON.parse(cached);
        // Basic validation
        if (parsed && parsed.id && parsed.email) {
            return parsed;
        }
        return null;
    } catch (error) {
        console.error('[Auth Storage] Error loading profile:', error);
        return null;
    }
}

/**
 * Remove profile from sessionStorage
 */
export function removeProfile(): void {
    sessionStorage.removeItem(STORAGE_KEYS.PROFILE);
}

/**
 * Save Firebase ID token to sessionStorage
 */
export function saveToken(token: string): void {
    sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
}

/**
 * Load Firebase ID token from sessionStorage
 */
export function loadToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.TOKEN);
}

/**
 * Remove Firebase ID token from sessionStorage
 */
export function removeToken(): void {
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
}

/**
 * Clear all authentication data (Login Reset)
 */
export function clearAllAuthData(): void {
    removeProfile();
    removeToken();
}

/**
 * Check if a session exists (profile + token)
 */
export function hasSession(): boolean {
    return !!sessionStorage.getItem(STORAGE_KEYS.PROFILE) && !!sessionStorage.getItem(STORAGE_KEYS.TOKEN);
}

/**
 * Legacy migration: ensure old localStorage keys are cleared
 * This unblocks tab-level isolation.
 */
export function migrateLegacyStorage(): void {
    const legacyKeys = [
        'admin_profile',
        'admin_token',
        'user_profile',
        'user_token',
        'auth_profile',
        'auth_token',
        'dashboard_metrics_cache' // Also clear dashboard cache to force fresh load per tab
    ];
    legacyKeys.forEach(key => {
        if (localStorage.getItem(key)) {
            // Clean up localStorage to ensure it doesn't leak into tab-level logic
            localStorage.removeItem(key);
        }
    });
}
