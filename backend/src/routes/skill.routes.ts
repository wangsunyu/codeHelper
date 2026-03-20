import { Router } from 'express';
import * as SkillController from '../controllers/skill.controller';
import { authRequired } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', SkillController.list);
router.post('/', authRequired, upload.single('file'), SkillController.publishValidation, SkillController.publish);
router.get('/:id', SkillController.detail);
router.get('/:id/download', SkillController.download);
router.delete('/:id', authRequired, SkillController.remove);

export default router;
