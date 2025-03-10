import { useState } from "react";
import { YStack, Image, Button } from "tamagui";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function ImageSlider() {
  const images = [
    "https://source.unsplash.com/800x600/?nature",
    "https://source.unsplash.com/800x600/?city",
    "https://source.unsplash.com/800x600/?technology",
  ];

  return (
    <YStack alignItems="center" justifyContent="center" width="100%">
      <Swiper
        modules={[Navigation]}
        navigation
        loop={false}
        spaceBetween={20}
        slidesPerView={1}
        style={{ width: "100%", maxWidth: 800, borderRadius: 10 }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <Image
              source={{ uri: img }}
              width="100%"
              height={450}
              borderRadius="$4"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </YStack>
  );
}
