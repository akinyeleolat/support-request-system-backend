// src/routes/roleRoutes.ts
import { Router } from 'express';
import { RoleController } from '../controllers/RoleController';
import { RoleService } from '../services/RoleService';
import RoleModel from '../models/Role';
import { authTokenValidator, validateIsAdmin } from '../middleware/authMiddleware';
import { userActivityLogger, userActivityLogService } from '../middleware/userActivityLogger';


const router = Router();
const roleModel = new RoleModel;
const roleService = new RoleService(roleModel);
const roleController = new RoleController(roleService);


router.get('/', roleController.getRoles.bind(roleController));
router.get('/:id', roleController.getRole.bind(roleController));

router.use(authTokenValidator)
router.use(userActivityLogger(userActivityLogService))

router.use(validateIsAdmin);
router.post('/', roleController.createRole.bind(roleController));
router.patch('/:id',  roleController.updateRole.bind(roleController));
router.delete('/:id', roleController.deleteRole.bind(roleController));

export default router;
