import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseClient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const supabase = getSupabaseAdmin();
const TABLE = 'categories';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    console.error('Error fetching categories:', e);
    return NextResponse.json({ error: 'Error al listar categorías' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Permiso denegado' }, { status: 403 });
  }

  const { name } = await request.json();
  if (!name) {
    return NextResponse.json({ error: 'Nombre es requerido' }, { status: 400 });
  }

  try {
    // Comprobar existencia
    const { data: exists, error: errExists } = await supabase
      .from(TABLE)
      .select('id')
      .eq('name', name)
      .single();
    if (errExists && errExists.code !== 'PGRST116') throw errExists;
    if (exists) {
      return NextResponse.json({ error: 'Categoría ya existe' }, { status: 400 });
    }

    // Insertar
    const { data: cat, error } = await supabase
      .from(TABLE)
      .insert({ name })
      .single();
    if (error) throw error;

    return NextResponse.json(cat, { status: 201 });
  } catch (e) {
    console.error('Error creating category:', e);
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 });
  }
}

