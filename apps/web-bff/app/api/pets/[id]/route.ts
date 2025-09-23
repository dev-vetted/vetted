import { NextResponse } from 'next/server';
import { createContext } from '../../../../server/context';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3001, https://vetted-web-bff.vercel.app',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-tenant-id',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const ctx = await createContext(req);
    const body = await req.json();
    const { name, species } = body ?? {};
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Pet ID is required' }, { status: 400, headers: corsHeaders });
    }

    // Check if pet exists and get current data
    const existingPet = await ctx.prisma.pet.findUnique({
      where: { id }
    });

    if (!existingPet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404, headers: corsHeaders });
    }

    // Check if user has access to this pet's tenant
    const tenantId = ctx.auth.tenantId;
    if (tenantId && existingPet.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Access denied: Pet belongs to different tenant' }, { status: 403, headers: corsHeaders });
    }

    // Build update data - only include provided fields
    const updateData: { name?: string; species?: string } = {};
    if (name !== undefined) updateData.name = name;
    if (species !== undefined) updateData.species = species;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'At least one field (name or species) must be provided' }, { status: 400, headers: corsHeaders });
    }

    const updatedPet = await ctx.prisma.pet.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedPet, { headers: corsHeaders });
  } catch (error) {
    console.error('Error updating pet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const ctx = await createContext(req);
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Pet ID is required' }, { status: 400, headers: corsHeaders });
    }

    // Check if pet exists and get current data
    const existingPet = await ctx.prisma.pet.findUnique({
      where: { id }
    });

    if (!existingPet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404, headers: corsHeaders });
    }

    // Check if user has access to this pet's tenant
    const tenantId = ctx.auth.tenantId;
    if (tenantId && existingPet.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Access denied: Pet belongs to different tenant' }, { status: 403, headers: corsHeaders });
    }

    await ctx.prisma.pet.delete({ where: { id } });

    return NextResponse.json({ success: true, id }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error deleting pet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const ctx = await createContext(req);
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Pet ID is required' }, { status: 400, headers: corsHeaders });
    }

    const pet = await ctx.prisma.pet.findUnique({
      where: { id },
      select: { id: true, name: true, species: true, tenantId: true, createdAt: true },
    });

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404, headers: corsHeaders });
    }

    // Check if user has access to this pet's tenant
    const tenantId = ctx.auth.tenantId;
    if (tenantId && pet.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Access denied: Pet belongs to different tenant' }, { status: 403, headers: corsHeaders });
    }

    return NextResponse.json(pet, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching pet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}