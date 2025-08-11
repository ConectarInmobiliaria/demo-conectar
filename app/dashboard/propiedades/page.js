'use client';

import Link from 'next/link';
import useSWR from 'swr';
import PropertyRow from '@/components/dashboard/PropertyRow';

const fetcher = url => fetch(url).then(res => res.json());

export default function DashboardPropiedadesPage() {
  const { data: properties, error, mutate } = useSWR('/api/propiedades', fetcher);

  if (error) return <p className="text-danger">Error al cargar propiedades</p>;
  if (!properties) return <p>Cargando propiedades...</p>;

  const handleDeleted = id => {
    mutate(properties.filter(p => p.id !== id), false);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Propiedades</h1>
        <Link href="/dashboard/propiedades/new" className="btn btn-primary">
          Nueva Propiedad
        </Link>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Cod. Prop.</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Ubicación</th>
              <th>Creado por</th>
              <th>Publicado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(prop => <PropertyRow key={prop.id} property={prop} onDeleted={handleDeleted}/>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
