export const getMyLocation = async () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        coords: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            altitude: position.coords.altitude,
                            altitudeAccuracy: position.coords.altitudeAccuracy,
                            heading: position.coords.heading,
                            speed: position.coords.speed,
                        },
                        timestamp: position.timestamp,
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        }
    });
};

export const setupPushNotifications = async () => {
    if (!('Notification' in window)) {
        console.warn('This browser does not support desktop notification');
        return;
    }

    let permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        throw new Error('User denied permissions!');
    }
};

export const openExternalLink = async (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
};

export const getNetworkStatus = async () => {
    const connected = navigator.onLine;
    return {
        connected,
        connectionType: 'wifi', // Browsers don't always give precise type
    };
};

export const setupAppLifecycle = (onPause?: () => void, onResume?: () => void) => {
    window.addEventListener('blur', () => {
        if (onPause) onPause();
    });
    window.addEventListener('focus', () => {
        if (onResume) onResume();
    });
};
