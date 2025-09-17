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
});


