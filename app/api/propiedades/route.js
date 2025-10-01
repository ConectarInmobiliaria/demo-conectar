// app/api/propiedades/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { customAlphabet } from 'nanoid'

const letters = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 3)
const numbers = customAlphabet('0123456789', 3)

function formatPrice(value) {
  if (typeof value !== 'number') return value
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
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const data = rows.map(r => ({
      id: r.id,
      code: r.code ?? null,
      title: r.title,
      description: r.description,
      price: formatPrice(r.price),
      currency: r.currency,
      location: r.location,
      city: r.city,
      address: r.address,
      bedrooms: r.bedrooms,
      bathrooms: r.bathrooms,
      garage: r.garage,
      expenses: r.expenses,
      videoUrl: r.videoUrl,
      imageUrl: r.imageUrl,
      otherImageUrls: r.otherImageUrls || [],
      category: r.category ?? null,
      creator: r.creator ?? null,
      createdAt: r.createdAt ? r.createdAt.toISOString() : null,
      updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
      width: r.width,
      length: r.length,
      squareMeters: r.squareMeters,
      published: r.published, // 👈 agregado
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

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const {
    title: rawTitle,
    description: rawDescription,
    price: rawPrice,
    currency,
    location: rawLocation,
    city: rawCity,
    address: rawAddress,
    categoryId: rawCategoryId,
    imageUrl = null,
    otherImageUrls = [],
    bedrooms: rawBedrooms,
    bathrooms: rawBathrooms,
    garage: rawGarage,
    expenses: rawExpenses,
    videoUrl: rawVideoUrl,
    width: rawWidth,
    length: rawLength,
    squareMeters: rawSquareMeters,
    published = true, // 👈 recibido desde frontend
  } = body

  const title = rawTitle ? String(rawTitle).trim() : ''
  const description = rawDescription ? String(rawDescription).trim() : ''
  const location = rawLocation ? String(rawLocation).trim() : ''
  const city = rawCity ? String(rawCity).trim() : ''
  const address = rawAddress ? String(rawAddress).trim() : ''
  const categoryId = rawCategoryId != null ? Number(rawCategoryId) : NaN

  if (!title || !description || rawPrice == null || !location || !categoryId) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
  }

  const cat = await prisma.category.findUnique({ where: { id: Number(categoryId) } })
  if (!cat) {
    return NextResponse.json({ error: 'Categoría inválida' }, { status: 400 })
  }

  const price = parseFloat(String(rawPrice).replace(/\./g, '').replace(/,/g, '.'))
  if (isNaN(price)) {
    return NextResponse.json({ error: 'Precio inválido' }, { status: 400 })
  }

  if (!['ARS', 'USD'].includes(currency)) {
    return NextResponse.json({ error: 'Moneda inválida' }, { status: 400 })
  }

  const otherImageUrlsClean = Array.isArray(otherImageUrls)
    ? otherImageUrls.filter(Boolean).map(x => String(x))
    : []

  let garageVal = null
  if (rawGarage !== undefined && rawGarage !== null) {
    if (typeof rawGarage === 'boolean') garageVal = rawGarage
    else garageVal = ['true', '1'].includes(String(rawGarage).toLowerCase())
  }

  const expenses = rawExpenses != null
    ? parseFloat(String(rawExpenses).replace(/\./g, '').replace(/,/g, '.'))
    : null

  const width = rawWidth != null ? parseFloat(String(rawWidth).replace(',', '.')) : null
  const length = rawLength != null ? parseFloat(String(rawLength).replace(',', '.')) : null
  const squareMeters = rawSquareMeters != null ? parseFloat(String(rawSquareMeters).replace(',', '.')) : null

  // Generación código
  let code = null
  for (let i = 0; i < 10; i++) {
    const candidate = letters() + numbers()
    const existing = await prisma.property.findUnique({ where: { code: candidate } })
    if (!existing) { code = candidate; break }
  }
  if (!code) code = `P${Date.now().toString().slice(-6)}`

  try {
    const created = await prisma.property.create({
      data: {
        title,
        description,
        price,
        currency,
        location,
        city: city || null,
        address: address || null,
        categoryId: Number(categoryId),
        creatorId: session.user.id,
        imageUrl,
        otherImageUrls: otherImageUrlsClean,
        bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
        bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
        garage: garageVal,
        expenses: !isNaN(expenses) ? expenses : null,
        videoUrl: rawVideoUrl || null,
        code,
        width: !isNaN(width) ? width : null,
        length: !isNaN(length) ? length : null,
        squareMeters: !isNaN(squareMeters) ? squareMeters : null,
        published, // 👈 guardamos
      },
      include: {
        category: true,
        creator: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    })

    return NextResponse.json({
      ...created,
      price: formatPrice(created.price),
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    }, { status: 201 })
  } catch (e) {
    console.error('Error creando propiedad:', e)
    return NextResponse.json({ error: 'Error al crear propiedad' }, { status: 500 })
  }
}
