// app/api/appointments/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  const appt = await prisma.appointment.findUnique({
    where: { id: params.id },
    include: { property: true, lead: true, client: true, agent: true },
  });
  return NextResponse.json(appt || { error: 'No encontrado' }, { status: appt ? 200 : 404 });
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const updated = await prisma.appointment.update({
    where: { id: params.id },
    data: {
      date: new Date(body.date),
      propertyId: body.propertyId,
      leadId: body.leadId,
      clientId: body.clientId,
      agentId: body.agentId,
      status: body.status,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  await prisma.appointment.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
