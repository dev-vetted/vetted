import { NextResponse } from 'next/server';
import { createContext } from '../../../server/context';

const allowedOrigins = new Set<string>([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'https://vetted-web-bff.vercel.app',
  'https://vetted-vendor-web.vercel.app',
]);

const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
const allowedHeaders = ['Content-Type', 'Authorization', 'x-tenant-id', 'x-user-id'];

function buildCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': allowedMethods.join(', '),
    'Access-Control-Allow-Headers': allowedHeaders.join(', '),
    'Access-Control-Allow-Credentials': 'true',
  };

  if (allowedOrigins.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }

  return headers;
}

export async function OPTIONS(req: Request) {
  const headers = buildCorsHeaders(req);
  headers['Access-Control-Max-Age'] = '86400';
  return new NextResponse(null, { status: 204, headers });
}

export async function GET(req: Request) {
  const ctx = await createContext(req);
  const pets = await ctx.prisma.pet.findMany({
    select: { id: true, name: true, species: true, tenantId: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json(pets, { headers: buildCorsHeaders(req) });
}

export async function POST(req: Request) {
  const ctx = await createContext(req);
  const body = await req.json();
  const { name, species } = body ?? {};
  const tenantId = (body?.tenantId as string | undefined) ?? ctx.auth.tenantId ?? null;
  const headers = buildCorsHeaders(req);
  if (!name || !species || !tenantId) {
    return NextResponse.json({ error: 'name, species, tenantId required' }, { status: 400, headers });
  }
  // Validate tenant exists to avoid FK error
  const tenant = await ctx.prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) {
    return NextResponse.json({ error: 'Invalid tenantId (tenant not found)' }, { status: 400, headers });
  }
  const pet = await ctx.prisma.pet.create({ data: { name, species, tenantId } });
  return NextResponse.json(pet, { status: 201, headers });
}


