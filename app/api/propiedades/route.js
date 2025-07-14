// app/api/propiedades/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { customAlphabet } from 'nanoid'

const letters = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 3);
const numbers = customAlphabet('0123456789', 3);

function formatPrice(value) {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export async function GET() {
  try {
    const rows = await prisma.property.findMany({
      include: {
        category: true,
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const data = rows.map(r => ({
      ...r,
      category: r.category,
      creator: r.creator,
      price: formatPrice(r.price),
    }))

    return NextResponse.json(data)
  } catch (e) {
    console.error('Error listing properties:', e)
    return NextResponse.json({ error: 'Error al listar propiedades' }, { status: 500 })
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  if (!['ADMIN', 'CORREDOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Permiso denegado' }, { status: 403 })
  }

  const {
    title,
    description,
    price: rawPrice,
    currency,
    location,
    city,
    address,
    categoryId,
    imageUrl = null,
    otherImageUrls = [],
    bedrooms,
    bathrooms,
    garage,
    expenses,
    videoUrl,
  } = await request.json()

  if (!title || !description || rawPrice == null || !location || !city || !address || !categoryId) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
  }

  const price = parseFloat(String(rawPrice).replace(/\./g, '').replace(/,/g, '.'))
  if (isNaN(price)) {
    return NextResponse.json({ error: 'Precio inválido' }, { status: 400 })
  }

  if (!['ARS', 'USD'].includes(currency)) {
    return NextResponse.json({ error: 'Moneda inválida' }, { status: 400 })
  }

  let code;
  do {
    code = letters() + numbers();
    const existing = await prisma.property.findUnique({ where: { code } });
    if (!existing) break;
  } while (true);

  try {
    const created = await prisma.property.create({
      data: {
        title,
        description,
        price,
        currency,
        location,
        city,
        address,
        categoryId: Number(categoryId),
        creatorId: session.user.id,
        imageUrl,
        otherImageUrls,
        bedrooms,
        bathrooms,
        garage,
        expenses,
        videoUrl,
        code,
      },
      include: {
        category: true,
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    })

    return NextResponse.json(
      {
        ...created,
        price: formatPrice(created.price),
      },
      { status: 201 }
    )
  } catch (e) {
    console.error('Error creando propiedad:', e)
    return NextResponse.json({ error: 'Error al crear propiedad' }, { status: 500 })
  }
}
