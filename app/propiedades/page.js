'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaBed,
  FaBath,
  FaCar,
  FaMapMarkerAlt,
} from 'react-icons/fa';

// ─── SEO: metadata estático para la página de listado ────────────────────────
// Este export debe vivir en un archivo separado (layout.js o en un page.js
// Server Component wrapper). Como este archivo es 'use client', copiá esto
// a /app/propiedades/layout.js o creá un wrapper server component.
//
// export const metadata = {
//   title: 'Propiedades en venta y alquiler | Conectar Inmobiliaria',
//   description:
//     'Explorá nuestro catálogo de casas, departamentos y terrenos en venta y alquiler en Misiones y zona. Filtrá por precio, ubicación y tipo de propiedad.',
//   openGraph: {
//     title: 'Propiedades | Conectar Inmobiliaria',
//     description:
//       'Encontrá tu próxima propiedad: casas, departamentos y terrenos en venta y alquiler.',
//     url: 'https://inmobiliariamarcon.com.ar/propiedades',
//     siteName: 'Conectar Inmobiliaria',
//     images: [{ url: 'https://inmobiliariamarcon.com.ar/og-propiedades.jpg' }],
//     type: 'website',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Propiedades | Conectar Inmobiliaria',
//     description: 'Casas, departamentos y terrenos en venta y alquiler en Misiones.',
//   },
//   alternates: {
//     canonical: 'https://inmobiliariamarcon.com.ar/propiedades',
//   },
// };

