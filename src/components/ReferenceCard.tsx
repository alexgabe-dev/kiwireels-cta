import React, { useState } from 'react';
import AnimatedElement from './AnimatedElement';

interface ReferenceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  fullDescription: string;
  delay: number;
}

const ReferenceCard: React.FC<ReferenceCardProps> = ({
  title,
  description,
  imageUrl,
  videoUrl,
  fullDescription,
  delay,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <AnimatedElement delay={delay} className="w-full">
        <div 
          className="card card-hover cursor-pointer aspect-video relative overflow-hidden"
          onClick={() => setShowModal(true)}
        >
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
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
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
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
              
              <div className="mb-6">
                {videoUrl ? (
                  <div className="aspect-video">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={videoUrl} 
                      title={title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  </div>
                ) : (
                  <img 
                    src={imageUrl} 
                    alt={title} 
                    className="w-full rounded-lg"
                  />
                )}
              </div>
              
              <p className="text-gray-700">{fullDescription}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReferenceCard;