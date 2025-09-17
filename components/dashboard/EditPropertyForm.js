'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { X, GripVertical } from 'lucide-react';

export default function EditPropertyForm({ property }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Campos
  const [title, setTitle] = useState(property.title || '');
  const [description, setDescription] = useState(property.description || '');
  const [price, setPrice] = useState(property.price?.toString() || '');
  const [currency, setCurrency] = useState(property.currency || 'ARS');
  const [location, setLocation] = useState(property.location || '');
  const [city, setCity] = useState(property.city || '');
  const [address, setAddress] = useState(property.address || '');
  const [bedrooms, setBedrooms] = useState(property.bedrooms ?? '');
  const [bathrooms, setBathrooms] = useState(property.bathrooms ?? '');
  const [garage, setGarage] = useState(Boolean(property.garage));
  const [expenses, setExpenses] = useState(property.expenses?.toString() || '');
  const [videoUrl, setVideoUrl] = useState(property.videoUrl || '');
  const [categoryId, setCategoryId] = useState(property.categoryId?.toString() || '');

  // UI / Aux
  const [categories, setCategories] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Galería: items { id, src, isNew, file? }
  const [gallery, setGallery] = useState(() => {
    const init = (property.otherImageUrls || []).map((url, i) => ({
      id: `cur-${i}-${Math.random().toString(36).slice(2, 8)}`,
      src: url,
      isNew: false,
    }));
    if ((!init.length) && property.imageUrl) {
      init.push({
        id: `cur-main-${Math.random().toString(36).slice(2, 8)}`,
        src: property.imageUrl,
        isNew: false,
      });
    }
    return init;
  });

  const newObjectUrlsRef = useRef([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);

    return () => {
      newObjectUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
      newObjectUrlsRef.current = [];
    };
  }, []);

  // agregar nuevas imágenes
  const handleAddFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newItems = files.map((file, idx) => {
      const objectUrl = URL.createObjectURL(file);
      newObjectUrlsRef.current.push(objectUrl);
      return {
        id: `new-${Date.now()}-${idx}-${Math.random().toString(36).slice(2,6)}`,
        src: objectUrl,
        isNew: true,
        file,
      };
    });

    setGallery(prev => [...prev, ...newItems]);
    e.target.value = '';
  };

  const handleRemoveItem = (id) => {
    setGallery(prev => prev.filter(item => item.id !== id));
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(gallery);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setGallery(items);
  };

  const validate = () => {
    if (status !== 'authenticated') {
      setErrorMsg('Debes iniciar sesión para editar propiedades.');
      return false;
    }
    if (!title || !description || !price || !location || !categoryId) {
      setErrorMsg('Completa todos los campos obligatorios.');
      return false;
    }
    if (!['ARS','USD'].includes(currency)) {
      setErrorMsg('Moneda inválida.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validate()) return;
    setLoading(true);

    try {
      // Subida de nuevas imágenes
      const newItems = gallery.filter(i => i.isNew);
      let uploadedUrls = [];
      if (newItems.length) {
        const form = new FormData();
        newItems.forEach(item => form.append('images', item.file));
        form.append('propertyId', property.id);
        const upRes = await fetch('/api/upload-images', { method: 'POST', body: form });
        const upJson = await upRes.json();
        if (!upRes.ok) throw new Error(upJson.error || 'Error subiendo imágenes');
        uploadedUrls = Array.isArray(upJson.urls) ? upJson.urls : [];
      }

      const uploadedIter = uploadedUrls[Symbol.iterator]();
      const finalOther = gallery
        .map(item => item.isNew ? uploadedIter.next().value : item.src)
        .filter(Boolean);

      const imageUrl = finalOther.length ? finalOther[0] : null;

      const payload = {
        title,
        description,
        price: parseFloat(price),
        currency,
        location,
        city,
        address,
        categoryId: parseInt(categoryId, 10),
        imageUrl,
        otherImageUrls: finalOther,
        bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
        bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
        garage,
        expenses: expenses ? parseFloat(expenses) : null,
        videoUrl: videoUrl || null,
      };

      const res = await fetch(`/api/propiedades/${property.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error actualizando propiedad');

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
      <h1 className="mb-4">Editar Propiedad</h1>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="mb-3">
        <h5 className="mb-3">Datos principales</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Título *</label>
            <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Categoría *</label>
            <select className="form-select" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
              <option value="">Seleccionar categoría</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Descripción *</label>
            <textarea className="form-control" rows={4} value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
        </div>

        <h5 className="mt-4 mb-3">Precio</h5>
        <div className="row g-2">
          <div className="col-md-8">
            <input type="number" step="0.01" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <select className="form-select" value={currency} onChange={e => setCurrency(e.target.value)}>
              <option value="ARS">Pesos (ARS)</option>
              <option value="USD">Dólares (USD)</option>
            </select>
          </div>
        </div>

        <h5 className="mt-4 mb-3">Ubicación</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Ciudad *</label>
            <input className="form-control" value={city} onChange={e => setCity(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Localidad / Zona *</label>
            <input className="form-control" value={location} onChange={e => setLocation(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Dirección *</label>
            <input className="form-control" value={address} onChange={e => setAddress(e.target.value)} required />
          </div>
        </div>

        <h5 className="mt-4 mb-3">Detalles</h5>
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Dormitorios</label>
            <input type="number" className="form-control" value={bedrooms} onChange={e => setBedrooms(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Baños</label>
            <input type="number" className="form-control" value={bathrooms} onChange={e => setBathrooms(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Expensas</label>
            <input type="number" className="form-control" value={expenses} onChange={e => setExpenses(e.target.value)} />
          </div>
          <div className="col-md-3">
            <div className="form-check">
              <input id="garage" type="checkbox" className="form-check-input" checked={garage} onChange={e => setGarage(e.target.checked)} />
              <label htmlFor="garage" className="form-check-label">Cochera</label>
            </div>
          </div>
        </div>

        <h5 className="mt-4 mb-3">Multimedia</h5>
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label">Video (URL de YouTube)</label>
            <input type="url" className="form-control" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
          </div>
        </div>

        <h5 className="mt-4 mb-3">Galería de Imágenes</h5>
        <div className="mb-2">
          <input type="file" accept="image/*" multiple onChange={handleAddFiles} className="form-control" />
          <small className="text-muted">Arrastrá para reordenar. Podés eliminar imágenes antes de guardar.</small>
        </div>

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="gallery" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="d-flex gap-2 overflow-auto py-2 px-1"
                style={{ minHeight: 110 }}
              >
                {gallery.map((item, index) => (
                  <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                    {(draggableProvided) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                        className="position-relative"
                        style={{ width: 140, flex: '0 0 auto' }}
                      >
                        <div className="border rounded overflow-hidden" style={{ width: 140, height: 90, position: 'relative' }}>
                          <Image src={item.src} alt={`img-${index}`} fill style={{ objectFit: 'cover' }} />
                        </div>

                        <div className="d-flex justify-content-between mt-1">
                          <small className="text-muted">{item.isNew ? 'Nueva' : 'Actual'}</small>
                          <div className="d-flex gap-1 align-items-center">
                            <span className="text-muted" title="Arrastrar"><GripVertical size={14} /></span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="btn btn-sm btn-outline-danger"
                              aria-label="Eliminar imagen"
                              title="Eliminar"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="d-flex justify-content-between mt-4">
          <button type="button" className="btn btn-outline-secondary" onClick={() => router.back()} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
