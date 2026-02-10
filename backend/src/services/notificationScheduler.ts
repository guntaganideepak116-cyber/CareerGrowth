import cron from 'node-cron';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000';

// Run daily at 9:00 AM to generate notifications for all fields
export function startNotificationScheduler() {
    console.log('📅 Notification scheduler initialized');

    // Run daily at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        try {
            console.log(`\n🔔 [${new Date().toISOString()}] Running daily notification generation...`);
            const response = await axios.post(`${API_URL}/api/notifications/generate-daily`);
            if (response.data.success) {
                console.log(`✅ Successfully generated ${response.data.count} notifications for ${response.data.fields} fields`);
            } else {
                console.error('❌ Failed to generate notifications:', response.data);
            }
        } catch (error) {
            console.error('❌ Error in notification scheduler:', error);
        }
    });

    // Run hourly for AI Insights (top of every hour)
    cron.schedule('0 * * * *', async () => {
        try {
            console.log(`\n🧠 [${new Date().toISOString()}] Running hourly AI Insight generation...`);
            const response = await axios.post(`${API_URL}/api/notifications/generate-hourly`);
            if (response.data.success) {
                console.log(`✅ Generated AI insights.`);
            }
        } catch (error) {
            console.error('❌ Error in hourly scheduler:', error);
        }
    });

    // Run every 10 minutes for Live News
    cron.schedule('*/10 * * * *', async () => {
        try {
            console.log(`\n📰 [${new Date().toISOString()}] Running news fetcher...`);
            const response = await axios.post(`${API_URL}/api/notifications/fetch-news`);
            if (response.data.success) {
                console.log(`✅ Fetched live news.`);
            }
        } catch (error) {
            console.error('❌ Error in news scheduler:', error);
        }
    });

    // Run cleanup weekly on Sunday at 2:00 AM
    cron.schedule('0 2 * * 0', async () => {
        try {
            console.log(`\n🧹 [${new Date().toISOString()}] Running weekly notification cleanup...`);

            const response = await axios.delete(`${API_URL}/api/notifications/old`);

            if (response.data.success) {
                console.log(`✅ Cleaned up ${response.data.deletedCount} old notifications`);
            }
        } catch (error) {
            console.error('❌ Error in cleanup scheduler:', error);
        }
    });

    console.log('✅ Daily notification generation scheduled for 9:00 AM');
    console.log('✅ Weekly cleanup scheduled for Sunday 2:00 AM');

    // Optional: Run immediately on startup (for testing)
    if (process.env.NODE_ENV === 'development') {
        console.log('\n🧪 Development mode: Use POST /api/notifications/generate-daily to manually trigger generation');
    }
}
