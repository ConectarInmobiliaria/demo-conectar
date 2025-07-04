// app/api/propiedades/route.js
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseClient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

const supabase = getSupabaseAdmin();
const TABLE = 'properties';

// Helper para formatear precio
function formatPrice(value) {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select(`*, category(name), creator(id, name, email)`);
    if (error) throw error;

    const formatted = data.map(item => ({
      ...item,
      price: formatPrice(item.price),
    }));
    return NextResponse.json(formatted);
  } catch (e) {
    console.error('Error listing properties:', e);
    return NextResponse.json({ error: 'Error al listar propiedades' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  if (!['ADMIN', 'CORREDOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Permiso denegado' }, { status: 403 });
  }

  const {
    title,
    description,
    price: priceRaw,
    currency,
    location,
    categoryId,
    imageUrl,
    otherImageUrls,
  } = await request.json();

  if (!title || !description || priceRaw == null || !location || !categoryId) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
  }

  const price = parseFloat(
    String(priceRaw)
      .replace(/\./g, '')
      .replace(/,/g, '.')
  );
  if (isNaN(price)) {
    return NextResponse.json({ error: 'Precio inválido' }, { status: 400 });
  }
  if (!['ARS', 'USD'].includes(currency)) {
    return NextResponse.json({ error: 'Moneda inválida' }, { status: 400 });
  }

  try {
    // SKU corto: P-XXXXXX
    const id = `P-${uuidv4().split('-')[0].toUpperCase()}`;

    const { data: prop, error } = await supabase
      .from(TABLE)
      .insert({
        id,
        title,
        description,
        price,
        currency,
        location,
        categoryId: Number(categoryId),
        creatorId: session.user.id,
        imageUrl: imageUrl || null,
        otherImageUrls: otherImageUrls || [],
      })
      // solicitamos la fila creada
      .select(`*, category(name), creator(id, name, email)`)
      .single();

    if (error) throw error;
    // formateamos el price
    prop.price = formatPrice(prop.price);

    return NextResponse.json(prop, { status: 201 });
  } catch (e) {
    console.error('Error creando propiedad:', e);
    return NextResponse.json({ error: 'Error al crear propiedad' }, { status: 500 });
  }
}
