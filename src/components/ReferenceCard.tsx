import React, { useState } from 'react';
import AnimatedElement from './AnimatedElement';

interface ReferenceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  fullDescription: string;
  delay: number;
  className?: string;
}

function getAspectClass(videoUrl?: string) {
  if (!videoUrl) return 'aspect-video';
  if (videoUrl.match(/(shorts|tiktok|vertical|9-16)/i)) return 'aspect-[9/16]';
  if (videoUrl.match(/\.mp4$|\.webm$|\.ogg$/i)) return 'aspect-[9/16]';
  return 'aspect-video';
}

function isNativeVideo(url?: string) {
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
}) => {
  const [showModal, setShowModal] = useState(false);

  const isVertical = videoUrl && getAspectClass(videoUrl) === 'aspect-[9/16]';

  return (
    <>
      <AnimatedElement delay={delay} className={`w-full ${className}`}>
        <div 
          className="card card-hover cursor-pointer aspect-video relative overflow-hidden"
          onClick={() => setShowModal(true)}
        >
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
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
                {videoUrl ? (
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