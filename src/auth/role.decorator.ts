import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';

export type AllowedRoles = keyof typeof UserRole | 'Any'; // UserRole의 key값

export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
