// components/Gallery/SwiperGalleryWithThumbs.js
'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import '@/../public/styles/swiper-gallery.css';

export default function SwiperGalleryWithThumbs({ images = [], title = '' }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const uniqueImages = Array.from(new Set(images.filter(Boolean)));

  if (!uniqueImages.length) return null;

  return (
    <div className="card p-4 shadow-sm mb-5">
      <h5 className="mb-3 text-center text-primary">Galería de Imágenes</h5>

      {/* Swiper principal */}
      <Swiper
        modules={[Navigation, Thumbs, Pagination]}
        navigation
        pagination={{ clickable: true }}
        thumbs={{ swiper: thumbsSwiper }}
        spaceBetween={10}
        slidesPerView={1}
        className="main-swiper mb-3 rounded shadow-sm"
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {uniqueImages.map((src, i) => (
          <SwiperSlide key={`main-${i}`}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '500px',
                backgroundColor: '#000',
              }}
            >
              <Image
                src={src}
                alt={`${title || 'Propiedad'} imagen ${i + 1}`}
                fill
                sizes="100vw"
                className="rounded"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Miniaturas */}
      {uniqueImages.length > 1 && (
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={Math.min(uniqueImages.length, 6)}
          watchSlidesProgress
          className="thumb-swiper"
        >
          {uniqueImages.map((src, i) => (
            <SwiperSlide key={`thumb-${i}`}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '80px',
                  cursor: 'pointer',
                }}
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
      )}
    </div>
  );
}
