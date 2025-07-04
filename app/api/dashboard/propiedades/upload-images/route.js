import { NextResponse } from 'next/server';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Configuramos Multer para memoria
const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return NextResponse.error();

  // Ejecutar Multer
  await new Promise((resolve, reject) => {
    upload.array('images')(req, {}, err => {
      if (err) reject(err);
      else resolve();
    });
  });

  const files = req.files;
  const urls = [];

  // Procesar cada archivo con Sharp y guardarlo en /public/uploads
  for (const file of files) {
    const timestamp = Date.now();
    const webpName = `img_${timestamp}_${file.originalname}.webp`;
    const savePath = path.join(process.cwd(), 'public', 'uploads', webpName);

    await sharp(file.buffer)
      .resize(800)         // ancho máximo
      .webp({ quality: 80 })
      .toFile(savePath);

    urls.push(`/uploads/${webpName}`);
  }

  return NextResponse.json({ urls });
}
