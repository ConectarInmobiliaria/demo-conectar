// app/api/categories/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // import nombrado
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(cats);
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Permiso denegado' }, { status: 403 });
  const body = await request.json();
  const { name } = body;
  if (!name) return NextResponse.json({ error: 'Nombre es requerido' }, { status: 400 });
  try {
    const exists = await prisma.category.findUnique({ where: { name } });
    if (exists) {
      return NextResponse.json({ error: 'Categoría ya existe' }, { status: 400 });
    }
    const cat = await prisma.category.create({ data: { name } });
    return NextResponse.json(cat, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 });
  }
}

