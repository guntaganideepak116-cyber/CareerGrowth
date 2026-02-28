import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/firebase';
import { startNotificationScheduler, bootstrapNotificationsIfEmpty } from './services/notificationScheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://career-growth-five.vercel.app',
    'https://career-growth-opr6.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
import contentRoutes from './routes/content';
import strictContentRoutes from './routes/strictContent';
import adminRoutes from './routes/adminRoutes';
import notificationRoutes from './routes/notifications';
import aiMentorRoutes from './routes/ai-mentor';
import projectsRoutes from './routes/projects';
import certificationsRoutes from './routes/certifications';
import portfolioRoutes from './routes/portfolioRoutes';
import analyticsRoutes from './routes/analytics';
import careerPathsRoutes from './routes/careerPaths';
import assessmentRoutes from './routes/assessmentRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import collegeRoutes from './routes/collegeRoutes';

app.get('/', (_req, res) => {
    res.send('CareerGrowth Backend — Running ✅');
});

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        geminiConfigured: !!process.env.GEMINI_API_KEY,
        firebaseConfigured: !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON || !!process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
});

app.use('/api/content', contentRoutes);
app.use('/api/strict-content', strictContentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai-mentor', aiMentorRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/career-paths', careerPathsRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/colleges', collegeRoutes);

// ── Server startup ────────────────────────────────────────────────────────────
//
// In LOCAL development: start Express server + node-cron scheduler.
// In Vercel production:  export app only — Vercel calls routes as serverless
//   functions. Vercel Cron Jobs (vercel.json) call GET /api/notifications/cron/*
//   automatically on schedule.
//
// Database writes happen on every request, so Firestore is always the source
// of truth. The frontend reads from Firestore in real-time via onSnapshot.

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, async () => {
        console.log(`\n🚀 Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);

        // Seed today's notifications immediately on startup
        await bootstrapNotificationsIfEmpty();

        // Start cron scheduler for local dev
        startNotificationScheduler();
    });
} else {
    // Production: Vercel handles cold starts effectively.
    // Instead of bootstrapping on every request (slow), we rely on the Vercel Cron Job.
    console.log('🌐 CareerGrowth Backend initialized for Vercel (Production)');
}

export default app;
