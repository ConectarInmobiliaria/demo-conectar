'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard, Thumbs, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/zoom';
import 'swiper/css/thumbs';

/**
 * 🎨 Galería Profesional de Propiedades
 * - Lightbox en pantalla completa
 * - Navegación por teclado (flechas, ESC)
 * - Miniaturas sincronizadas
 * - Contador de imágenes
 * - Zoom en fullscreen
 * - Lazy loading inteligente
 * - Touch gestures
 * - Preloader elegante
 */
export default function PropertyGallery({ images = [], title = '' }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const swiperMainRef = useRef(null);
  const swiperFullscreenRef = useRef(null);

  // ✅ Configurar URL de Supabase
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const BUCKET_BASE = `${SUPABASE_URL}/storage/v1/object/public`;

  // 🧩 Normalizar y limpiar URLs de imágenes
  const normalizedImages = Array.from(
    new Set(
      images
        .filter(Boolean)
        .map((src) => {
          if (src.startsWith('http')) return src;
          return `${BUCKET_BASE}/${src.replace(/^\/+/, '')}`;
        })
    )
  );

  // ⌨️ Navegación por teclado en fullscreen
  const handleKeyDown = useCallback(
    (e) => {
      if (!fullscreen) return;
      
      switch (e.key) {
        case 'Escape':
          setFullscreen(false);
          break;
        case 'ArrowRight':
          swiperFullscreenRef.current?.slideNext();
          break;
        case 'ArrowLeft':
          swiperFullscreenRef.current?.slidePrev();
          break;
      }
    },
    [fullscreen]
  );

  // 🔒 Bloquear scroll del body cuando está en fullscreen
  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreen, handleKeyDown]);

  // 📦 Sincronizar miniaturas al cambiar slide
  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
  };

  // 🖼️ Abrir imagen en fullscreen
  const openFullscreen = (index) => {
    setActiveIndex(index);
    setFullscreen(true);
    setTimeout(() => {
      swiperFullscreenRef.current?.slideTo(index);
    }, 100);
  };

  // ❌ Cerrar fullscreen
  const closeFullscreen = () => {
    setFullscreen(false);
  };

  // 🎯 Ir a un slide específico desde miniatura
  const goToSlide = (index) => {
    setActiveIndex(index);
    swiperMainRef.current?.slideTo(index);
  };

  if (!normalizedImages.length) {
    return (
      <div className="card border-0 shadow-sm p-4">
        <p className="text-muted text-center mb-0">
          No hay imágenes disponibles para esta propiedad
        </p>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        /* 🎨 Animaciones y estilos personalizados */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes zoomIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }

        .property-gallery-main {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          background: #000;
        }

        .property-gallery-main .swiper {
          border-radius: 12px;
        }

        .property-gallery-main .swiper-button-next,
        .property-gallery-main .swiper-button-prev {
          background: rgba(255, 255, 255, 0.9);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          color: #0d6efd;
          transition: all 0.3s ease;
        }

        .property-gallery-main .swiper-button-next:hover,
        .property-gallery-main .swiper-button-prev:hover {
          background: #fff;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .property-gallery-main .swiper-button-next::after,
        .property-gallery-main .swiper-button-prev::after {
          font-size: 20px;
          font-weight: bold;
        }

        .gallery-counter {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          z-index: 10;
          backdrop-filter: blur(4px);
        }

        .property-gallery-thumbs {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          overflow-x: auto;
          padding: 4px 0;
          scrollbar-width: thin;
          scrollbar-color: #0d6efd #e9ecef;
        }

        .property-gallery-thumbs::-webkit-scrollbar {
          height: 6px;
        }

        .property-gallery-thumbs::-webkit-scrollbar-track {
          background: #e9ecef;
          border-radius: 3px;
        }

        .property-gallery-thumbs::-webkit-scrollbar-thumb {
          background: #0d6efd;
          border-radius: 3px;
        }

        .gallery-thumb {
          position: relative;
          width: 100px;
          height: 70px;
          flex-shrink: 0;
          cursor: pointer;
          border-radius: 8px;
          overflow: hidden;
          border: 3px solid transparent;
          transition: all 0.3s ease;
        }

        .gallery-thumb:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .gallery-thumb.active {
          border-color: #0d6efd;
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
        }

        .fullscreen-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        .fullscreen-lightbox .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          color: white;
          font-size: 24px;
          cursor: pointer;
          z-index: 10001;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }

        .fullscreen-lightbox .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(90deg) scale(1.1);
        }

        .fullscreen-lightbox .swiper {
          width: 100%;
          height: 100%;
        }

        .fullscreen-lightbox .swiper-button-next,
        .fullscreen-lightbox .swiper-button-prev {
          background: rgba(255, 255, 255, 0.1);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          color: white;
          backdrop-filter: blur(4px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .fullscreen-lightbox .swiper-button-next:hover,
        .fullscreen-lightbox .swiper-button-prev:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .fullscreen-lightbox .swiper-button-next::after,
        .fullscreen-lightbox .swiper-button-prev::after {
          font-size: 24px;
          font-weight: bold;
        }

        .fullscreen-counter {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          font-size: 16px;
          font-weight: 500;
          z-index: 10001;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .image-loader {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top-color: #0d6efd;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .gallery-counter {
            bottom: 10px;
            right: 10px;
            padding: 6px 12px;
            font-size: 12px;
          }

          .fullscreen-counter {
            bottom: 20px;
            padding: 8px 16px;
            font-size: 14px;
          }

          .gallery-thumb {
            width: 80px;
            height: 56px;
          }
        }
      `}</style>

      {/* 🖼️ GALERÍA PRINCIPAL */}
      <div className="card border-0 shadow-sm p-3 mb-4">
        <div className="property-gallery-main">
          <Swiper
            modules={[Navigation, Keyboard, Thumbs, Zoom]}
            navigation
            keyboard={{ enabled: true }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            zoom={{ maxRatio: 3 }}
            spaceBetween={0}
            slidesPerView={1}
            onSwiper={(swiper) => (swiperMainRef.current = swiper)}
            onSlideChange={handleSlideChange}
            style={{ height: '420px' }}
          >
            {normalizedImages.map((src, idx) => (
              <SwiperSlide key={`main-${idx}`}>
                <div
                  className="swiper-zoom-container"
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    cursor: 'pointer',
                    background: '#000',
                  }}
                  onClick={() => openFullscreen(idx)}
                >
                  {isLoading && idx === 0 && (
                    <div className="image-loader">
                      <div className="spinner"></div>
                    </div>
                  )}
                  <Image
                    src={src}
                    alt={`${title} - imagen ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 960px"
                    priority={idx === 0}
                    style={{ objectFit: 'contain' }}
                    onLoad={() => idx === 0 && setIsLoading(false)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 📊 Contador de imágenes */}
          <div className="gallery-counter">
            {activeIndex + 1} / {normalizedImages.length}
          </div>
        </div>

        {/* 🖼️ MINIATURAS */}
        {normalizedImages.length > 1 && (
          <div className="property-gallery-thumbs">
            <Swiper
              modules={[Thumbs]}
              onSwiper={setThumbsSwiper}
              spaceBetween={8}
              slidesPerView="auto"
              watchSlidesProgress
              freeMode
            >
              {normalizedImages.map((src, idx) => (
                <SwiperSlide key={`thumb-${idx}`} style={{ width: 'auto' }}>
                  <div
                    className={`gallery-thumb ${idx === activeIndex ? 'active' : ''}`}
                    onClick={() => goToSlide(idx)}
                  >
                    <Image
                      src={src}
                      alt={`Miniatura ${idx + 1}`}
                      fill
                      sizes="100px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      {/* 🌙 LIGHTBOX FULLSCREEN */}
      {fullscreen && (
        <div
          className="fullscreen-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Galería en pantalla completa"
        >
          {/* Botón cerrar */}
          <button
            className="close-btn"
            onClick={closeFullscreen}
            aria-label="Cerrar galería"
          >
            ✕
          </button>

          {/* Swiper fullscreen con zoom */}
          <Swiper
            modules={[Navigation, Keyboard, Zoom]}
            navigation
            keyboard={{ enabled: true }}
            zoom={{ maxRatio: 4, minRatio: 1 }}
            initialSlide={activeIndex}
            onSwiper={(swiper) => (swiperFullscreenRef.current = swiper)}
            onSlideChange={handleSlideChange}
          >
            {normalizedImages.map((src, idx) => (
              <SwiperSlide key={`fullscreen-${idx}`}>
                <div className="swiper-zoom-container" style={{ width: '100%', height: '100vh' }}>
                  <Image
                    src={src}
                    alt={`${title} - imagen ${idx + 1} en pantalla completa`}
                    fill
                    sizes="100vw"
                    style={{ objectFit: 'contain' }}
                    priority={idx === activeIndex}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Contador fullscreen */}
          <div className="fullscreen-counter">
            {activeIndex + 1} / {normalizedImages.length}
          </div>
        </div>
      )}
    </>
  );
}