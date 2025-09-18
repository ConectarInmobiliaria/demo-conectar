// app/api/propiedades/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

function formatPrice(value) {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export async function GET(request, { params }) {
  const id = params.id;
  try {
    const prop = await prisma.property.findUnique({
      where: { id },
      include: {
        category: true,
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        inquiries: true,
      },
    });

    if (!prop) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      ...prop,
      price: formatPrice(prop.price),
    });
  } catch (e) {
    console.error('Error obteniendo propiedad:', e);
    return NextResponse.json({ error: 'Error al obtener propiedad' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  if (!['ADMIN', 'CORREDOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Permiso denegado' }, { status: 403 });
  }

  const id = params.id;
  const {
    title,
    description,
    price: rawPrice,
    currency,
    location,
    city,
    address,
    categoryId,
    imageUrl,
    otherImageUrls = [],
    bedrooms,
    bathrooms,
    garage,
    expenses,
    videoUrl,
  } = await request.json();

  if (!title || !description || rawPrice == null || !location || !city || !address || !categoryId) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
  }

  const price = parseFloat(String(rawPrice).replace(/\./g, '').replace(/,/g, '.'));
  if (isNaN(price)) {
    return NextResponse.json({ error: 'Precio inválido' }, { status: 400 });
  }

  if (!['ARS', 'USD'].includes(currency)) {
    return NextResponse.json({ error: 'Moneda inválida' }, { status: 400 });
  }

  try {
    const updated = await prisma.property.update({
      where: { id },
      data: {
        title,
        description,
        price,
        currency,
        location,
        city,
        address,
        categoryId: Number(categoryId),
        imageUrl,
        otherImageUrls,
        bedrooms,
        bathrooms,
        garage,
        expenses,
        videoUrl,
      },
      include: {
        category: true,
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    return NextResponse.json({
      ...updated,
      price: formatPrice(updated.price),
    });
  } catch (e) {
    console.error('Error actualizando propiedad:', e);
    return NextResponse.json({ error: 'Error actualizando propiedad' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const id = params.id;
  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
  }
  if (session.user.role !== 'ADMIN' && session.user.id !== existing.creatorId) {
    return NextResponse.json({ error: 'Permiso denegado' }, { status: 403 });
  }

  try {
    await prisma.property.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error('Error eliminando propiedad:', e);
    return NextResponse.json({ error: 'Error al eliminar propiedad' }, { status: 500 });
  }
}
