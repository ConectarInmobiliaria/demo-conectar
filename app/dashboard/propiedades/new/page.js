// app/dashboard/propiedades/new/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function NewPropertyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('ARS');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [code, setCode] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [garage, setGarage] = useState(false);
  const [expenses, setExpenses] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleImageChange = e => setImages(Array.from(e.target.files));

  const handleSubmit = async e => {
    e.preventDefault();
    if (status !== 'authenticated') return setErrorMsg('Debes iniciar sesión');
    if (!title || !description || !price || !location || !city || !address || !code || !categoryId) {
      return setErrorMsg('Completa todos los campos obligatorios');
    }

    setLoading(true);
    try {
      let uploaded = [];
      if (images.length) {
        const form = new FormData();
        images.forEach(f => form.append('images', f));
        const upRes = await fetch('/api/upload-images', { method: 'POST', body: form });
        const upJson = await upRes.json();
        if (!upRes.ok) throw new Error(upJson.error);
        uploaded = upJson.urls;
      }

      const res = await fetch('/api/propiedades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          currency,
          location,
          city,
          address,
          code,
          categoryId: parseInt(categoryId, 10),
          imageUrl: uploaded[0] || null,
          otherImageUrls: uploaded,
          bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
          bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
          garage,
          expenses: expenses ? parseFloat(expenses) : null,
          videoUrl: videoUrl || null,
        }),
      });
      if (!res.ok) throw new Error('Error al crear propiedad');
      router.push('/dashboard/propiedades');
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Nueva Propiedad</h1>
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="mb-3">
        {/* Datos principales */}
        <h5 className="mb-3">Datos principales</h5>
        <div className="mb-3">
          <label className="form-label">Título *</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción *</label>
          <textarea
            className="form-control"
            rows="4"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Precio */}
        <h5 className="mt-4 mb-3">Precio</h5>
        <div className="row g-2">
          <div className="col-md-8">
            <input
              type="number"
              className="form-control"
              placeholder="Precio"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            >
              <option value="ARS">Pesos (ARS)</option>
              <option value="USD">Dólares (USD)</option>
            </select>
          </div>
        </div>

        {/* Ubicación */}
        <h5 className="mt-4 mb-3">Ubicación</h5>
        <div className="mb-3">
          <label className="form-label">Ciudad *</label>
          <input
            type="text"
            className="form-control"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Localidad / Zona *</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección *</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />
        </div>

        {/* Detalles */}
        <h5 className="mt-4 mb-3">Detalles</h5>
        <div className="row g-2">
          <div className="col-md-3">
            <label className="form-label">Código *</label>
            <input
              type="text"
              className="form-control"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Dormitorios</label>
            <input
              type="number"
              className="form-control"
              value={bedrooms}
              onChange={e => setBedrooms(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Baños</label>
            <input
              type="number"
              className="form-control"
              value={bathrooms}
              onChange={e => setBathrooms(e.target.value)}
            />
          </div>
          <div className="col-md-3 d-flex align-items-center">
            <div className="form-check mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                checked={garage}
                onChange={e => setGarage(e.target.checked)}
              />
              <label className="form-check-label">Cochera</label>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <label className="form-label">Expensas</label>
          <input
            type="number"
            className="form-control"
            value={expenses}
            onChange={e => setExpenses(e.target.value)}
          />
        </div>

        {/* Multimedia */}
        <h5 className="mt-4 mb-3">Multimedia</h5>
        <div className="mb-3">
          <label className="form-label">Video (URL de YouTube)</label>
          <input
            type="url"
            className="form-control"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría *</label>
          <select
            className="form-select"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
          >
            <option value="">Seleccionar categoría</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Imágenes */}
        <div className="mb-4">
          <label className="form-label">Imágenes</label>
          <input
            type="file"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Botones */}
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Guardando...' : 'Crear propiedad'}
          </button>
        </div>
      </form>
    </div>
  );
}
