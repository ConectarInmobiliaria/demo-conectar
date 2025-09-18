// app/dashboard/propiedades/new/page.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

/**
 * Nueva propiedad (dashboard) - versión con:
 * - previews y reorder de imágenes (drag & drop nativo)
 * - eliminar imágenes antes de publicar
 * - ancho / largo -> metros cuadrados calculados
 * - moneda con símbolos: $ (ARS) y u$d (USD)
 * - NO pide código (se genera en backend)
 */

export default function NewPropertyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Datos principales
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Precio / moneda
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('ARS');

  // Ubicación
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  // Detalles
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [garage, setGarage] = useState(false);
  const [expenses, setExpenses] = useState('');

  // Medidas
  const [width, setWidth] = useState(''); // metros
  const [length, setLength] = useState(''); // metros
  const squareMeters = (() => {
    const w = parseFloat(String(width).replace(',', '.')) || 0;
    const l = parseFloat(String(length).replace(',', '.')) || 0;
    const sqm = w > 0 && l > 0 ? +(w * l).toFixed(2) : null;
    return sqm;
  })();

  // Multimedia / categoría
  const [videoUrl, setVideoUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  // Imágenes: array de objetos { id, file, url }
  const [images, setImages] = useState([]);
  const dragIndexRef = useRef(null);

  // UI
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Cuando se desmonta, revoke object URLs
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.url && img.url.startsWith('blob:')) URL.revokeObjectURL(img.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // Handle archivo(s) seleccionados
  const handleImageChange = e => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const next = files.map((file, i) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${i}`,
      file,
      url: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...next]);
    // limpiar input (si quieres que volver a elegir el mismo archivo funcione)
    e.target.value = '';
  };

  // Eliminar imagen de previews
  const removeImageAt = idx => {
    setImages(prev => {
      const toRemove = prev[idx];
      if (toRemove?.url && toRemove.url.startsWith('blob:')) URL.revokeObjectURL(toRemove.url);
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  };

  // Drag & Drop handlers (HTML5 DnD)
  const onDragStart = (e, idx) => {
    dragIndexRef.current = idx;
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const onDrop = (e, idx) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    const to = idx;
    if (from == null || to == null || from === to) return;
    setImages(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
    dragIndexRef.current = null;
  };

  // También permitir botones para mover arriba/abajo (fallback)
  const moveImage = (from, to) => {
    if (from === to) return;
    setImages(prev => {
      const arr = [...prev];
      if (to < 0 || to >= arr.length) return arr;
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');

    if (status !== 'authenticated') {
      setErrorMsg('Debes iniciar sesión para crear una propiedad');
      return;
    }
    // Validaciones mínimas (YA NO pedimos código)
    if (!title || !description || !price || !location || !city || !address || !categoryId) {
      setErrorMsg('Completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      // Subir imágenes primero (si hay). Respetamos el orden actual en `images`.
      let uploadedUrls = [];
      if (images.length) {
        const formData = new FormData();
        images.forEach(img => formData.append('images', img.file));
        const uploadRes = await fetch('/api/upload-images', { method: 'POST', body: formData });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.error || 'Error subiendo imágenes');
        uploadedUrls = Array.isArray(uploadJson.urls) ? uploadJson.urls : [];
      }

      // Enviamos medidas (width, length, squareMeters) por si el backend las acepta
      const body = {
        title,
        description,
        price: parseFloat(price),
        currency,
        location,
        city,
        address,
        // code: <-- ya no enviamos
        categoryId: parseInt(categoryId, 10),
        imageUrl: uploadedUrls[0] || null,
        otherImageUrls: uploadedUrls,
        bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
        bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
        garage: !!garage,
        expenses: expenses ? parseFloat(expenses) : null,
        videoUrl: videoUrl || null,
        width: width ? parseFloat(String(width).replace(',', '.')) : null,
        length: length ? parseFloat(String(length).replace(',', '.')) : null,
        squareMeters: squareMeters || null,
      };

      const res = await fetch('/api/propiedades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Error al crear propiedad');
      }

      // éxito
      router.push('/dashboard/propiedades');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error inesperado');
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        {/* Precio */}
        <h5 className="mt-4 mb-3">Precio</h5>
        <div className="row g-2 align-items-center">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text">
                {currency === 'USD' ? 'u$d' : '$'}
              </span>
              <input
                type="number"
                className="form-control"
                placeholder="Precio"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
                disabled={loading}
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              disabled={loading}
            >
              <option value="ARS">$ Pesos (ARS)</option>
              <option value="USD">u$d Dólares (USD)</option>
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        {/* Detalles */}
        <h5 className="mt-4 mb-3">Detalles</h5>
        <div className="row g-2">
          {/* Código eliminado del formulario (se genera en backend) */}
          <div className="col-md-3">
            <label className="form-label">Dormitorios</label>
            <input
              type="number"
              className="form-control"
              value={bedrooms}
              onChange={e => setBedrooms(e.target.value)}
              disabled={loading}
              min="0"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Baños</label>
            <input
              type="number"
              className="form-control"
              value={bathrooms}
              onChange={e => setBathrooms(e.target.value)}
              disabled={loading}
              min="0"
            />
          </div>
          <div className="col-md-3 d-flex align-items-center">
            <div className="form-check mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                checked={garage}
                onChange={e => setGarage(e.target.checked)}
                disabled={loading}
              />
              <label className="form-check-label">Cochera</label>
            </div>
          </div>
          <div className="col-md-3">
            <label className="form-label">Expensas</label>
            <input
              type="number"
              className="form-control"
              value={expenses}
              onChange={e => setExpenses(e.target.value)}
              disabled={loading}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Medidas */}
        <h5 className="mt-4 mb-3">Medidas</h5>
        <div className="row g-2 align-items-center">
          <div className="col-md-4">
            <label className="form-label">Ancho (m)</label>
            <input
              type="number"
              className="form-control"
              value={width}
              onChange={e => setWidth(e.target.value)}
              disabled={loading}
              min="0"
              step="0.01"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Largo (m)</label>
            <input
              type="number"
              className="form-control"
              value={length}
              onChange={e => setLength(e.target.value)}
              disabled={loading}
              min="0"
              step="0.01"
            />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <div className="w-100">
              <label className="form-label">Superficie (m²)</label>
              <input
                type="text"
                className="form-control"
                readOnly
                value={squareMeters != null ? `${squareMeters} m²` : ''}
                placeholder="Se calcula automáticamente"
              />
            </div>
          </div>
        </div>

        {/* Multimedia & categoría */}
        <h5 className="mt-4 mb-3">Multimedia</h5>
        <div className="mb-3">
          <label className="form-label">Video (URL de YouTube)</label>
          <input
            type="url"
            className="form-control"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            disabled={loading}
            placeholder="https://www.youtube.com/..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría *</label>
          <select
            className="form-select"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
            disabled={loading}
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
        <h5 className="mt-4 mb-3">Imágenes</h5>
        <div className="mb-3">
          <label className="form-label">Agregar imágenes (arrastrar para reordenar)</label>
          <input
            type="file"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
        </div>

        {images.length > 0 && (
          <div className="mb-4">
            <div className="d-flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="border rounded overflow-hidden position-relative"
                  style={{ width: 140 }}
                  draggable
                  onDragStart={e => onDragStart(e, idx)}
                  onDragOver={e => onDragOver(e, idx)}
                  onDrop={e => onDrop(e, idx)}
                >
                  <img
                    src={img.url}
                    alt={`Preview ${idx + 1}`}
                    style={{ width: '100%', height: 96, objectFit: 'cover', display: 'block' }}
                  />
                  <div className="d-flex justify-content-between p-1 bg-white">
                    <div className="btn-group btn-group-sm" role="group" aria-label="Reorder">
                      <button
                        type="button"
                        className="btn btn-light"
                        title="Mover izquierda"
                        onClick={() => moveImage(idx, idx - 1)}
                        disabled={idx === 0 || loading}
                      >
                        ◀
                      </button>
                      <button
                        type="button"
                        className="btn btn-light"
                        title="Mover derecha"
                        onClick={() => moveImage(idx, idx + 1)}
                        disabled={idx === images.length - 1 || loading}
                      >
                        ▶
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      title="Eliminar"
                      onClick={() => removeImageAt(idx)}
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <small className="text-muted d-block mt-2">
              Arrastra las miniaturas para reordenar. El orden actual será el usado para publicar.
            </small>
          </div>
        )}

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
