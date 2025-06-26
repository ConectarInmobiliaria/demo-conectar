// app/api/propiedades/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // import nombrado
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  const id = parseInt(params.id, 10);
  try {
    const prop = await prisma.property.findUnique({
      where: { id },
      include: { category: true, creator: true, inquiries: true },
    });
    if (!prop) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
    }
    return NextResponse.json(prop);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al obtener propiedad' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const id = parseInt(params.id, 10);
  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
  if (session.user.role !== 'ADMIN' && session.user.id !== existing.creatorId) {
    return NextResponse.json({ error: 'Permiso denegado' }, { status: 403 });
  }
  const body = await request.json();
  const { title, description, price, location, categoryId, imageUrl } = body;
  try {
    const updated = await prisma.property.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        description: description ?? existing.description,
        price: price != null ? parseFloat(price) : existing.price,
        location: location ?? existing.location,
        categoryId: categoryId ? parseInt(categoryId, 10) : existing.categoryId,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al actualizar propiedad' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const id = parseInt(params.id, 10);
  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
  if (session.user.role !== 'ADMIN' && session.user.id !== existing.creatorId) {
    return NextResponse.json({ error: 'Permiso denegado' }, { status: 403 });
  }
  try {
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({}, { status: 204 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Error al eliminar propiedad' }, { status: 500 });
  }
}
