'use client';

import { useState, useEffect } from 'react';
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
  // Datos y estados
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

  // Estados UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Función: parsear precios (string → number)
  const parsePrice = (p) => {
    if (p == null) return 0;
    if (typeof p === 'number') return p;
    const s = String(p).trim();
    const n = parseFloat(s.replace(/\./g, '').replace(/,/g, '.').replace(/[^\d.-]/g, ''));
    return isNaN(n) ? 0 : n;
  };

  // 🧭 Cargar categorías y propiedades
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        setLoading(true);
        const [catRes, propRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/propiedades'),
        ]);

        const [catJson, propsJson] = await Promise.all([
          catRes.json(),
          propRes.json(),
        ]);

        if (!mounted) return;

        const cats = Array.isArray(catJson) ? catJson : [];
        const props = Array.isArray(propsJson) ? propsJson : [];

        // Solo propiedades publicadas
        const published = props.filter((p) => p.published);

        // Normalizar
        const normalized = published.map((p) => ({
          ...p,
          priceRaw: parsePrice(p.price),
        }));

        // Calcular rango de precios
        const prices = normalized.map((x) => x.priceRaw || 0);
        const max = prices.length ? Math.max(...prices) : 0;

        setCategories(cats);
        setAllProps(normalized);
        setPropsList(normalized);
        setMinPrice(0);
        setMaxPrice(Math.ceil(max));
        setPriceLow(0);
        setPriceHigh(Math.ceil(max));
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('No se pudieron cargar las propiedades.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // 🔁 Toggle de categoría
  const toggleCat = (id) => {
    setSelectedCats((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  };

  // 💰 Formatear precio con moneda
  const fmtPrice = (price, currency) => {
    const p = parseFloat(price) || 0;
    if (p <= 0) return 'Consultar';
    const prefix = currency === 'USD' ? 'U$D' : 'AR$';
    return `${prefix} ${p.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // 🔍 Aplicar filtros
  const applyFilters = () => {
    setLoading(true);
    try {
      let filtered = allProps.slice();

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            (p.title || '').toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q)
        );
      }

      if (location) {
        const q = location.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            (p.location || '').toLowerCase().includes(q) ||
            (p.city || '').toLowerCase().includes(q) ||
            (p.address || '').toLowerCase().includes(q)
        );
      }

      if (selectedCats.length) {
        filtered = filtered.filter((p) =>
          selectedCats.includes(Number(p.categoryId))
        );
      }

      // Rango de precios
      filtered = filtered.filter((p) => {
        const pr = p.priceRaw || 0;
        return pr >= Number(priceLow) && pr <= Number(priceHigh);
      });

      // Orden
      if (orderBy === 'newest')
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (orderBy === 'price_asc')
        filtered.sort((a, b) => (a.priceRaw || 0) - (b.priceRaw || 0));
      if (orderBy === 'price_desc')
        filtered.sort((a, b) => (b.priceRaw || 0) - (a.priceRaw || 0));

      setPropsList(filtered);
    } catch (err) {
      console.error('Error aplicando filtros:', err);
      setError('Error aplicando filtros.');
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Reset filtros
  const handleReset = () => {
    setSearch('');
    setLocation('');
    setSelectedCats([]);
    setPriceLow(minPrice);
    setPriceHigh(maxPrice);
    setOrderBy('newest');
    setPropsList(allProps.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  // 📏 Clamp estilo descripción
  const clampStyle = {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  return (
    <div className="container-fluid py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Propiedades</h1>
        <button
          className="btn btn-outline-secondary d-lg-none"
          onClick={() => setShowFiltersMobile((s) => !s)}
        >
          {showFiltersMobile ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>

      <div className="row">
        {/* ==== FILTROS ==== */}
        <aside className={`col-lg-3 mb-4 ${showFiltersMobile ? '' : 'd-none d-lg-block'}`}>
          <form
            className="p-4 bg-light rounded"
            onSubmit={(e) => {
              e.preventDefault();
              applyFilters();
            }}
          >
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
              placeholder="Ciudad o barrio..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <label className="form-label">Categorías</label>
            <div className="mb-3" style={{ maxHeight: 160, overflowY: 'auto' }}>
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

            {/* Filtros de precio */}
            <label className="form-label">
              Precio: <strong>{priceLow.toLocaleString()} – {priceHigh.toLocaleString()}</strong>
            </label>
            <input
              type="range"
              className="form-range mb-2"
              min={minPrice}
              max={maxPrice}
              value={priceLow}
              onChange={(e) => setPriceLow(Number(e.target.value))}
            />
            <input
              type="range"
              className="form-range"
              min={minPrice}
              max={maxPrice}
              value={priceHigh}
              onChange={(e) => setPriceHigh(Number(e.target.value))}
            />

            <label className="form-label mt-3">Ordenar por</label>
            <select
              className="form-select mb-3"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
            >
              <option value="newest">Más recientes</option>
              <option value="price_asc">Precio (menor → mayor)</option>
              <option value="price_desc">Precio (mayor → menor)</option>
            </select>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-success">
                Buscar
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleReset}
              >
                Resetear filtros
              </button>
            </div>
          </form>
        </aside>

        {/* ==== RESULTADOS ==== */}
        <main className="col-lg-9">
          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="text-center py-5">Cargando propiedades...</div>
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
                        <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '220px' }}>
                          Sin imagen
                        </div>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 className="card-title mb-1" style={{ color: '#111' }}>
                            {prop.title || 'Propiedad sin título'}
                          </h5>
                          <div className="small text-muted">
                            <FaMapMarkerAlt className="me-1" /> {prop.location || prop.city || '-'}
                          </div>
                        </div>
                        <div className="badge rounded-pill bg-success text-white">
                          {prop.category?.name || '—'}
                        </div>
                      </div>

                      <p className="text-muted mb-2" style={clampStyle}>
                        {prop.description || 'Sin descripción disponible'}
                      </p>

                      <div className="d-flex gap-3 align-items-center mb-3 text-muted small">
                        <span><FaBed className="me-1" /> {prop.bedrooms ?? 0}</span>
                        <span><FaBath className="me-1" /> {prop.bathrooms ?? 0}</span>
                        <span><FaCar className="me-1" /> {prop.garage ? 'Sí' : 'No'}</span>
                      </div>

                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <div className="fw-bold text-success">
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
