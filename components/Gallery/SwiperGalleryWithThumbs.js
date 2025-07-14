'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import './swiper-gallery.css';

export default function SwiperGalleryWithThumbs({ images = [], title = '' }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  if (!images.length) return null;

  return (
    <div className="mb-4">
      <Swiper
        modules={[Thumbs, Navigation]}
        thumbs={{ swiper: thumbsSwiper }}
        navigation
        className="mb-3 rounded shadow-sm"
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <img
              src={src}
              alt={`${title} imagen ${i + 1}`}
              className="img-fluid rounded w-100"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={Math.min(images.length, 5)}
        watchSlidesProgress
        className="thumb-swiper"
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <img
              src={src}
              alt={`Miniatura ${i + 1}`}
              className="img-thumbnail rounded"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
