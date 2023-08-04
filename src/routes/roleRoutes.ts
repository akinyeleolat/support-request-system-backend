// src/routes/roleRoutes.ts
import { Router } from 'express';
import { RoleController } from '../controllers/RoleController';
import { RoleService } from '../services/RoleService';
import RoleModel from '../models/Role';
import { authTokenValidator, validateIsAdmin, validateRole } from '../middleware/authMiddleware';

const router = Router();
const roleModel = new RoleModel;
const roleService = new RoleService(roleModel);
const roleController = new RoleController(roleService);


router.get('/', validateIsAdmin, roleController.getRoles.bind(roleController));
router.get('/:id', validateIsAdmin, roleController.getRole.bind(roleController));

router.use(authTokenValidator)

router.use(validateIsAdmin);
router.post('/', roleController.createRole.bind(roleController));
router.put('/:id',  roleController.updateRole.bind(roleController));
router.delete('/:id', roleController.deleteRole.bind(roleController));

export default router;
