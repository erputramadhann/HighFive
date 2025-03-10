import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageSwiper = () => {
  const images = ["/bg1.jpg", "/bg2.jpg", "/bg3.jpg"];

  return (
    <div className="relative w-full h-[350px] md:h-[400px]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={10}
        slidesPerView={1}
        effect="fade"
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        style={{marginBottom:-100}}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[350px] md:h-[400px]">
              {/* Gambar */}
              <img
  src={img}
  style={{ 
    height: 460, 
    width: '97%', 
    alignSelf: 'center', 
    borderRadius: 10, 
    marginTop: 130, 
    display: 'block', 
    marginLeft: 'auto', 
    marginRight: 'auto' 
  }}
  alt={`Slide ${index + 1}`}
  className="w-full h-full object-cover rounded-lg"
/>
              {/* Overlay untuk teks & tombol navigasi */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-5 bg-black/40 rounded-lg">
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSwiper;
