'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  const [categories, setCategories] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const handleImageChange = e => setNewImages(Array.from(e.target.files));

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
          imageUrl: [...currentImages, ...uploaded][0] || null,
          otherImageUrls: [...currentImages, ...uploaded],
          bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
          bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
          garage,
          expenses: expenses ? parseFloat(expenses) : null,
          videoUrl: videoUrl || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      router.push('/dashboard/propiedades');
    } catch (err) {
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
        {/* Campos del formulario, incluyendo moneda */}
      </form>
    </div>
  );
}