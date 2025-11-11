// components/Gallery/SwiperGallery.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import 'swiper/css/thumbs';
import '@/../public/styles/swiper-gallery.css';

export default function SwiperGallery({ images = [], title = '' }) {
  // 🔹 Asegurar URLs válidas y sin duplicados
  const uniqueImages = Array.from(
    new Set(
      images
        .filter(Boolean)
        .map((src) =>
          src.startsWith('http')
            ? src
            : `https://<TU-PROJECT-ID>.supabase.co/storage/v1/object/public/${src}`
        )
    )
  );

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(null);

  // 🔹 Atajos de teclado
  const handleKeyDown = useCallback(
    (e) => {
      if (fullscreenIndex === null) return;
      if (e.key === 'Escape') setFullscreenIndex(null);
      if (e.key === 'ArrowRight')
        setFullscreenIndex((prev) => (prev + 1) % uniqueImages.length);
      if (e.key === 'ArrowLeft')
        setFullscreenIndex((prev) =>
          prev === 0 ? uniqueImages.length - 1 : prev - 1
        );
    },
    [fullscreenIndex, uniqueImages.length]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!uniqueImages.length) return null;

  const openFullscreen = (index) => setFullscreenIndex(index);
  const closeFullscreen = () => setFullscreenIndex(null);
  const nextImage = () =>
    setFullscreenIndex((prev) => (prev + 1) % uniqueImages.length);
  const prevImage = () =>
    setFullscreenIndex((prev) =>
      prev === 0 ? uniqueImages.length - 1 : prev - 1
    );

  return (
    <div className="card p-4 shadow-sm mb-5">
      <h5 className="mb-3 text-center text-primary">Galería de Imágenes</h5>

      {/* Swiper principal */}
      <Swiper
        modules={[Navigation, Pagination, Zoom, Thumbs]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        zoom
        thumbs={{ swiper: thumbsSwiper }}
        className="mb-3"
        style={{ borderRadius: '8px', overflow: 'hidden' }}
      >
        {uniqueImages.map((src, i) => (
          <SwiperSlide key={`main-${i}`}>
            <div
              className="swiper-zoom-container position-relative"
              style={{
                width: '100%',
                height: '400px',
                cursor: 'pointer',
                backgroundColor: '#000',
              }}
              onClick={() => openFullscreen(i)}
            >
              <Image
                src={src}
                alt={`${title || 'Propiedad'} imagen ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'contain' }}
                className="rounded"
                priority={i === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Miniaturas */}
      {uniqueImages.length > 1 && (
        <div className="swiper-thumbnails">
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={Math.min(uniqueImages.length, 5)}
            watchSlidesProgress
          >
            {uniqueImages.map((src, i) => (
              <SwiperSlide key={`thumb-${i}`}>
                <div
                  className="position-relative"
                  style={{
                    width: '100%',
                    height: '80px',
                    cursor: 'pointer',
                  }}
                  onClick={() => openFullscreen(i)}
                >
                  <Image
                    src={src}
                    alt={`Miniatura ${i + 1}`}
                    fill
                    sizes="80px"
                    className="img-thumbnail rounded"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Fullscreen / Lightbox */}
      {fullscreenIndex !== null && (
        <div
          className="fullscreen-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          {/* Cerrar */}
          <button
            onClick={closeFullscreen}
            style={{
              position: 'absolute',
              top: '20px',
              right: '30px',
              fontSize: '2rem',
              color: '#fff',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Anterior */}
          {uniqueImages.length > 1 && (
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '2.5rem',
                color: '#fff',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Anterior"
            >
              ‹
            </button>
          )}

          {/* Imagen */}
          <div
            className="position-relative"
            style={{
              width: '90%',
              height: '90%',
              cursor: 'zoom-out',
            }}
            onClick={closeFullscreen}
          >
            <Image
              src={uniqueImages[fullscreenIndex]}
              alt={`Imagen ${fullscreenIndex + 1}`}
              fill
              sizes="100vw"
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          {/* Siguiente */}
          {uniqueImages.length > 1 && (
            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '2.5rem',
                color: '#fff',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Siguiente"
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}
