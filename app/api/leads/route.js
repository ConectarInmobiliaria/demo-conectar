// app/api/leads/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  // Soporte para paginación y filtros opcionales
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const search = searchParams.get('search');
  const status = searchParams.get('status');
  const intent = searchParams.get('intent');

  const where = {};
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName:  { contains: search, mode: 'insensitive' } },
      { email:     { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status;
  if (intent) where.intent = intent;

  const total = await prisma.lead.count({ where });
  const items = await prisma.lead.findMany({
    where,
    include: { agent: true },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ items, total });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const lead = await prisma.lead.create({
    data: {
      firstName:  body.firstName,
      lastName:   body.lastName,
      email:      body.email || null,
      phone:      body.phone || null,
      source:     body.source || null,
      status:     body.status || 'nuevo',
      notes:      body.notes || null,
      propertyId: body.propertyId || null,
      agentId:    session.user.id,
      address:    body.address || null,
      cityZone:   body.cityZone || null,
      intent:     body.intent || null,
    },
  });
  return NextResponse.json(lead, { status: 201 });
}
