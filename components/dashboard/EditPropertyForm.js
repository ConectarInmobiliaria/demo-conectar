// components/dashboard/EditPropertyForm.js
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function EditPropertyForm({ property }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState(property.title);
  const [description, setDescription] = useState(property.description);
  const [price, setPrice] = useState(property.price?.toString() || '');
  const [currency, setCurrency] = useState(property.currency || 'ARS');
  const [location, setLocation] = useState(property.location || '');
  const [city, setCity] = useState(property.city || '');
  const [address, setAddress] = useState(property.address || '');
  const [code, setCode] = useState(property.code || '');
  const [bedrooms, setBedrooms] = useState(property.bedrooms || '');
  const [bathrooms, setBathrooms] = useState(property.bathrooms || '');
  const [garage, setGarage] = useState(property.garage || false);
  const [expenses, setExpenses] = useState(property.expenses?.toString() || '');
  const [videoUrl, setVideoUrl] = useState(property.videoUrl || '');
  const [categoryId, setCategoryId] = useState(property.categoryId?.toString() || '');
  const [newImages, setNewImages] = useState([]);
  const [currentImages, setCurrentImages] = useState(property.otherImageUrls || []);
  const [published, setPublished] = useState(property.published ?? true); // 👈 estado
  const [categories, setCategories] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Traer categorías
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  // Dropzone
  const onDrop = useCallback(acceptedFiles => {
    setNewImages(prev => [...prev, ...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

  // Reordenar imágenes
  const onDragEnd = result => {
    if (!result.destination) return;
    const reordered = Array.from(currentImages);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setCurrentImages(reordered);
  };

  const removeImage = index => setCurrentImages(imgs => imgs.filter((_, i) => i !== index));
  const removeNewImage = index => setNewImages(imgs => imgs.filter((_, i) => i !== index));

  const handleSubmit = async e => {
    e.preventDefault();
    if (status !== 'authenticated') return setErrorMsg('Debes iniciar sesión');
    if (!title || !description || !price || !location || !city || !address || !code || !categoryId) {
      return setErrorMsg('Completa todos los campos obligatorios');
    }
    setLoading(true);
    try {
      let uploaded = [];
      if (newImages.length) {
        const form = new FormData();
        newImages.forEach(f => form.append('images', f));
        form.append('propertyId', property.id);
        const upRes = await fetch('/api/upload-images', { method: 'POST', body: form });
        const upJson = await upRes.json();
        if (!upRes.ok) throw new Error(upJson.error);
        uploaded = upJson.urls;
      }

      const finalImages = [...currentImages, ...uploaded];

      const res = await fetch(`/api/propiedades/${property.id}`, {
        method: 'PUT',
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
          imageUrl: finalImages[0] || null,
          otherImageUrls: finalImages,
          bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
          bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
          garage,
          expenses: expenses ? parseFloat(expenses) : null,
          videoUrl: videoUrl || null,
          published, // 👈 enviar estado
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al guardar');
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

        {/* Publicar */}
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="publishedSwitch"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="publishedSwitch">
            {published ? 'Propiedad publicada' : 'Propiedad oculta'}
          </label>
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
          <h5 className="mt-4 mb-3">Imágenes actuales</h5>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {provided => (
              <div
                className="d-flex flex-wrap gap-2"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {currentImages.map((img, i) => (
                  <Draggable key={img} draggableId={img} index={i}>
                    {provided => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="position-relative"
                      >
                        <Image
                          src={img}
                          alt={`Imagen ${i}`}
                          width={140}
                          height={100}
                          className="border"
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          onClick={() => removeImage(i)}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Nuevas imágenes con dropzone */}
        <h5 className="mt-4 mb-3">Agregar nuevas imágenes</h5>
        <div
          {...getRootProps()}
          className={`border p-4 text-center ${isDragActive ? 'bg-light' : ''}`}
          style={{ cursor: 'pointer' }}
        >
          <input {...getInputProps()} />
          {isDragActive ? 'Suelta las imágenes aquí...' : 'Arrastra imágenes o haz clic para seleccionar'}
        </div>
        {newImages.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mt-3">
            {newImages.map((file, i) => (
              <div key={i} className="position-relative">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Nueva ${i}`}
                  width={140}
                  height={100}
                  className="border"
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0"
                  onClick={() => removeNewImage(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Botones */}
        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => router.back()}
            disabled={loading}
          >
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
