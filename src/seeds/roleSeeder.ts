// src/seeds/roleSeeder.ts
import RoleModel from '../models/Role';
import { RoleService } from '../services/RoleService';

export async function seedRoles() {
  try {
    const roles = ['Customer', 'Support Agent', 'Admin'];
    const roleModel = new RoleModel()
    const roleService= new RoleService(roleModel)
    for (const roleName of roles) {
      const existingRole = await roleService.findByName (roleName);
      if (!existingRole) {
        await roleService.create({ name: roleName });
        console.log(`Role '${roleName}' created.`);
      }
    }
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
}
