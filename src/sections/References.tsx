import React, { useState, useEffect } from 'react';
import AnimatedElement from '../components/AnimatedElement';
import ReferenceCard from '../components/ReferenceCard';
import references from '../data/references';

function getLoadCount() {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 1024 ? 6 : 4;
  }
  return 4;
}

const References: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(getLoadCount());
  const [loadCount, setLoadCount] = useState(getLoadCount());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const count = getLoadCount();
      setLoadCount(count);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (visibleCount < loadCount) {
      setVisibleCount(loadCount);
    }
  }, [loadCount]);

  const handleLoadMore = () => {
    setLoading(true);
    const nextCount = Math.min(visibleCount + loadCount, references.length);
    setVisibleCount(nextCount);
    setTimeout(() => setLoading(false), 200);
  };

  return (
    <section id="references" className="relative py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <AnimatedElement>
          <h2 className="section-title text-center mb-4">Referenciák</h2>
        </AnimatedElement>
        
        <AnimatedElement delay={100}>
          <p className="text-center text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
            Ismerd meg eddigi munkáinkat, és fedezd fel, hogyan segítettünk ügyfeleinknek
            <span className="text-gradient font-semibold"> kiemelkedni a digitális térben</span>.
          </p>
        </AnimatedElement>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {references.slice(0, visibleCount).map((reference, index) => (
            <ReferenceCard
              key={index}
              title={reference.title}
              description={reference.description}
              imageUrl={reference.imageUrl}
              videoUrl={reference.videoUrl}
              fullDescription={reference.fullDescription}
              delay={200 + (index * 100)}
            />
          ))}
        </div>
        {visibleCount < references.length && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              className="btn bg-kiwi text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-kiwi-dark transition-all duration-300"
              disabled={loading}
            >
              További referenciáink
            </button>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default References;