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

// Marca de agua
const watermarkPath = path.join(process.cwd(), 'public', 'marca.png');
let watermarkBuffer = null;
try {
  watermarkBuffer = fs.readFileSync(watermarkPath);
} catch (err) {
  console.warn('⚠ No se encontró marca.png en /public, se subirá sin watermark.');
}

export async function POST(request) {
  try {
    const form = await request.formData();
    const files = form.getAll('images');
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No se enviaron archivos' }, { status: 400 });
    }

    const uploadedUrls = [];
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB por archivo

    for (const file of files) {
      // Validar tamaño
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `El archivo ${file.name} excede el límite de 10MB` },
          { status: 413 }
        );
      }

      // 1️⃣ Buffer original
      const inputBuffer = Buffer.from(await file.arrayBuffer());

      // 2️⃣ Procesamos con Sharp
      let sharpInstance = sharp(inputBuffer);
      if (watermarkBuffer) {
        sharpInstance = sharpInstance.composite([{ input: watermarkBuffer, gravity: 'southeast' }]);
      }
      const processedBuffer = await sharpInstance.webp({ quality: 80 }).toBuffer();

      // 3️⃣ Construimos la ruta en el bucket
      const folder = new Date().toISOString().slice(0, 10); // ej: 2025-09-19
      const key = `${folder}/${uuidv4()}.webp`;

      // 4️⃣ Subimos al bucket
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(key, processedBuffer, {
          contentType: 'image/webp',
          upsert: false,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(error.message || 'Error subiendo a Supabase');
      }

      uploadedUrls.push(`${BUCKET_URL}/${data.path}`);
    }

    return NextResponse.json({ urls: uploadedUrls }, { status: 201 });
  } catch (e) {
    console.error('❌ Error subiendo imágenes:', e);
    return NextResponse.json(
      { error: e.message || 'Error subiendo imágenes' },
      { status: 500 }
    );
  }
}
