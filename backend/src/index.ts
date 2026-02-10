import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/firebase';
import { startNotificationScheduler } from './services/notificationScheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase
// Initialize Firebase (happens on import now)
// import is side-effectful

// Routes
import contentRoutes from './routes/content';
import adminRoutes from './routes/adminRoutes';
import notificationRoutes from './routes/notifications';
import aiMentorRoutes from './routes/ai-mentor';
import projectsRoutes from './routes/projects';
import portfolioRoutes from './routes/portfolioRoutes';
import analyticsRoutes from './routes/analytics';
import careerPathsRoutes from './routes/careerPaths';
import assessmentRoutes from './routes/assessmentRoutes';
import recommendationRoutes from './routes/recommendationRoutes';


app.get('/', (req, res) => {
    res.send('Hello from Intelligence Career Backend!');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Content generation routes
app.use('/api/content', contentRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Notification routes
app.use('/api/notifications', notificationRoutes);

// AI Mentor routes
app.use('/api/ai-mentor', aiMentorRoutes);

// Projects routes
app.use('/api/projects', projectsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/analytics', analyticsRoutes);

// Career Paths routes (AI-powered)
app.use('/api/career-paths', careerPathsRoutes);

// Assessment routes
app.use('/api/assessment', assessmentRoutes);
app.use('/api/recommendation', recommendationRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // Start notification scheduler
    startNotificationScheduler();
});
