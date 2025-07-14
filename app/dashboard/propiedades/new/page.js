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
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [garage, setGarage] = useState(false);
  const [expenses, setExpenses] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleImageChange = e => setImages(Array.from(e.target.files));

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');
    if (status !== 'authenticated') {
      setErrorMsg('Debes iniciar sesión para crear una propiedad');
      return;
    }
    if (!title || !description || !price || !location || !city || !address || !categoryId) {
      setErrorMsg('Completa todos los campos obligatorios');
      return;
    }

    const numericPrice = parseFloat(price.replace(/,/g, ''));
    const numericExpenses = expenses ? parseFloat(expenses.replace(/,/g, '')) : null;
    if (isNaN(numericPrice)) {
      setErrorMsg('Precio inválido');
      return;
    }

    setLoading(true);
    try {
      let otherImageUrls = [];
      if (images.length) {
        const formData = new FormData();
        images.forEach(img => formData.append('images', img));
        const uploadRes = await fetch('/api/upload-images', { method: 'POST', body: formData });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.error || 'Error subiendo imágenes');
        otherImageUrls = uploadJson.urls;
      }

      const res = await fetch('/api/propiedades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price: numericPrice,
          currency,
          location,
          city,
          address,
          categoryId: parseInt(categoryId, 10),
          imageUrl: otherImageUrls[0] || null,
          otherImageUrls,
          bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
          bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
          garage,
          expenses: numericExpenses,
          videoUrl: videoUrl || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al crear propiedad');

      router.push('/dashboard/propiedades');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Nueva Propiedad</h1>
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Título *</label>
          <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} disabled={loading} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción *</label>
          <textarea className="form-control" rows={4} value={description} onChange={e => setDescription(e.target.value)} disabled={loading} required />
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Precio *</label>
            <input type="text" className="form-control" value={price} onChange={e => setPrice(e.target.value)} disabled={loading} required />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Moneda *</label>
            <select className="form-select" value={currency} onChange={e => setCurrency(e.target.value)} disabled={loading}>
              <option value="ARS">Pesos (ARS)</option>
              <option value="USD">Dólares (USD)</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Ubicación *</label>
            <input type="text" className="form-control" value={location} onChange={e => setLocation(e.target.value)} disabled={loading} required />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Ciudad *</label>
            <input type="text" className="form-control" value={city} onChange={e => setCity(e.target.value)} disabled={loading} required />
          </div>
          <div className="col-md-8 mb-3">
            <label className="form-label">Dirección *</label>
            <input type="text" className="form-control" value={address} onChange={e => setAddress(e.target.value)} disabled={loading} required />
          </div>
        </div>

        <div className="row">
          <div className="col-md-2 mb-3">
            <label className="form-label">Dormitorios</label>
            <input type="number" className="form-control" value={bedrooms} onChange={e => setBedrooms(e.target.value)} disabled={loading} />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">Baños</label>
            <input type="number" className="form-control" value={bathrooms} onChange={e => setBathrooms(e.target.value)} disabled={loading} />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">Garage</label>
            <input type="checkbox" className="form-check-input ms-2" checked={garage} onChange={e => setGarage(e.target.checked)} disabled={loading} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Expensas</label>
            <input type="text" className="form-control" value={expenses} onChange={e => setExpenses(e.target.value)} disabled={loading} />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Video URL</label>
            <input type="url" className="form-control" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} disabled={loading} />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría *</label>
          <select className="form-select" value={categoryId} onChange={e => setCategoryId(e.target.value)} disabled={loading} required>
            <option value="">-- Selecciona categoría --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Imágenes</label>
          <input type="file" accept="image/*" multiple className="form-control" onChange={handleImageChange} disabled={loading} />
        </div>

        <button type="submit" className="btn btn-primary me-2" disabled={loading}>
          {loading ? 'Creando...' : 'Guardar'}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={() => router.back()} disabled={loading}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
