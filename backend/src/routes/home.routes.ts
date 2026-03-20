import { Router } from 'express';
import * as HomeController from '../controllers/home.controller';

const router = Router();
router.get('/', HomeController.home);

export default router;
