import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { authRequired } from '../middlewares/auth';

const router = Router();

router.post('/register', AuthController.registerValidation, AuthController.register);
router.post('/login', AuthController.loginValidation, AuthController.login);
router.post('/logout', authRequired, AuthController.logout);
router.post('/refresh', AuthController.refreshToken);
router.get('/me', authRequired, AuthController.me);

export default router;
