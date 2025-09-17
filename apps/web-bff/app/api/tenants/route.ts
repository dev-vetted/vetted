import { NextResponse } from 'next/server';
import { createContext } from '../../../server/context';

export async function GET(req: Request) {
  const ctx = await createContext(req);
  const tenants = await ctx.prisma.tenant.findMany({
    select: { id: true, name: true, type: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(tenants);
}

export async function POST(req: Request) {
  const ctx = await createContext(req);
  const body = await req.json();
  const { name, type } = body ?? {};
  if (!name || !type) return NextResponse.json({ error: 'name and type required' }, { status: 400 });
  const tenant = await ctx.prisma.tenant.create({ data: { name, type } });
  return NextResponse.json(tenant, { status: 201 });
}


