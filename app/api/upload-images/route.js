// app/api/upload-images/route.js
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = getSupabaseAdmin();
const BUCKET = process.env.SUPABASE_BUCKET_NAME;
const BUCKET_URL = process.env.SUPABASE_BUCKET_URL;

export async function POST(request) {
  try {
    const form = await request.formData();
    const files = form.getAll('images');
    if (!files.length) {
      return NextResponse.json({ error: 'No se enviaron archivos' }, { status: 400 });
    }

    const urls = [];
    for (const file of files) {
      // Carpeta por fecha
      const folder = new Date().toISOString().split('T')[0];
      // Extensión real
      const ext = file.name.split('.').pop();
      // Nombre único
      const filename = `${uuidv4()}.${ext}`;
      const pathInBucket = `${folder}/${filename}`;

      // Sube al bucket Supabase
      const { data, error } = await supabase
        .storage
        .from(BUCKET)
        .upload(pathInBucket, file, { upsert: false });

      if (error) {
        console.error('Error al subir a Supabase:', error);
        throw new Error(error.message);
      }

      // Construye URL pública
      urls.push(`${BUCKET_URL}/${data.path}`);
    }

    return NextResponse.json({ urls }, { status: 201 });
  } catch (e) {
    console.error('Error subiendo imágenes:', e);
    return NextResponse.json({ error: e.message || 'Error subiendo imágenes' }, { status: 500 });
  }
}
