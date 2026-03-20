import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error';
import authRoutes from './routes/auth.routes';
import skillRoutes from './routes/skill.routes';
import favoriteRoutes from './routes/favorite.routes';
import rankingRoutes from './routes/ranking.routes';
import homeRoutes from './routes/home.routes';
import { startSyncJob } from './jobs/sync-rankings';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => res.json({ success: true, message: 'OK' }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/favorites', favoriteRoutes);
app.use('/api/v1/rankings', rankingRoutes);
app.use('/api/v1/home', homeRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startSyncJob();
});

export default app;
