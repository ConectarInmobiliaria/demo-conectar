// app/api/leads/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: { property: true, agent: true },
  });
  return NextResponse.json(lead || { error: 'No encontrado' }, { status: lead ? 200 : 404 });
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const updated = await prisma.lead.update({
    where: { id: params.id },
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      source: body.source,
      status: body.status,
      notes: body.notes,
      propertyId: body.propertyId,
      agentId: body.agentId,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  await prisma.lead.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
