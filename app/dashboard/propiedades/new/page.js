// app/dashboard/propiedades/new/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function NewPropertyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // States
  const [code, setCode] = useState('');
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
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar categorías
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
        else setCategories([]);
      })
      .catch(console.error);
  }, []);

  // Liberar previews antiguos
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Subida imágenes preview
  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    setImages(files);
    const newUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(newUrls);
  };

  // Submit
  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');

    if (status !== 'authenticated') {
      setErrorMsg('Debes iniciar sesión para crear una propiedad');
      return;
    }
    if (!code || !title || !description || !location || !city || !address || !categoryId) {
      setErrorMsg('Completa todos los campos obligatorios');
      return;
    }
    if (!/^\d{1,8}$/.test(code)) {
      setErrorMsg('El código debe ser solo números (máx 8 dígitos)');
      return;
    }

    const numericPrice = parseFloat(price);
    const numericExpenses = expenses ? parseFloat(expenses) : null;
    if (isNaN(numericPrice)) {
      setErrorMsg('Precio inválido');
      return;
    }

    setLoading(true);
    try {
      // Subida imágenes
      let otherImageUrls = [];
      if (images.length) {
        const formData = new FormData();
        images.forEach(img => formData.append('images', img));
        const uploadRes = await fetch('/api/upload-images', { method: 'POST', body: formData });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.error || 'Error subiendo imágenes');
        otherImageUrls = uploadJson.urls;
      }

      // Crear propiedad
      const res = await fetch('/api/propiedades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Nueva Propiedad</h1>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Código */}
        <div>
          <label className="block text-sm font-medium mb-1">Código de Propiedad *</label>
          <input
            type="number"
            value={code}
            onChange={e => setCode(e.target.value)}
            disabled={loading}
            className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 12345"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Solo números, máx. 8 dígitos</p>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium mb-1">Título *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={loading}
            className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium mb-1">Descripción *</label>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={loading}
            className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Precio + Moneda + Ubicación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio *</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              disabled={loading}
              className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Moneda *</label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              disabled={loading}
              className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ARS">Pesos (ARS)</option>
              <option value="USD">Dólares (USD)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ubicación *</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              disabled={loading}
              className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Ciudad + Dirección */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ciudad *</label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              disabled={loading}
              className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Dirección *</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              disabled={loading}
              className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Dormitorios</label>
            <input
              type="number"
              value={bedrooms}
              onChange={e => setBedrooms(e.target.value)}
              disabled={loading}
              className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Baños</label>
            <input
              type="number"
              value={bathrooms}
              onChange={e => setBathrooms(e.target.value)}
              disabled={loading}
              className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={garage}
              onChange={e => setGarage(e.target.checked)}
              disabled={loading}
              className="mr-2"
            />
            <label className="text-sm font-medium">Garage</label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expensas</label>
            <input
              type="number"
              value={expenses}
              onChange={e => setExpenses(e.target.value)}
              disabled={loading}
              className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Video */}
        <div>
          <label className="block text-sm font-medium mb-1">Video URL</label>
          <input
            type="url"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            disabled={loading}
            placeholder="https://..."
            className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium mb-1">Categoría *</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            disabled={loading}
            required
            className="w-full rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Selecciona categoría --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Imágenes */}
        <div>
          <label className="block text-sm font-medium mb-1">Imágenes</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={loading}
            className="w-full text-sm"
          />
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative w-full h-32 border rounded overflow-hidden">
                  <Image
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            )}
            {loading ? 'Creando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
