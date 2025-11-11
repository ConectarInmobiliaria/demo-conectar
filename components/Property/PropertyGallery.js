'use client';

import { useId, useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard } from 'swiper/modules';
import { X } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import '@/styles/property-gallery.css';

/**
 * Galería profesional para mostrar imágenes de propiedades desde Supabase.
 * Compatible con pantalla completa, navegación por teclado, miniaturas,
 * y soporte para URLs absolutas o relativas del bucket.
 */
export default function PropertyGallery({ images = [], title = '' }) {
  const galleryId = useId();
  const [fullscreen, setFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  // 🧩 Tomar dominio Supabase del entorno (sin hardcodear)
  const SUPABASE_URL =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://TU-PROJECT-ID.supabase.co';
  const BUCKET_PATH = `${SUPABASE_URL}/storage/v1/object/public`;

  // ✅ Normalizar URLs
  const normalizedImages = Array.from(
    new Set(
      images
        .filter(Boolean)
        .map((src) =>
          src.startsWith('http') ? src : `${BUCKET_PATH}/${src.replace(/^\/+/, '')}`
        )
    )
  );

  // ⌨️ Navegación con teclado
  const handleKeyDown = useCallback(
    (e) => {
      if (!fullscreen) return;
      if (e.key === 'Escape') setFullscreen(false);
      if (e.key === 'ArrowRight') swiperRef.current?.slideNext();
      if (e.key === 'ArrowLeft') swiperRef.current?.slidePrev();
    },
    [fullscreen]
  );

  useEffect(() => {
    document.body.style.overflow = fullscreen ? 'hidden' : '';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreen, handleKeyDown]);

  if (!normalizedImages.length) return null;

  const openFullscreen = (index) => {
    setActiveIndex(index);
    setFullscreen(true);
  };

  const closeFullscreen = (e) => {
    e?.stopPropagation?.();
    setFullscreen(false);
  };

  const goToSlide = (idx) => {
    setActiveIndex(idx);
    swiperRef.current?.slideTo(idx);
  };

  return (
    <div className="w-full property-gallery-container">
      {/* 🖼️ Galería principal */}
      <Swiper
        modules={[Navigation, Keyboard]}
        navigation
        keyboard={{ enabled: true }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="property-gallery-main"
      >
        {normalizedImages.map((src, idx) => (
          <SwiperSlide key={`${galleryId}-main-${idx}`}>
            <div
              className="relative w-full h-[420px] md:h-[480px] bg-black cursor-pointer"
              onClick={() => openFullscreen(idx)}
            >
              {/* 🔹 Imagen principal */}
              <Image
                src={src}
                alt={`${title || 'Propiedad'} - imagen ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 960px"
                priority={idx === 0}
                style={{ objectFit: 'contain', backgroundColor: '#000' }}
                onError={(e) => {
                  console.error('Error cargando imagen:', src);
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🧩 Miniaturas */}
      {normalizedImages.length > 1 && (
        <div className="property-gallery-thumbs flex gap-2 mt-2 justify-center flex-wrap">
          {normalizedImages.map((src, idx) => (
            <div
              key={`${galleryId}-thumb-${idx}`}
              className={`thumb overflow-hidden rounded-md border ${
                idx === activeIndex
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-gray-300 opacity-80 hover:opacity-100'
              } transition-all cursor-pointer`}
              onClick={() => goToSlide(idx)}
            >
              <Image
                src={src}
                alt={`Miniatura ${idx + 1}`}
                width={96}
                height={64}
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* 🌙 Fullscreen Overlay */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={closeFullscreen}
        >
          {/* Botón cerrar */}
          <button
            onClick={closeFullscreen}
            className="absolute top-6 right-8 text-white hover:text-gray-400 transition"
            aria-label="Cerrar galería"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Swiper fullscreen */}
          <Swiper
            modules={[Navigation, Keyboard]}
            navigation
            keyboard={{ enabled: true }}
            initialSlide={activeIndex}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="w-full h-full"
          >
            {normalizedImages.map((src, idx) => (
              <SwiperSlide key={`${galleryId}-fullscreen-${idx}`}>
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={src}
                    alt={`${title || 'Propiedad'} fullscreen - ${idx + 1}`}
                    fill
                    style={{ objectFit: 'contain' }}
                    priority={idx === activeIndex}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
