// components/Gallery/SwiperGallery.js
'use client';

import { useState } from 'react';
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
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  if (!images.length) return null;

  return (
    <div className="card p-4 shadow-sm mb-5">
      <h5 className="mb-3 text-center text-primary">Galería de Imágenes</h5>

      <Swiper
        modules={[Navigation, Pagination, Zoom, Thumbs]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        zoom
        thumbs={{ swiper: thumbsSwiper }}
        className="mb-3"
      >
        {images.map((src, i) => (
          <SwiperSlide key={`main-${i}`}>            
            <div className="swiper-zoom-container">
              <Image
                src={src}
                alt={`${title} imagen ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-thumbnails">
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={Math.min(images.length, 5)}
          watchSlidesProgress
        >
          {images.map((src, i) => (
            <SwiperSlide key={`thumb-${i}`}>
              <div className="position-relative" style={{ width: '100%', height: '80px' }}>
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
    </div>
  );
}
