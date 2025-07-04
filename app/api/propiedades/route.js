import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseClient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

const supabase = getSupabaseAdmin();
const TABLE = 'properties';
const BUCKET = process.env.SUPABASE_BUCKET_NAME;

// Helper para formatear precio
function formatPrice(value) {
  // value es número, formatear con separador de miles y coma decimal
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

    // Formatear precio antes de enviar
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

  const form = await request.formData();
  const title = form.get('title');
  const description = form.get('description');
  const priceRaw = form.get('price');
  const currency = form.get('currency');
  const location = form.get('location');
  const categoryId = form.get('categoryId');
  const files = form.getAll('images');

  // Validaciones básicas
  if (!title || !description || !priceRaw || !location || !categoryId) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
  }
  const price = parseFloat(
    String(priceRaw)
      .replace(/\./g, '') // quitar miles
      .replace(/,/g, '.')  // comma a punto decimal
  );
  if (isNaN(price)) {
    return NextResponse.json({ error: 'Precio inválido' }, { status: 400 });
  }
  if (!['ARS', 'USD'].includes(currency)) {
    return NextResponse.json({ error: 'Moneda inválida' }, { status: 400 });
  }

  try {
    // Generar ID único
    const id = uuidv4();
    let imageUrl = null;
    const otherImageUrls = [];

    // Subir imágenes
    for (const file of files) {
      const key = `${id}/${file.name}`;
      const { data, error: errUpload } = await supabase
        .storage.from(BUCKET)
        .upload(key, file, { upsert: true });
      if (errUpload) throw errUpload;
      const publicUrl = `${process.env.SUPABASE_BUCKET_URL}/${data.path}`;
      if (!imageUrl) imageUrl = publicUrl;
      otherImageUrls.push(publicUrl);
    }

    // Insertar propiedad
    const { data: prop, error } = await supabase
      .from(TABLE)
      .insert({
        id,
        title,
        description,
        price,
        currency,
        location,
        categoryId,
        creatorId: session.user.id,
        imageUrl,
        otherImageUrls,
      })
      .single();
    if (error) throw error;

    // Formatear precio antes de retornar
    prop.price = formatPrice(prop.price);
    return NextResponse.json(prop, { status: 201 });
  } catch (e) {
    console.error('Error creando propiedad:', e);
    return NextResponse.json({ error: 'Error al crear propiedad' }, { status: 500 });
  }
}
