// app/api/leads/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const leads = await prisma.lead.findMany({ include: { property: true, agent: true } });
  return NextResponse.json(leads);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const lead = await prisma.lead.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      source: body.source,
      status: body.status || 'nuevo',
      notes: body.notes,
      propertyId: body.propertyId || null,
      agentId: session.user.id,  // asigna al usuario actual
    },
  });
  return NextResponse.json(lead, { status: 201 });
}
