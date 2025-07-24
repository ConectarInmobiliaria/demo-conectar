// app/api/leads/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request, context) {
  // Next.js: context.params is a promise
  const params = await context.params;
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: { property: true, agent: true },
  });
  return NextResponse.json(
    lead || { error: 'No encontrado' },
    { status: lead ? 200 : 404 }
  );
}

export async function PUT(request, context) {
  // Next.js: context.params is a promise
  const params = await context.params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json();
  const updated = await prisma.lead.update({
    where: { id: params.id },
    data: {
      firstName:  body.firstName,
      lastName:   body.lastName,
      email:      body.email || null,
      phone:      body.phone || null,
      source:     body.source || null,
      status:     body.status,
      notes:      body.notes || null,
      propertyId: body.propertyId || null,
      agentId:    session.user.id,
      address:    body.address || null,
      cityZone:   body.cityZone || null,
      intent:     body.intent || null,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(request, context) {
  // Next.js: context.params is a promise
  const params = await context.params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  await prisma.lead.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}