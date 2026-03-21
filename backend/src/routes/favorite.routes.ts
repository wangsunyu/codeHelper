import { Router } from 'express';
import * as FavoriteController from '../controllers/favorite.controller';
import { authRequired } from '../middlewares/auth';

const router = Router();

router.get('/', authRequired, FavoriteController.list);
router.get('/:skillId/status', authRequired, FavoriteController.check);
router.post('/', authRequired, FavoriteController.add);
router.delete('/:skillId', authRequired, FavoriteController.remove);

export default router;
