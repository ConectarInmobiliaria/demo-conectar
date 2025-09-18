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
  } catch (err) {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  // Desestructuramos y saneamos
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
  } = body

  const title = rawTitle ? String(rawTitle).trim() : ''
  const description = rawDescription ? String(rawDescription).trim() : ''
  const location = rawLocation ? String(rawLocation).trim() : ''
  const city = rawCity ? String(rawCity).trim() : ''
  const address = rawAddress ? String(rawAddress).trim() : ''
  const categoryId = rawCategoryId != null ? Number(rawCategoryId) : NaN

  // 🔹 Validaciones mínimas (city y address ya no son obligatorios)
  if (!title || !description || rawPrice == null || !location || !categoryId) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
  }

  // Validar categoría existe
  try {
    const cat = await prisma.category.findUnique({ where: { id: Number(categoryId) } })
    if (!cat) {
      return NextResponse.json({ error: 'Categoría inválida' }, { status: 400 })
    }
  } catch (e) {
    console.error('Error validando categoría:', e)
    return NextResponse.json({ error: 'Error validando categoría' }, { status: 500 })
  }

  // Parseo de precio tolerante a "1.234,56" y "1234.56"
  const price = parseFloat(String(rawPrice).replace(/\./g, '').replace(/,/g, '.'))
  if (isNaN(price)) {
    return NextResponse.json({ error: 'Precio inválido' }, { status: 400 })
  }

  if (!['ARS', 'USD'].includes(currency)) {
    return NextResponse.json({ error: 'Moneda inválida' }, { status: 400 })
  }

  // Asegurar otherImageUrls es array de strings
  const otherImageUrlsClean = Array.isArray(otherImageUrls)
    ? otherImageUrls.filter(Boolean).map(x => String(x))
    : []

  // Parseos seguros de campos opcionales
  const bedrooms = rawBedrooms != null ? (Number.isInteger(rawBedrooms) ? rawBedrooms : parseInt(String(rawBedrooms), 10)) : null
  const bathrooms = rawBathrooms != null ? (Number.isInteger(rawBathrooms) ? rawBathrooms : parseInt(String(rawBathrooms), 10)) : null

  // garage puede venir como booleano o string "true"/"false"
  let garageVal = null
  if (rawGarage !== undefined && rawGarage !== null) {
    if (typeof rawGarage === 'boolean') garageVal = rawGarage
    else {
      const s = String(rawGarage).toLowerCase().trim()
      garageVal = s === 'true' || s === '1'
    }
  }

  const expenses = rawExpenses != null ? parseFloat(String(rawExpenses).replace(/\./g, '').replace(/,/g, '.')) : null

  // Nuevos campos geométricos
  const width = rawWidth != null ? parseFloat(String(rawWidth).replace(',', '.')) : null
  const length = rawLength != null ? parseFloat(String(rawLength).replace(',', '.')) : null
  const squareMeters = rawSquareMeters != null ? parseFloat(String(rawSquareMeters).replace(',', '.')) : null

  // Generación del código (evitar loop infinito: límite de intentos)
  let code = null
  const MAX_ATTEMPTS = 10
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = letters() + numbers()
    // comprobamos única
    const existing = await prisma.property.findUnique({ where: { code: candidate } })
    if (!existing) { code = candidate; break }
  }
  if (!code) {
    // fallback si la generación choca muchas veces (extremadamente improbable)
    code = `P${Date.now().toString().slice(-6)}`
  }

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
        imageUrl: imageUrl || null,
        otherImageUrls: otherImageUrlsClean,
        bedrooms: Number.isNaN(bedrooms) ? null : bedrooms,
        bathrooms: Number.isNaN(bathrooms) ? null : bathrooms,
        garage: garageVal,
        expenses: !isNaN(expenses) ? expenses : null,
        videoUrl: rawVideoUrl || null,
        code,
        width: !isNaN(width) ? width : null,
        length: !isNaN(length) ? length : null,
        squareMeters: !isNaN(squareMeters) ? squareMeters : null,
      },
      include: {
        category: true,
        creator: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    })

    // Serializar fechas y formatear price (compatibilidad con frontend existente)
    const resp = {
      ...created,
      price: formatPrice(created.price),
      createdAt: created.createdAt ? created.createdAt.toISOString() : null,
      updatedAt: created.updatedAt ? created.updatedAt.toISOString() : null,
    }

    return NextResponse.json(resp, { status: 201 })
  } catch (e) {
    console.error('Error creando propiedad:', e)
    return NextResponse.json({ error: 'Error al crear propiedad' }, { status: 500 })
  }
}
