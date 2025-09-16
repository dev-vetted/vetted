import { z } from 'zod';

// IDs
export const UserId = z.string().brand('UserId');
export type UserId = z.infer<typeof UserId>;

export const TenantId = z.string().brand('TenantId');
export type TenantId = z.infer<typeof TenantId>;

export const PetId = z.string().brand('PetId');
export type PetId = z.infer<typeof PetId>;

// Enums
export const TenantType = z.enum(['consumer', 'vendor']);
export type TenantType = z.infer<typeof TenantType>;

export const Role = z.enum(['owner', 'admin', 'member', 'viewer']);
export type Role = z.infer<typeof Role>;

// Core types
export const User = z.object({
  id: UserId,
  email: z.string().email(),
  name: z.string().min(1),
  avatarUrl: z.string().url().optional(),
  createdAt: z.string().datetime().optional(),
});
export type User = z.infer<typeof User>;

export const Tenant = z.object({
  id: TenantId,
  type: TenantType,
  name: z.string().min(1),
  createdAt: z.string().datetime().optional(),
});
export type Tenant = z.infer<typeof Tenant>;

export const Membership = z.object({
  userId: UserId,
  tenantId: TenantId,
  role: Role,
  createdAt: z.string().datetime().optional(),
});
export type Membership = z.infer<typeof Membership>;

export const Pet = z.object({
  id: PetId,
  tenantId: TenantId,
  name: z.string().min(1),
  species: z.enum(['dog', 'cat', 'bird', 'other']).default('other'),
  ageYears: z.number().int().nonnegative().optional(),
  createdAt: z.string().datetime().optional(),
});
export type Pet = z.infer<typeof Pet>;


