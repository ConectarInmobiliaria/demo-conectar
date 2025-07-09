// app/api/upload-images/route.js
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = getSupabaseAdmin();
const BUCKET = process.env.SUPABASE_BUCKET_NAME;
const BUCKET_URL = process.env.SUPABASE_BUCKET_URL;

// Cargamos una sola vez el buffer de la marca de agua
const watermarkPath = path.join(process.cwd(), 'public', 'marca.png');
const watermarkBuffer = fs.readFileSync(watermarkPath);

export async function POST(request) {
  try {
    const form = await request.formData();
    const files = form.getAll('images');
    if (!files.length) {
      return NextResponse.json({ error: 'No se enviaron archivos' }, { status: 400 });
    }

    const uploadedUrls = [];

    for (const file of files) {
      // 1️⃣ Leemos el buffer original
      const inputBuffer = Buffer.from(await file.arrayBuffer());

      // 2️⃣ Procesamos con Sharp: compositing + webp
      const processedBuffer = await sharp(inputBuffer)
        .composite([{ input: watermarkBuffer, gravity: 'southeast' }])
        .webp({ quality: 80 })
        .toBuffer();

      // 3️⃣ Construimos la clave en el bucket
      const folder = new Date().toISOString().slice(0, 10);
      const key = `${folder}/${uuidv4()}.webp`;

      // 4️⃣ Subimos al bucket usando el service role client
      const { data, error } = await supabase
        .storage
        .from(BUCKET)
        .upload(key, processedBuffer, {
          contentType: 'image/webp',
          upsert: false
        });

      if (error) throw error;

      uploadedUrls.push(`${BUCKET_URL}/${data.path}`);
    }

    return NextResponse.json({ urls: uploadedUrls }, { status: 201 });

  } catch (e) {
    console.error('Error subiendo imágenes:', e);
    return NextResponse.json(
      { error: e.message || 'Error subiendo imágenes' },
      { status: 500 }
    );
  }
}
