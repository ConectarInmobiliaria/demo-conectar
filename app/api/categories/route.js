// app/api/categories/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(data);
  } catch (e) {
    console.error('Error fetching categories:', e);
    return NextResponse.json(
      { error: 'Error al listar categorías' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  // tu lógica de creación, igual que antes pero cambiando supabase→prisma:
  const { name } = await request.json();
  if (!name) return NextResponse.json({ error: 'Nombre es requerido' }, { status: 400 });
  try {
    const exists = await prisma.category.findUnique({ where: { name } });
    if (exists) return NextResponse.json({ error: 'Ya existe' }, { status: 400 });
    const cat = await prisma.category.create({ data: { name } });
    return NextResponse.json(cat, { status: 201 });
  } catch (e) {
    console.error('Error creating category:', e);
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 });
  }
}
