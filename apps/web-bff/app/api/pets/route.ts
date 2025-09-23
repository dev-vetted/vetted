import { NextResponse } from 'next/server';
import { createContext } from '../../../server/context';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3001, https://vetted-vendor-web.vercel.app',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-tenant-id',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(req: Request) {
  const ctx = await createContext(req);
  const pets = await ctx.prisma.pet.findMany({
    select: { id: true, name: true, species: true, tenantId: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json(pets, { headers: corsHeaders });
}

export async function POST(req: Request) {
  const ctx = await createContext(req);
  const body = await req.json();
  const { name, species } = body ?? {};
  const tenantId = (body?.tenantId as string | undefined) ?? ctx.auth.tenantId ?? null;
  if (!name || !species || !tenantId) {
    return NextResponse.json({ error: 'name, species, tenantId required' }, { status: 400, headers: corsHeaders });
  }
  // Validate tenant exists to avoid FK error
  const tenant = await ctx.prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) {
    return NextResponse.json({ error: 'Invalid tenantId (tenant not found)' }, { status: 400, headers: corsHeaders });
  }
  const pet = await ctx.prisma.pet.create({ data: { name, species, tenantId } });
  return NextResponse.json(pet, { status: 201, headers: corsHeaders });
}


