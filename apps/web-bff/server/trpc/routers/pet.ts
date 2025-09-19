import { z } from 'zod';
import { t } from '../t';

export const petRouter = t.router({
  list: t.procedure
    .input(
      z
        .object({ limit: z.number().int().positive().max(100).default(50) })
        .default({ limit: 50 }),
    )
    .query(async ({ ctx, input }) => {
      const pets = await ctx.prisma.pet.findMany({
        orderBy: { createdAt: 'desc' },
        take: input.limit,
      });
      return pets;
    }),
  create: t.procedure
    .input(
      z.object({
        tenantId: z.string().min(1).optional(),
        name: z.string().min(1),
        species: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tenantId = input.tenantId ?? ctx.auth.tenantId;
      if (!tenantId) {
        throw new Error('tenantId required');
      }
      const tenant = await ctx.prisma.tenant.findUnique({ where: { id: tenantId } });
      if (!tenant) {
        throw new Error('Invalid tenantId (tenant not found)');
      }
      const created = await ctx.prisma.pet.create({ data: { ...input, tenantId } });
      return created;
    }),
  update: t.procedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1).optional(),
        species: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      // Check if pet exists and get current data
      const existingPet = await ctx.prisma.pet.findUnique({ 
        where: { id } 
      });
      
      if (!existingPet) {
        throw new Error('Pet not found');
      }
      
      // Check if user has access to this pet's tenant
      const tenantId = ctx.auth.tenantId;
      if (tenantId && existingPet.tenantId !== tenantId) {
        throw new Error('Access denied: Pet belongs to different tenant');
      }
      
      const updated = await ctx.prisma.pet.update({
        where: { id },
        data: updateData,
      });
      
      return updated;
    }),
  delete: t.procedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      
      // Check if pet exists and get current data
      const existingPet = await ctx.prisma.pet.findUnique({ 
        where: { id } 
      });
      
      if (!existingPet) {
        throw new Error('Pet not found');
      }
      
      // Check if user has access to this pet's tenant
      const tenantId = ctx.auth.tenantId;
      if (tenantId && existingPet.tenantId !== tenantId) {
        throw new Error('Access denied: Pet belongs to different tenant');
      }
      
      await ctx.prisma.pet.delete({ where: { id } });
      
      return { success: true, id };
    }),
});


