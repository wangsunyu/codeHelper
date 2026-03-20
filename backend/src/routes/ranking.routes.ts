import { Router } from 'express';
import * as RankingController from '../controllers/ranking.controller';

const router = Router();
router.get('/skills', RankingController.rankings);

export default router;
