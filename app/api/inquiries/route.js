// app/api/inquiries/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }
  const { propertyId, name, email, phone, message } = body;
  if (!propertyId || !name || !email) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
  }
  try {
    const session = await getServerSession(authOptions);
    let userId = null;
    if (session) userId = session.user.id;
    const inq = await prisma.inquiry.create({
      data: {
        propertyId: parseInt(propertyId, 10),
        userId,
        name,
        email,
        phone: phone || null,
        message: message || null,
      },
    });
    return NextResponse.json(inq, { status: 201 });
  } catch (e) {
    console.error('inquiries POST error:', e);
    return NextResponse.json({ error: 'Error al crear solicitud' }, { status: 500 });
  }
}
