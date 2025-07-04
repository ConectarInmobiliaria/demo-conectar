// app/propiedades/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function PropiedadesPage() {
  // Estados
  const [propsList, setPropsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);

  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(0);

  // Al montar: cargar categorías y determinar maxPrice
  useEffect(() => {
    async function init() {
      // Cargar categorías
      const catRes = await fetch('/api/categories');
      const catJson = await catRes.json();
      setCategories(catJson);

      // Sacar precio máximo de todas las propiedades
      const resp = await fetch('/api/propiedades');
      const allProps = await resp.json();
      const prices = allProps.map(p => p.price);
      const mx = Math.max(...prices, 0);
      setMaxPrice(mx);
      setPriceRange([0, mx]);

      // Dejar la lista vacía hasta la primera búsqueda
      setPropsList([]);
    }
    init();
  }, []);

  const toggleCat = id => {
    setSelectedCats(s =>
      s.includes(id) ? s.filter(x => x !== id) : [...s, id]
    );
  };

  const handleSearch = async e => {
    e.preventDefault();
    setLoading(true);

    const q = new URLSearchParams();
    if (search) q.set('q', search);
    if (location) q.set('location', location);
    if (selectedCats.length) q.set('categories', selectedCats.join(','));
    q.set('minPrice', priceRange[0]);
    q.set('maxPrice', priceRange[1]);

    const res = await fetch(`/api/propiedades?${q.toString()}`);
    const data = await res.json();
    setPropsList(data);
    setLoading(false);
  };

  return (
    <div className="container-fluid py-5">
      <div className="row">
        {/* ===== Formulario de filtros ===== */}
        <aside className="col-lg-3 mb-4">
          <form className="p-4 bg-light rounded" onSubmit={handleSearch}>
            <h5 className="mb-3">Buscar Propiedades</h5>

            <label className="form-label">Palabra clave</label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Título o descripción..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <label className="form-label">Ubicación</label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Ciudad o barrio..."
              value={location}
              onChange={e => setLocation(e.target.value)}
            />

            <label className="form-label">Categorías</label>
            <div className="mb-3">
              {categories.map(cat => (
                <div className="form-check" key={cat.id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`cat-${cat.id}`}
                    checked={selectedCats.includes(cat.id)}
                    onChange={() => toggleCat(cat.id)}
                  />
                  <label className="form-check-label" htmlFor={`cat-${cat.id}`}>
                    {cat.name}
                  </label>
                </div>
              ))}
            </div>

            <label className="form-label">
              Precio: ${priceRange[0].toLocaleString()} – ${priceRange[1].toLocaleString()}
            </label>
            <div className="mb-3">
              <input
                type="range"
                className="form-range mb-2"
                min="0"
                max={maxPrice}
                value={priceRange[0]}
                onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
              />
              <input
                type="range"
                className="form-range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], +e.target.value])}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
        </aside>

        {/* ===== Resultados ===== */}
        <main className="col-lg-9">
          {loading ? (
            <p>Cargando resultados...</p>
          ) : propsList.length === 0 ? (
            <p className="text-muted">No hay resultados. Ajusta los filtros y haz clic en Buscar.</p>
          ) : (
            <div className="row g-4">
              {propsList.map(prop => (
                <div key={prop.id} className="col-md-6 col-xl-4">
                  <div className="card h-100 shadow-sm">
                    {prop.imageUrl ? (
                      <Image
                        src={prop.imageUrl}
                        alt={prop.title}
                        width={400}
                        height={250}
                        className="card-img-top"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="bg-secondary text-white d-flex align-items-center justify-content-center"
                        style={{ height: '250px' }}
                      >
                        Sin imagen
                      </div>
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{prop.title}</h5>
                      <p className="text-muted mb-1">{prop.category.name}</p>
                      <p className="mb-2 text-truncate">{prop.description}</p>
                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <span className="fw-bold">
                          {prop.currency === 'USD' ? '$' : 'AR$'}{' '}
                          {prop.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <Link href={`/propiedades/${prop.id}`} className="btn btn-sm btn-primary">
                          Detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

