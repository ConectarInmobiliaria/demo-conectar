// app/api/appointments/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const appts = await prisma.appointment.findMany({
    include: { property: true, lead: true, client: true, agent: true },
  });
  return NextResponse.json(appts);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { date, propertyId, leadId, clientId, agentId, status } = await request.json();
  const appt = await prisma.appointment.create({
    data: {
      date: new Date(date),
      propertyId,
      leadId: leadId || null,
      clientId: clientId || null,
      agentId: agentId || session.user.id,
      status: status || 'pendiente',
    },
  });
  return NextResponse.json(appt, { status: 201 });
}
