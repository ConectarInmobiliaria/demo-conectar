// app/api/upload-images/route.js
import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import sharp from 'sharp';
import path from 'path';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export async function POST(req) {
  // Leemos todo el body como ArrayBuffer y lo envolvemos en un stream de Node
  const buf = await req.arrayBuffer();
  const nodeReq = new Readable();
  nodeReq.push(Buffer.from(buf));
  nodeReq.push(null);
  // Copiamos headers y método
  nodeReq.headers = Object.fromEntries(req.headers.entries());
  nodeReq.method = req.method;

  const form = formidable({ multiples: true, uploadDir: UPLOAD_DIR, keepExtensions: true });
  return new Promise((resolve) => {
    form.parse(nodeReq, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return resolve(
          NextResponse.json({ error: 'Error al procesar el formulario' }, { status: 500 })
        );
      }

      const uploaded = Array.isArray(files.images) ? files.images : [files.images];
      const urls = [];

      for (const file of uploaded) {
        const ext = path.extname(file.filepath);
        const basename = path.basename(file.filepath, ext);
        const webpName = `${basename}.webp`;
        const webpPath = path.join(UPLOAD_DIR, webpName);

        try {
          await sharp(file.filepath)
            .webp({ quality: 80 })
            .toFile(webpPath);
          fs.unlinkSync(file.filepath);
          urls.push(`/uploads/${webpName}`);
        } catch (sharpErr) {
          console.error('Sharp conversion error:', sharpErr);
        }
      }

      resolve(NextResponse.json({ urls }, { status: 201 }));
    });
  });
}
