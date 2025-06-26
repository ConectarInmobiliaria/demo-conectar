// app/dashboard/propiedades/new/page.js
'use client';
import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient'; // ajusta a tu ruta real
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NewPropertyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Cargar categorías para el select
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
    if (!title || !description || !price || !location || !categoryId) {
      setErrorMsg('Completa todos los campos');
      return;
    }
    setLoading(true);
    let imageUrl = null;
    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabaseClient.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME)
          .upload(`propiedades/${fileName}`, imageFile);
        if (uploadError) {
          throw new Error(uploadError.message);
        }
        imageUrl = `${process.env.SUPABASE_BUCKET_URL}/propiedades/${fileName}`;
      }
      const res = await fetch('/api/propiedades', {
        method: 'POST',
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
      if (!res.ok) {
        throw new Error(json.error || 'Error al crear propiedad');
      }
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
      <h1 className="mb-4">Crear nueva propiedad</h1>
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
          <label className="form-label">Imagen (opcional)</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={e => {
              if (e.target.files?.[0]) setImageFile(e.target.files[0]);
            }}
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Creando...' : 'Crear Propiedad'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn btn-outline-secondary ms-2">
          Cancelar
        </button>
      </form>
    </div>
  );
}
