// app/api/propiedades/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

function formatPrice(value) {
  if (typeof value !== 'number') return value
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// 🔹 GET -> obtener propiedad por id
export async function GET(_req, { params }) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const prop = await prisma.property.findUnique({
      where: { id },
      include: {
        category: true,
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        inquiries: true,
      },
    })

    if (!prop) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 })
    }

    return NextResponse.json({
      ...prop,
      price: formatPrice(prop.price),
    })
  } catch (e) {
    console.error('Error obteniendo propiedad:', e)
    return NextResponse.json({ error: 'Error al obtener propiedad' }, { status: 500 })
  }
}

// 🔹 PUT -> actualizar propiedad
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    if (!['ADMIN', 'CORREDOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Permiso denegado' }, { status: 403 })
    }

    const resolvedParams = await params
    const id = resolvedParams.id

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const body = await request.json()
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
      published,
    } = body

    if (!title || !description || rawPrice == null || !location || !categoryId) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    const price = parseFloat(String(rawPrice).replace(/\./g, '').replace(/,/g, '.'))
    if (isNaN(price)) {
      return NextResponse.json({ error: 'Precio inválido' }, { status: 400 })
    }

    if (!['ARS', 'USD'].includes(currency)) {
      return NextResponse.json({ error: 'Moneda inválida' }, { status: 400 })
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description.trim(),
        price,
        currency,
        location: location.trim(),
        city: city || null,
        address: address || null,
        categoryId: categoryId,
        imageUrl: imageUrl || null,
        otherImageUrls: Array.isArray(otherImageUrls)
          ? otherImageUrls.filter(Boolean)
          : [],
        bedrooms: bedrooms != null ? parseInt(bedrooms, 10) : null,
        bathrooms: bathrooms != null ? parseInt(bathrooms, 10) : null,
        garage: garage != null ? Boolean(garage) : null,
        expenses: expenses != null ? parseFloat(expenses) : null,
        videoUrl: videoUrl || null,
        published: Boolean(published),
      },
      include: {
        category: true,
        creator: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    })

    return NextResponse.json({
      ...updated,
      price: formatPrice(updated.price),
    })
  } catch (e) {
    console.error('Error actualizando propiedad:', e)
    return NextResponse.json({ error: 'Error actualizando propiedad' }, { status: 500 })
  }
}

// 🔹 DELETE -> eliminar propiedad
export async function DELETE(_req, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const resolvedParams = await params
    const id = resolvedParams.id

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const existing = await prisma.property.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 })
    }

    if (session.user.role !== 'ADMIN' && session.user.id !== existing.creatorId) {
      return NextResponse.json({ error: 'Permiso denegado' }, { status: 403 })
    }

    await prisma.property.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (e) {
    console.error('Error eliminando propiedad:', e)
    return NextResponse.json({ error: 'Error al eliminar propiedad' }, { status: 500 })
  }
}
