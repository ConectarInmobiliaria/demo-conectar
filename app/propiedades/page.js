// app/propiedades/page.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaBed,
  FaBath,
  FaCar,
  FaMapMarkerAlt,
  FaSortAmountDown,
  FaSortAmountUp,
} from 'react-icons/fa';

export default function PropiedadesPage() {
  // Datos crudos y lista mostrada
  const [allProps, setAllProps] = useState([]);
  const [propsList, setPropsList] = useState([]);

  // UI / filtros / estados
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceLow, setPriceLow] = useState(0);
  const [priceHigh, setPriceHigh] = useState(0);
  const [orderBy, setOrderBy] = useState('newest'); // newest, price_asc, price_desc
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [error, setError] = useState('');

  // parsea precio devuelto por la API (ej: "1.234.567,89" o número)
  const parsePrice = (p) => {
    if (p == null) return 0;
    if (typeof p === 'number') return p;
    // remove thousands dot and replace comma decimal
    const s = String(p).trim();
    const n = parseFloat(s.replace(/\./g, '').replace(/,/g, '.').replace(/[^\d.-]/g, ''));
    return isNaN(n) ? 0 : n;
  };

  // obtener categorías + propiedades al montar
  useEffect(() => {
    let mounted = true;
    async function init() {
      setLoading(true);
      try {
        // categorias
        const catRes = await fetch('/api/categories');
        const catJson = await catRes.json();
        if (mounted) setCategories(Array.isArray(catJson) ? catJson : []);

        // propiedades
        const propsRes = await fetch('/api/propiedades');
        const propsJson = await propsRes.json();
        let list = Array.isArray(propsJson) ? propsJson : [];
        list = list.filter((p) => p.published);
        // añadir priceRaw (numérico) y normalizar campos
        const normalized = list.map((p) => ({
          ...p,
          priceRaw: parsePrice(p.price ?? p.priceRaw ?? p.price), // some endpoints may already have numeric
        }));

        if (!mounted) return;

        setAllProps(normalized);

        // calcular maxPrice
        const prices = normalized.map((x) => x.priceRaw || 0);
        const mx = prices.length ? Math.max(...prices) : 0;
        setMaxPrice(Math.ceil(mx));
        setPriceHigh(Math.ceil(mx));
        setPriceLow(0);
        setMinPrice(0);

        // lista mostrada inicial (los mas recientes primero)
        const initial = normalized.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPropsList(initial);

      } catch (err) {
        console.error('Error cargando propiedades/categorías:', err);
        setError('Ocurrió un error cargando propiedades. Ver consola para detalles.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => { mounted = false; };
  }, []);

  // toggle categoria seleccionada
  const toggleCat = (id) => {
    setSelectedCats((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  // filtro client-side (rápido y predecible)
  const applyFilters = () => {
    setLoading(true);
    try {
      let filtered = allProps.slice();

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((p) =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
        );
      }

      if (location) {
        const q = location.toLowerCase();
        filtered = filtered.filter((p) =>
          (p.location || '').toLowerCase().includes(q) ||
          (p.city || '').toLowerCase().includes(q) ||
          (p.address || '').toLowerCase().includes(q)
        );
      }

      if (selectedCats.length) {
        filtered = filtered.filter((p) => selectedCats.includes(Number(p.categoryId)));
      }

      // precio
      filtered = filtered.filter((p) => {
        const pr = p.priceRaw || 0;
        return pr >= Number(priceLow || 0) && pr <= Number(priceHigh || maxPrice || 0);
      });

      // ordenar
      if (orderBy === 'newest') {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (orderBy === 'price_asc') {
        filtered.sort((a, b) => (a.priceRaw || 0) - (b.priceRaw || 0));
      } else if (orderBy === 'price_desc') {
        filtered.sort((a, b) => (b.priceRaw || 0) - (a.priceRaw || 0));
      }

      setPropsList(filtered);
    } catch (err) {
      console.error('Error aplicando filtros:', err);
      setError('Error aplicando filtros');
    } finally {
      setLoading(false);
    }
  };

  // manejar submit del formulario de búsqueda
  const handleSearchSubmit = async (e) => {
    e?.preventDefault?.();
    applyFilters();
  };

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setSelectedCats([]);
    setPriceLow(minPrice || 0);
    setPriceHigh(maxPrice || 0);
    setOrderBy('newest');
    // restaurar lista completa
    const restored = allProps.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setPropsList(restored);
  };

  // texto de clamp para descripción (3 líneas)
  const clampStyle = {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  // small helpers para formatear
  const fmtPrice = (p, currency) => {
    const num = parseFloat(p) || 0;
    // mostrar con separador de miles y 2 decimales
    return `${currency === 'USD' ? '$' : 'AR$'} ${num.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="container-fluid py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Propiedades</h1>

        {/* Mobile: toggle filtros */}
        <button
          className="btn btn-outline-secondary d-lg-none"
          onClick={() => setShowFiltersMobile((s) => !s)}
          aria-expanded={showFiltersMobile}
        >
          {showFiltersMobile ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>

      <div className="row">
        {/* ===== Formulario de filtros ===== */}
        <aside className={`col-lg-3 mb-4 ${showFiltersMobile ? '' : 'd-none d-lg-block'}`}>
          <form className="p-4 bg-light rounded" onSubmit={handleSearchSubmit}>
            <h5 className="mb-3">Buscar Propiedades</h5>

            <label className="form-label">Palabra clave</label>
            <input
              type="search"
              className="form-control mb-3"
              placeholder="Título o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <label className="form-label">Ubicación</label>
            <input
              type="search"
              className="form-control mb-3"
              placeholder="Ciudad, barrio o dirección..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <label className="form-label">Categorías</label>
            <div className="mb-3" style={{ maxHeight: 160, overflowY: 'auto' }}>
              {categories.length === 0 ? (
                <div className="text-muted small">Cargando categorías...</div>
              ) : (
                categories.map((cat) => (
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
                ))
              )}
            </div>

            <label className="form-label">
              Precio: <strong>{(priceLow || 0).toLocaleString()} – {(priceHigh || 0).toLocaleString()}</strong>
            </label>
            <div className="mb-3">
              {/* sliders dobles (dos ranges) */}
              <input
                type="range"
                className="form-range mb-2"
                min={minPrice}
                max={maxPrice}
                value={priceLow}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setPriceLow(Math.min(v, priceHigh));
                }}
              />
              <input
                type="range"
                className="form-range"
                min={minPrice}
                max={maxPrice}
                value={priceHigh}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setPriceHigh(Math.max(v, priceLow));
                }}
              />
              <div className="d-flex gap-2 mt-2">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={priceLow}
                  onChange={(e) => setPriceLow(Number(e.target.value || 0))}
                  min={minPrice}
                  max={maxPrice}
                />
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={priceHigh}
                  onChange={(e) => setPriceHigh(Number(e.target.value || maxPrice))}
                  min={minPrice}
                  max={maxPrice}
                />
              </div>
            </div>

            <label className="form-label">Ordenar por</label>
            <select className="form-select mb-3" value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
              <option value="newest">Más recientes</option>
              <option value="price_asc">Precio (menor → mayor)</option>
              <option value="price_desc">Precio (mayor → menor)</option>
            </select>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Aplicando filtros...' : 'Buscar'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={handleReset} disabled={loading}>
                Resetear filtros
              </button>
            </div>
          </form>
        </aside>

        {/* ===== Resultados ===== */}
        <main className="col-lg-9">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3 d-flex justify-content-between align-items-center">
            <div className="text-muted">{loading ? 'Cargando...' : `${propsList.length} resultados`}</div>
            <div className="d-none d-md-flex gap-2 align-items-center">
              <small className="text-muted me-2">Orden</small>
              <button
                className={`btn btn-sm btn-outline-secondary ${orderBy === 'price_desc' ? 'active' : ''}`}
                title="Precio descendente"
                onClick={() => setOrderBy('price_desc')}
              >
                <FaSortAmountDown />
              </button>
              <button
                className={`btn btn-sm btn-outline-secondary ${orderBy === 'price_asc' ? 'active' : ''}`}
                title="Precio ascendente"
                onClick={() => setOrderBy('price_asc')}
              >
                <FaSortAmountUp />
              </button>
              <button
                className={`btn btn-sm btn-outline-secondary ${orderBy === 'newest' ? 'active' : ''}`}
                title="Más recientes"
                onClick={() => setOrderBy('newest')}
              >
                Fecha
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">Cargando resultados...</div>
          ) : propsList.length === 0 ? (
            <div className="text-center text-muted py-5">
              No hay resultados. Ajusta los filtros y haz clic en <strong>Buscar</strong>.
            </div>
          ) : (
            <div className="row g-4">
              {propsList.map((prop) => (
                <div key={prop.id} className="col-md-6 col-xl-4">
                  <div className="card h-100 shadow-sm">
                    <div style={{ position: 'relative', height: 220 }}>
                      {prop.imageUrl ? (
                        <Image
                          src={prop.imageUrl}
                          alt={prop.title}
                          fill
                          sizes="(max-width: 576px) 100vw, 400px"
                          style={{ objectFit: 'cover', borderTopLeftRadius: '.25rem', borderTopRightRadius: '.25rem' }}
                        />
                      ) : (
                        <div
                          className="bg-secondary text-white d-flex align-items-center justify-content-center"
                          style={{ height: '220px' }}
                        >
                          Sin imagen
                        </div>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 className="card-title mb-1" style={{ color: '#111' }}>{prop.title}</h5>
                          <div className="small text-muted">
                            <FaMapMarkerAlt className="me-1" /> {prop.location || prop.city || '-'}
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="badge rounded-pill bg-success text-white">
                            {prop.category?.name || (prop.categoryId ? `Cat ${prop.categoryId}` : '—')}
                          </div>
                        </div>
                      </div>

                      <p className="text-muted mb-2" style={clampStyle}>
                        {prop.description || '—'}
                      </p>

                      <div className="d-flex gap-3 align-items-center mb-3">
                        <div className="small text-muted d-flex align-items-center">
                          <FaBed className="me-1" /> {prop.bedrooms ?? 0}
                        </div>
                        <div className="small text-muted d-flex align-items-center">
                          <FaBath className="me-1" /> {prop.bathrooms ?? 0}
                        </div>
                        <div className="small text-muted d-flex align-items-center">
                          <FaCar className="me-1" /> {prop.garage ? 'Sí' : 'No'}
                        </div>
                      </div>

                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <div className="fw-bold" style={{ color: '#0b6b3a' }}>
                          {fmtPrice(prop.priceRaw ?? prop.price, prop.currency)}
                        </div>

                        <Link href={`/propiedades/${prop.id}`} className="btn btn-sm btn-outline-success">
                          Ver detalles
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
