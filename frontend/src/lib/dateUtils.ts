/**
 * Utility functions for formatting dates and times in Indian Standard Time (IST)
 * IST is UTC+5:30
 */

/**
 * Convert UTC date to IST and format it
 * @param utcDateString - ISO 8601 UTC date string (e.g., "2026-02-06T06:18:12.000Z")
 * @returns Formatted IST date and time (e.g., "06 Feb 2026 • 11:48 AM IST")
 */
export function formatToIST(utcDateString: string): string {
    const utcDate = new Date(utcDateString);

    // Convert to IST (UTC +5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istDate = new Date(utcDate.getTime() + istOffset);

    // Format: "06 Feb 2026 • 11:48 AM IST"
    const day = istDate.getUTCDate().toString().padStart(2, '0');
    const month = istDate.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const year = istDate.getUTCFullYear();

    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format

    return `${day} ${month} ${year} • ${hours}:${minutes} ${ampm} IST`;
}

/**
 * Format time only in IST
 * @param utcDateString - ISO 8601 UTC date string
 * @returns Formatted IST time (e.g., "11:48 AM IST")
 */
export function formatTimeIST(utcDateString: string): string {
    const utcDate = new Date(utcDateString);

    // Convert to IST (UTC +5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcDate.getTime() + istOffset);

    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${ampm} IST`;
}

/**
 * Format date with relative time (Today, Yesterday) in IST
 * @param utcDateString - ISO 8601 UTC date string
 * @returns Formatted string (e.g., "Today • 11:48 AM IST" or "06 Feb 2026 • 11:48 AM IST")
 */
export function formatRelativeIST(utcDateString: string): string {
    const utcDate = new Date(utcDateString);

    // Convert to IST
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcDate.getTime() + istOffset);

    // Get current IST time
    const nowUTC = new Date();
    const nowIST = new Date(nowUTC.getTime() + istOffset);

    // Extract dates (ignoring time)
    const notificationDate = new Date(
        istDate.getUTCFullYear(),
        istDate.getUTCMonth(),
        istDate.getUTCDate()
    );
    const todayDate = new Date(
        nowIST.getUTCFullYear(),
        nowIST.getUTCMonth(),
        nowIST.getUTCDate()
    );

    const diffInDays = Math.floor((todayDate.getTime() - notificationDate.getTime()) / (1000 * 60 * 60 * 24));

    // Format time
    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeStr = `${hours}:${minutes} ${ampm} IST`;

    // Format date label
    if (diffInDays === 0) {
        return `Today • ${timeStr}`;
    } else if (diffInDays === 1) {
        return `Yesterday • ${timeStr}`;
    } else if (diffInDays <= 7) {
        const dayName = istDate.toLocaleString('en-US', { weekday: 'long', timeZone: 'UTC' });
        return `${dayName} • ${timeStr}`;
    } else {
        const day = istDate.getUTCDate().toString().padStart(2, '0');
        const month = istDate.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
        const year = istDate.getUTCFullYear();
        return `${day} ${month} ${year} • ${timeStr}`;
    }
}

/**
 * Get short format for compact display
 * @param utcDateString - ISO 8601 UTC date string
 * @returns Compact format (e.g., "5m ago", "2h ago", "Yesterday", "06 Feb")
 */
export function formatShortIST(utcDateString: string): string {
    const utcDate = new Date(utcDateString);

    // Convert to IST
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcDate.getTime() + istOffset);
    const nowIST = new Date(new Date().getTime() + istOffset);

    const diffInMs = nowIST.getTime() - istDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
        return 'Just now';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    } else if (diffInDays === 1) {
        return 'Yesterday';
    } else if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    } else {
        const day = istDate.getUTCDate().toString().padStart(2, '0');
        const month = istDate.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
        return `${day} ${month}`;
    }
}
