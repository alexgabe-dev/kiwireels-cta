import React from 'react';
import AnimatedElement from '../components/AnimatedElement';
import PackageCard from '../components/PackageCard';
import { Camera, Film, Mic, Image } from 'lucide-react';

const packages = [
  {
    title: 'TikTok/Reels videócsomagok',
    icon: Camera,
    items: [
      {
        name: 'Starter csomag',
        description: '2 rövid videó/hónap (max. 30 mp)',
        price: '45 000 Ft/hó'
      },
      {
        name: 'Pro csomag',
        description: '4 videó/hónap (max. 45 mp)',
        price: '85 000 Ft/hó'
      },
      {
        name: 'Full csomag',
        description: '8 videó/hónap, profi vágással',
        price: '150 000 Ft/hó'
      }
    ]
  },
  {
    title: 'Imázsfilmek és Céges Videók',
    icon: Film,
    items: [
      {
        name: 'Alap csomag',
        description: '1–2 perces imázsfilm, alapszintű vágás',
        price: '120 000 Ft'
      },
      {
        name: 'Pro csomag',
        description: '2–3 perces imázsfilm, profi utómunka',
        price: '220 000 Ft'
      },
      {
        name: 'Prémium csomag',
        description: '3+ perces imázsfilm, forgatókönyvezéssel',
        price: '350 000 Ft'
      }
    ]
  },
  {
    title: 'Rendezvényvideók',
    icon: Mic,
    items: [
      {
        name: 'Alap csomag',
        description: '1–2 perces összefoglaló videó',
        price: '100 000 Ft'
      },
      {
        name: 'Pro csomag',
        description: '3–5 perces rendezvényvideó, interjúkkal',
        price: '180 000 Ft'
      },
      {
        name: 'Prémium csomag',
        description: 'Teljes rendezvény dokumentálása, hosszabb videók',
        price: '300 000 Ft'
      }
    ]
  },
  {
    title: 'Fotószolgáltatások',
    icon: Image,
    items: [
      {
        name: 'Alap csomag',
        description: '10 profi kép, alap retusálással',
        price: '35 000 Ft'
      },
      {
        name: 'Pro csomag',
        description: '25 kép, részletes retusálással',
        price: '75 000 Ft'
      },
      {
        name: 'Prémium csomag',
        description: '50 kép, teljes körű utómunkával',
        price: '120 000 Ft'
      }
    ]
  }
];

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
          {packages.map((pkg, index) => (
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