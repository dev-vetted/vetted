import { NextResponse } from 'next/server';
import { createContext } from '../../../../server/context';

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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const headers = buildCorsHeaders(req);
  try {
    const ctx = await createContext(req);
    const body = await req.json();
    const { name, species } = body ?? {};
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Pet ID is required' }, { status: 400, headers });
    }

    // Check if pet exists and get current data
    const existingPet = await ctx.prisma.pet.findUnique({
      where: { id }
    });

    if (!existingPet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404, headers });
    }

    // Check if user has access to this pet's tenant
    const tenantId = ctx.auth.tenantId;
    if (tenantId && existingPet.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Access denied: Pet belongs to different tenant' }, { status: 403, headers });
    }

    // Build update data - only include provided fields
    const updateData: { name?: string; species?: string } = {};
    if (name !== undefined) updateData.name = name;
    if (species !== undefined) updateData.species = species;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'At least one field (name or species) must be provided' }, { status: 400, headers });
    }

    const updatedPet = await ctx.prisma.pet.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedPet, { headers });
  } catch (error) {
    console.error('Error updating pet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const headers = buildCorsHeaders(req);
  try {
    const ctx = await createContext(req);
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Pet ID is required' }, { status: 400, headers });
    }

    // Check if pet exists and get current data
    const existingPet = await ctx.prisma.pet.findUnique({
      where: { id }
    });

    if (!existingPet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404, headers });
    }

    // Check if user has access to this pet's tenant
    const tenantId = ctx.auth.tenantId;
    if (tenantId && existingPet.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Access denied: Pet belongs to different tenant' }, { status: 403, headers });
    }

    await ctx.prisma.pet.delete({ where: { id } });

    return NextResponse.json({ success: true, id }, { headers });
  } catch (error) {
    console.error('Error deleting pet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const headers = buildCorsHeaders(req);
  try {
    const ctx = await createContext(req);
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Pet ID is required' }, { status: 400, headers });
    }

    const pet = await ctx.prisma.pet.findUnique({
      where: { id },
      select: { id: true, name: true, species: true, tenantId: true, createdAt: true },
    });

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404, headers });
    }

    // Check if user has access to this pet's tenant
    const tenantId = ctx.auth.tenantId;
    if (tenantId && pet.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Access denied: Pet belongs to different tenant' }, { status: 403, headers });
    }

    return NextResponse.json(pet, { headers });
  } catch (error) {
    console.error('Error fetching pet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers });
  }
}