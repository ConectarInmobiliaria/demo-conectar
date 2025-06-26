// lib/storage.js
import { getSupabaseAdmin } from './supabaseClient';

export async function uploadPropertyImage(file) {
  // file: objeto File del navegador (en formData) o Buffer, dependiendo de cómo lo envíes
  // En Pages Router, en componente cliente puedes usar supabaseClient directamente:
  //   const { data, error } = await supabaseClient.storage.from(bucket).upload(...)
  // Para centralizar en servidor, en API route:
  const supabaseAdmin = getSupabaseAdmin();
  const bucketName = process.env.SUPABASE_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('Falta SUPABASE_BUCKET_NAME');
  }
  // Si file viene de un form multipart (Node), habría que leer Buffer. 
  // Pero una opción más sencilla: en el cliente, subes directamente con supabaseClient:
  //    supabaseClient.storage.from(bucketName).upload(path, file)
  // y obtienes la URL. Así el servidor no necesita manejar el archivo.
  throw new Error('uploadPropertyImage: preferible subir directamente desde cliente con supabaseClient.upload');
}

