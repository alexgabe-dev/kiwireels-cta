import React, { useState } from 'react';
import AnimatedElement from './AnimatedElement';
import Gallery from 'react-photo-gallery';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import type { ReferenceImage } from '../data/references';

interface ReferenceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string | null;
  fullDescription: string;
  delay: number;
  className?: string;
  images?: ReferenceImage[];
}

function getAspectClass(videoUrl?: string | null) {
  if (!videoUrl) return 'aspect-video';
  if (videoUrl.match(/(shorts|tiktok|vertical|9-16)/i)) return 'aspect-[9/16]';
  if (videoUrl.match(/\.mp4$|\.webm$|\.ogg$/i)) return 'aspect-[9/16]';
  return 'aspect-video';
}

function isNativeVideo(url?: string | null) {
  return !!url && url.match(/\.mp4$|\.webm$|\.ogg$/i);
}

const ReferenceCard: React.FC<ReferenceCardProps> = ({
  title,
  description,
  imageUrl,
  videoUrl,
  fullDescription,
  delay,
  className = '',
  images,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const isVertical = videoUrl && getAspectClass(videoUrl) === 'aspect-[9/16]';
  const hasGallery = images && images.length > 1;
  // react-photo-gallery expects {src, width, height, alt} for each image
  const galleryPhotos = (images || []).map((img) => ({ src: img.src, width: 4, height: 3, alt: img.alt }));
  const lightboxSlides = (images || []).map((img) => ({ src: img.src, alt: img.alt, description: img.description }));

  // Kattintásra lightbox nyílik, a megfelelő index-szel
  const handleGalleryClick = (_event: any, { index }: { index: number }) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <AnimatedElement delay={delay} className={`w-full ${className}`}>
        <div 
          className="card card-hover cursor-pointer aspect-video relative overflow-hidden"
          onClick={() => setShowModal(true)}
        >
          <img 
            src={hasGallery ? images![0].src : imageUrl} 
            alt={hasGallery ? images![0].alt : title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {hasGallery && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded shadow">
              +{images!.length} kép
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-lg">{title}</h3>
            <p className="text-white/90 text-sm">{description}</p>
          </div>
        </div>
      </AnimatedElement>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className={`bg-white rounded-lg w-full max-h-[90vh] overflow-auto ${isVertical ? 'max-w-md' : 'max-w-4xl'}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-kiwi-dark">{title}</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="mb-4 flex flex-col items-center">
                {hasGallery ? (
                  <>
                    <div className="gallery-no-anim">
                      <Gallery photos={galleryPhotos} direction="row" onClick={handleGalleryClick} margin={6} />
                    </div>
                    <Lightbox
                      open={lightboxOpen}
                      close={() => setLightboxOpen(false)}
                      slides={lightboxSlides}
                      index={lightboxIndex}
                      animation={{ fade: 0, swipe: 250 }}
                      render={{
                        slide: ({ slide }) => {
                          const s = slide as any;
                          return (
                            <div style={{ textAlign: 'center' }}>
                              <img
                                src={s.src}
                                alt={s.alt}
                                style={{ maxHeight: '70vh', maxWidth: '100%', margin: '0 auto' }}
                              />
                              {s.description && (
                                <div style={{ color: '#fff', marginTop: 12, fontSize: 16 }}>{s.description}</div>
                              )}
                            </div>
                          );
                        }
                      }}
                    />
                  </>
                ) : videoUrl ? (
                  isNativeVideo(videoUrl) ? (
                    <div className={getAspectClass(videoUrl) + ' flex items-center justify-center max-h-[60vh] w-full'}>
                      <video
                        src={videoUrl}
                        controls
                        className="w-full h-full object-contain rounded-lg bg-black max-h-[60vh] mx-auto"
                        style={{ margin: '0 auto' }}
                      />
                    </div>
                  ) : (
                    <div className={getAspectClass(videoUrl) + ' flex items-center justify-center max-h-[60vh] w-full'}>
                      <iframe
                        width="100%"
                        height="100%"
                        src={videoUrl}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg w-full h-full max-h-[60vh] mx-auto"
                        style={{ margin: '0 auto' }}
                      ></iframe>
                    </div>
                  )
                ) : (
                  <img 
                    src={imageUrl} 
                    alt={title} 
                    className="w-full rounded-lg"
                  />
                )}
              </div>
              <p className="text-gray-700 mt-2 mb-0">{fullDescription}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReferenceCard;