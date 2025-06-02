import React, { useRef, useEffect } from 'react';

const images = [
  '/carousel/1.jpg',
  '/carousel/2.jpg',
  '/carousel/3.jpg',
  '/carousel/4.jpg',
  '/carousel/5.jpg',
];

const ImageCarousel: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  let interval: any = null;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let scrollAmount = 0;

    const scroll = () => {
      scrollAmount += 1;
      if (scrollAmount >= track.scrollWidth / 2) {
        scrollAmount = 0;
      }
      track.scrollLeft = scrollAmount;
    };

    interval = setInterval(scroll, 16); // ~60fps

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Duplicate images for infinite effect
  const carouselImages = [...images, ...images];

  return (
    <div className="w-full bg-[#181816] py-8 overflow-hidden">
      <div
        ref={trackRef}
        className="flex gap-8 no-scrollbar whitespace-nowrap transition-all duration-300 pointer-events-none select-none"
        style={{ scrollBehavior: 'auto', overflowX: 'hidden' }}
      >
        {carouselImages.map((src, idx) => (
          <div key={idx} className="flex-shrink-0 rounded-xl overflow-hidden shadow-lg border border-[#23221f] bg-[#23221f]" style={{ width: 260, height: 160 }}>
            <img
              src={src}
              alt={`carousel-img-${idx}`}
              className="w-full h-full object-cover object-center transition-transform duration-500"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel; 