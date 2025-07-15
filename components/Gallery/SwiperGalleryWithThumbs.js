// components/Gallery/SwiperGalleryWithThumbs.js
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';
import { useState } from 'react';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import './swiper-gallery.css';

export default function SwiperGalleryWithThumbs({ images = [], title = '' }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  if (!images.length) return null;

  return (
    <div className="mb-4 swiper-container-custom">
      <Swiper
        modules={[Thumbs, Navigation]}
        thumbs={{ swiper: thumbsSwiper }}
        navigation
        className="mb-3 rounded shadow-sm"
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <div style={{ position: 'relative', width: '100%', height: '500px' }}>
              <Image
                src={src}
                alt={`${title} imagen ${i + 1}`}
                fill
                sizes="100vw"
                className="rounded"
                style={{ objectFit: 'cover' }}
              />
            </div>
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
            <div style={{ position: 'relative', width: '100%', height: '80px' }}>
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
  );
}