export default function PropiedadesPage() {
  const [allProps, setAllProps] = useState([]);
  const [propsList, setPropsList] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filtros
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  const [priceLow, setPriceLow] = useState(0);
  const [priceHigh, setPriceHigh] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [orderBy, setOrderBy] = useState('newest');

  // UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // ── Parsear precio (string → number) ──────────────────────────────────────
  const parsePrice = (p) => {
    if (p == null) return 0;
    if (typeof p === 'number') return p;
    const n = parseFloat(
      String(p).trim().replace(/\./g, '').replace(/,/g, '.').replace(/[^\d.-]/g, '')
    );
    return isNaN(n) ? 0 : n;
  };

  // ── Formatear precio con moneda ────────────────────────────────────────────
  const fmtPrice = (price, currency) => {
    const p = parseFloat(price) || 0;
    if (p <= 0) return 'Consultar';
    const prefix = currency === 'USD' ? 'U$D' : 'AR$';
    return `${prefix} ${p.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // ── Cargar datos iniciales ─────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const [catRes, propRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/propiedades'),
        ]);

        if (!catRes.ok || !propRes.ok) throw new Error('Error en la respuesta del servidor.');

        const [catJson, propsJson] = await Promise.all([
          catRes.json(),
          propRes.json(),
        ]);

        if (!mounted) return;

        const cats = Array.isArray(catJson) ? catJson : [];
        const props = Array.isArray(propsJson) ? propsJson : [];

        const normalized = props
          .filter((p) => p.published)
          .map((p) => ({ ...p, priceRaw: parsePrice(p.price) }));

        const prices = normalized.map((x) => x.priceRaw || 0);
        const max = prices.length ? Math.max(...prices) : 0;

        setCategories(cats);
        setAllProps(normalized);
        setPropsList(
          normalized.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
        setMinPrice(0);
        setMaxPrice(Math.ceil(max));
        setPriceLow(0);
        setPriceHigh(Math.ceil(max));
      } catch (err) {
        console.error('Error cargando datos:', err);
        if (mounted) setError('No se pudieron cargar las propiedades. Intentá de nuevo más tarde.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, []);

  // ── Toggle categoría ───────────────────────────────────────────────────────
  const toggleCat = useCallback((id) => {
    setSelectedCats((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }, []);

  // ── Aplicar filtros ────────────────────────────────────────────────────────
  const applyFilters = useCallback(() => {
    setLoading(true);
    try {
      let filtered = allProps.slice();

      if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            (p.title || '').toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q)
        );
      }

      if (location.trim()) {
        const q = location.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            (p.location || '').toLowerCase().includes(q) ||
            (p.city || '').toLowerCase().includes(q) ||
            (p.address || '').toLowerCase().includes(q)
        );
      }

      if (selectedCats.length) {
        filtered = filtered.filter((p) => selectedCats.includes(Number(p.categoryId)));
      }

      filtered = filtered.filter((p) => {
        const pr = p.priceRaw || 0;
        return pr >= Number(priceLow) && pr <= Number(priceHigh);
      });

      if (orderBy === 'newest')
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      else if (orderBy === 'price_asc')
        filtered.sort((a, b) => (a.priceRaw || 0) - (b.priceRaw || 0));
      else if (orderBy === 'price_desc')
        filtered.sort((a, b) => (b.priceRaw || 0) - (a.priceRaw || 0));

      setPropsList(filtered);
    } catch (err) {
      console.error('Error aplicando filtros:', err);
      setError('Error aplicando filtros.');
    } finally {
      setLoading(false);
    }
  }, [allProps, search, location, selectedCats, priceLow, priceHigh, orderBy]);

  // ── Reset filtros ──────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setSearch('');
    setLocation('');
    setSelectedCats([]);
    setPriceLow(minPrice);
    setPriceHigh(maxPrice);
    setOrderBy('newest');
    setPropsList(
      allProps.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  }, [allProps, minPrice, maxPrice]);

  const clampStyle = {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  return (
    <div className="container-fluid py-5">

      {/* ── Encabezado ── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Propiedades</h1>
        <button
          className="btn btn-outline-secondary d-lg-none"
          aria-expanded={showFiltersMobile}
          aria-controls="filtros-panel"
          onClick={() => setShowFiltersMobile((s) => !s)}
        >
          {showFiltersMobile ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>

      <div className="row">

        {/* ══════════════ PANEL DE FILTROS ══════════════ */}
        <aside
          id="filtros-panel"
          aria-label="Filtros de búsqueda"
          className={`col-lg-3 mb-4 ${showFiltersMobile ? '' : 'd-none d-lg-block'}`}
        >
          <form
            className="p-4 bg-light rounded"
            role="search"
            aria-label="Buscar propiedades"
            onSubmit={(e) => {
              e.preventDefault();
              applyFilters();
            }}
          >
            <h2 className="h5 mb-3">Buscar Propiedades</h2>

            {/* Palabra clave */}
            <div className="mb-3">
              <label htmlFor="search-keyword" className="form-label">
                Palabra clave
              </label>
              <input
                id="search-keyword"
                type="search"
                className="form-control"
                placeholder="Título o descripción..."
                value={search}
                autoComplete="off"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Ubicación */}
            <div className="mb-3">
              <label htmlFor="search-location" className="form-label">
                Ubicación
              </label>
              <input
                id="search-location"
                type="search"
                className="form-control"
                placeholder="Ciudad o barrio..."
                value={location}
                autoComplete="off"
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Categorías */}
            <fieldset className="mb-3">
              <legend className="form-label">Categorías</legend>
              <div style={{ maxHeight: 160, overflowY: 'auto' }}>
                {categories.map((cat) => (
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
            </fieldset>

            {/* Rango de precio */}
            <fieldset className="mb-3">
              <legend className="form-label">
                Precio:{' '}
                <strong aria-live="polite">
                  {priceLow.toLocaleString('es-AR')} – {priceHigh.toLocaleString('es-AR')}
                </strong>
              </legend>
              <label htmlFor="price-low" className="visually-hidden">
                Precio mínimo
              </label>
              <input
                id="price-low"
                type="range"
                className="form-range mb-2"
                min={minPrice}
                max={maxPrice}
                value={priceLow}
                aria-label="Precio mínimo"
                onChange={(e) => setPriceLow(Number(e.target.value))}
              />
              <label htmlFor="price-high" className="visually-hidden">
                Precio máximo
              </label>
              <input
                id="price-high"
                type="range"
                className="form-range"
                min={minPrice}
                max={maxPrice}
                value={priceHigh}
                aria-label="Precio máximo"
                onChange={(e) => setPriceHigh(Number(e.target.value))}
              />
            </fieldset>

            {/* Ordenar */}
            <div className="mb-3">
              <label htmlFor="order-by" className="form-label">
                Ordenar por
              </label>
              <select
                id="order-by"
                className="form-select"
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
              >
                <option value="newest">Más recientes</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
              </select>
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-success">
                Buscar
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleReset}
              >
                Limpiar filtros
              </button>
            </div>
          </form>
        </aside>

        {/* ══════════════ RESULTADOS ══════════════ */}
        <main className="col-lg-9" aria-label="Listado de propiedades" aria-live="polite">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-5" aria-busy="true" aria-label="Cargando propiedades">
              <span className="visually-hidden">Cargando propiedades...</span>
              <div className="spinner-border text-success" role="status" />
            </div>
          ) : propsList.length === 0 ? (
            <p className="text-center text-muted py-5">
              No hay resultados. Ajustá los filtros y hacé clic en <strong>Buscar</strong>.
            </p>
          ) : (
            <>
              <p className="text-muted small mb-3">
                {propsList.length} propiedad{propsList.length !== 1 ? 'es' : ''} encontrada
                {propsList.length !== 1 ? 's' : ''}
              </p>
              <ul className="row g-4 list-unstyled">
                {propsList.map((prop) => {
                  const priceLabel = fmtPrice(prop.priceRaw ?? prop.price, prop.currency);
                  const locationLabel = prop.location || prop.city || null;

                  return (
                    <li key={prop.id} className="col-md-6 col-xl-4">
                      <article className="card h-100 shadow-sm">

                        {/* Imagen */}
                        <div style={{ position: 'relative', height: 220 }}>
                          {prop.imageUrl ? (
                            <Image
                              src={prop.imageUrl}
                              alt={`Foto de ${prop.title}`}
                              fill
                              sizes="(max-width: 576px) 100vw, 400px"
                              style={{
                                objectFit: 'cover',
                                borderTopLeftRadius: '.25rem',
                                borderTopRightRadius: '.25rem',
                              }}
                            />
                          ) : (
                            <div
                              className="bg-secondary text-white d-flex align-items-center justify-content-center"
                              style={{ height: '220px' }}
                              aria-label="Sin imagen disponible"
                            >
                              Sin imagen
                            </div>
                          )}
                        </div>

                        <div className="card-body d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h2 className="h5 card-title mb-1" style={{ color: '#111' }}>
                                {prop.title || 'Propiedad sin título'}
                              </h2>
                              {locationLabel && (
                                <address className="small text-muted mb-0" style={{ fontStyle: 'normal' }}>
                                  <FaMapMarkerAlt className="me-1" aria-hidden="true" />
                                  {locationLabel}
                                </address>
                              )}
                            </div>
                            {prop.category?.name && (
                              <span className="badge rounded-pill bg-success text-white">
                                {prop.category.name}
                              </span>
                            )}
                          </div>

                          {prop.description && (
                            <p className="text-muted mb-2 small" style={clampStyle}>
                              {prop.description}
                            </p>
                          )}

                          {/* Características */}
                          <ul
                            className="d-flex gap-3 align-items-center mb-3 text-muted small list-unstyled"
                            aria-label="Características de la propiedad"
                          >
                            <li>
                              <FaBed aria-hidden="true" className="me-1" />
                              <span aria-label={`${prop.bedrooms ?? 0} dormitorios`}>
                                {prop.bedrooms ?? 0}
                              </span>
                            </li>
                            <li>
                              <FaBath aria-hidden="true" className="me-1" />
                              <span aria-label={`${prop.bathrooms ?? 0} baños`}>
                                {prop.bathrooms ?? 0}
                              </span>
                            </li>
                            <li>
                              <FaCar aria-hidden="true" className="me-1" />
                              <span aria-label={prop.garage ? 'Con garage' : 'Sin garage'}>
                                {prop.garage ? 'Sí' : 'No'}
                              </span>
                            </li>
                          </ul>

                          {/* Precio y CTA */}
                          <div className="mt-auto d-flex justify-content-between align-items-center">
                            <strong className="text-success" aria-label={`Precio: ${priceLabel}`}>
                              {priceLabel}
                            </strong>
                            <Link
                              href={`/propiedades/${prop.id}`}
                              className="btn btn-sm btn-outline-success"
                              aria-label={`Ver detalles de ${prop.title}`}
                            >
                              Ver detalles
                            </Link>
                          </div>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </main>
      </div>
    </div>
  );
}