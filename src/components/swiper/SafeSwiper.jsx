import React, { forwardRef, useEffect, useRef } from "react";
import { Swiper as BaseSwiper } from "swiper/react";

function attachAutoplayCleanup(swiper) {
  if (!swiper || swiper.__safeAutoplayCleanupAttached) {
    return;
  }

  const stopAutoplay = () => {
    try {
      swiper.autoplay?.stop?.();
    } catch {
      // Swiper teardown can race during unmount; best-effort cleanup is enough.
    }
  };

  swiper.on("beforeDestroy", stopAutoplay);
  swiper.__safeAutoplayCleanupAttached = true;
  swiper.__safeAutoplayCleanup = stopAutoplay;
}

const SafeSwiper = forwardRef(function SafeSwiper(
  { onSwiper, ...props },
  forwardedRef
) {
  const swiperRef = useRef(null);

  useEffect(() => {
    return () => {
      const swiper = swiperRef.current;

      if (!swiper || swiper.destroyed) {
        return;
      }

      swiper.__safeAutoplayCleanup?.();
    };
  }, []);

  return (
    <BaseSwiper
      {...props}
      ref={forwardedRef}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
        attachAutoplayCleanup(swiper);

        if (typeof onSwiper === "function") {
          onSwiper(swiper);
        }
      }}
    />
  );
});

export default SafeSwiper;
