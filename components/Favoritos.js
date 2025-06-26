// components/Favoritos.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    // Cargar lista de favoritos de localStorage
    const guardados = JSON.parse(localStorage.getItem('favoritos')) || [];
    setFavoritos(guardados);
  }, []);

  const eliminarFavorito = (index) => {
    const nuevos = [...favoritos];
    nuevos.splice(index, 1);
    setFavoritos(nuevos);
    localStorage.setItem('favoritos', JSON.stringify(nuevos));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Mis Favoritos</h1>
      {favoritos.length === 0 ? (
        <p className="text-lg">No tienes propiedades favoritas aún.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {favoritos.map((item, index) => (
              <li key={item.id || index} className="border p-4 rounded-lg shadow-lg flex flex-col md:flex-row">
                {/* Imagen */}
                {item.imageUrl && (
                  <div className="w-full md:w-1/4 mb-4 md:mb-0 md:mr-4">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={400}
                      height={250}
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-gray-600">Ubicación: {item.location}</p>
                    <p className="text-lg font-bold mt-2 text-secondary">${item.price?.toLocaleString()}</p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Link href={`/propiedades/${item.id}`}>
                      <a className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition">
                        Ver detalle
                      </a>
                    </Link>
                    <button
                      onClick={() => eliminarFavorito(index)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
