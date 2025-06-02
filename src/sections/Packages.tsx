import React from 'react';
import AnimatedElement from '../components/AnimatedElement';
import PackageCard from '../components/PackageCard';
import packageGroups from '../data/packageGroups';

const Packages: React.FC = () => {
  return (
    <section id="packages" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedElement>
          <h2 className="section-title text-center mb-4">Csomagjaink</h2>
        </AnimatedElement>
        
        <AnimatedElement delay={100}>
          <p className="text-center text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
            Válaszd ki az igényeidnek leginkább megfelelő csomagot, vagy kérj egyedi ajánlatot.
          </p>
        </AnimatedElement>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packageGroups.map((pkg, index) => (
            <PackageCard
              key={index}
              title={pkg.title}
              icon={pkg.icon}
              packages={pkg.items}
              delay={200 + (index * 100)}
            />
          ))}
        </div>
        
        <AnimatedElement delay={600} className="text-center mt-12">
          <a href="#contact" className="btn">
            Egyedi ajánlatkérés
          </a>
        </AnimatedElement>
      </div>
    </section>
  );
};

export default Packages;