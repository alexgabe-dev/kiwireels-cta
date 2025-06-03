import React, { useRef, useEffect, useState } from 'react';
import { fetchCarouselImages, CarouselImage } from '../services/carouselService';

// Custom CSS to hide scrollbar
const scrollbarStyles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;

const ImageCarousel: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollPositionRef = useRef(0); // Use useRef to persist scroll position
  const scrollSpeed = 1; // Pixels per frame
  let interval: any = null; // Use setInterval again

  // Fetch images only once on mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await fetchCarouselImages();
        setCarouselImages(images);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching carousel images:', error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []); // Empty dependency array - only run on mount

  // Handle simple scrolling with setInterval
  useEffect(() => {
    const track = trackRef.current;
    // Start scrolling only if track is available and images are loaded
    if (!track || carouselImages.length === 0) return;

    // Initialize scrollPositionRef if needed
    // scrollPositionRef.current = 0; // Removed: Let it start from where it was if images are updated

    const scroll = () => {
      if (!track) return; // Add null check for track

      scrollPositionRef.current += scrollSpeed;
      
      // If we've scrolled past the first set of images, reset to the start of the second set
      // track.scrollWidth is the total width of the flex container containing duplicated images.
      // We reset when we scroll past the original set, which is half of the total width.
      // Ensure track.scrollWidth is greater than 0 to avoid division by zero
      if (track.scrollWidth > 0 && scrollPositionRef.current >= track.scrollWidth / 2) { 
        scrollPositionRef.current = 0; // Reset scroll position to the beginning
      }
      track.scrollLeft = scrollPositionRef.current;
    };

    // Start the interval for scrolling
    interval = setInterval(scroll, 16); // ~60fps

    // Cleanup function to clear interval
    return () => {
      if (interval) clearInterval(interval);
    };
    // Re-run effect if images change (e.g., after loading) or scrollSpeed changes
  }, [carouselImages, scrollSpeed]); // Depend on carouselImages and scrollSpeed

  if (loading) {
    return <div>Loading carousel images...</div>;
  }

  // Create a duplicated set of images for seamless infinite scroll *only for rendering*
  const duplicatedImages = [...carouselImages, ...carouselImages];

  return (
    <div className="w-full bg-[#181816] py-4 overflow-hidden">
      {/* Add style tag for scrollbar hiding */}
      <style>{scrollbarStyles}</style>
      <div
        ref={trackRef}
        className="flex gap-8 no-scrollbar whitespace-nowrap transition-transform duration-300 pointer-events-none select-none hide-scrollbar" 
        style={{ overflowX: 'auto' }}
      >
        {duplicatedImages.map((img, idx) => (
          <div 
            key={`${img.id || 'img'}-${idx}`} // Ensure unique key for duplicated items
            className="flex-shrink-0 rounded-xl overflow-hidden shadow-lg border border-[#23221f] bg-[#23221f] w-[260px] h-[160px] lg:w-[384px] lg:h-[240px]">
            <img
              src={img.src}
              alt={img.alt || `carousel-img-${idx}`}
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