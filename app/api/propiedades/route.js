// app/api/propiedades/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

// formatea el price a string "1.234,56"
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
  // 1) Autorización
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  if (!['ADMIN', 'CORREDOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Permiso denegado' }, { status: 403 })
  }

  // 2) Payload
  const {
    title,
    description,
    price: rawPrice,
    currency,
    location,
    categoryId,
    imageUrl = null,
    otherImageUrls = [],
  } = await request.json()

  // 3) Validaciones
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

  // 4) Debug: revisá que tu user exista en la tabla `users`
  console.log('▶ crear propiedad, creatorId=', session.user.id)

  try {
    // 5) Crear con Prisma
    const created = await prisma.property.create({
      data: {
        title,
        description,
        price,
        currency,
        location,
        categoryId: Number(categoryId),
        creatorId: session.user.id,
        imageUrl,
        otherImageUrls,
      },
      include: {
        category: true,
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    })

    // 6) Responder con precio formateado
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