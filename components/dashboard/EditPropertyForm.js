// components/dashboard/EditPropertyForm.js
'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EditPropertyForm({ property }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState(property.title);
  const [description, setDescription] = useState(property.description);
  const [price, setPrice] = useState(property.price.toString());
  const [location, setLocation] = useState(property.location);
  const [categoryId, setCategoryId] = useState(property.categoryId.toString());
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(property.imageUrl || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data || []))
      .catch(err => console.error('Error cargando categorías:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      setErrorMsg('Debes iniciar sesión');
      return;
    }
    setErrorMsg('');
    if (!title || !description || !price || !location || !categoryId) {
      setErrorMsg('Completa todos los campos');
      return;
    }
    setLoading(true);
    let imageUrl = currentImageUrl;
    try {
      if (imageFile) {
        // subir nueva imagen
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabaseClient.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME)
          .upload(`propiedades/${fileName}`, imageFile);
        if (uploadError) throw new Error(uploadError.message);
        imageUrl = `${process.env.SUPABASE_BUCKET_URL}/propiedades/${fileName}`;
      }
      const res = await fetch(`/api/propiedades/${property.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          location,
          categoryId: parseInt(categoryId, 10),
          imageUrl,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al actualizar propiedad');
      router.push('/dashboard/propiedades');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Editar Propiedad</h1>
      {errorMsg && <p className="text-danger">{errorMsg}</p>}
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ubicación</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
          >
            <option value="">Selecciona categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen actual</label><br />
          {currentImageUrl && typeof currentImageUrl === 'string' && currentImageUrl.trim() !== '' ? (
            // Usamos Next.js Image para optimizar
            <div style={{ maxWidth: '200px', position: 'relative', height: 'auto' }}>
              <Image
                src={currentImageUrl}
                alt={`Imagen de ${title || 'propiedad'}`}
                width={200}
                height={120}
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <p className="text-muted">No hay imagen</p>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Cambiar imagen</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={e => { if (e.target.files?.[0]) setImageFile(e.target.files[0]); }}
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary me-2">
          {loading ? 'Actualizando...' : 'Actualizar Propiedad'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn btn-outline-secondary">
          Cancelar
        </button>
      </form>
    </div>
  );
}
