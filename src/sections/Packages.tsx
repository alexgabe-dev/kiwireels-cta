import React, { useState, useEffect } from 'react';
import AnimatedElement from '../components/AnimatedElement';
import PackageCard from '../components/PackageCard';
import { PackageGroup } from '../data/packageGroups';
import { supabase } from '../lib/supabaseClient';
import { Camera, Film, Mic, Image } from 'lucide-react';

// Ikon nevek hozzárendelése
const ICON_MAP: { [key: string]: any } = {
  'Camera': Camera,
  'Film': Film,
  'Mic': Mic,
  'Image': Image
};

const Packages: React.FC = () => {
  const [packageGroups, setPackageGroups] = useState<PackageGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const { data: groups, error: groupError } = await supabase
          .from('package_groups')
          .select('*')
          .order('sort_order', { ascending: true });
        
        const { data: items, error: itemError } = await supabase
          .from('package_items')
          .select('*');

        if (groupError || itemError) {
          throw groupError || itemError;
        }

        // Csoportok és csomagok összekapcsolása, ikonok hozzárendelése
        const groupsWithItems = (groups || []).map(group => ({
          ...group,
          icon: ICON_MAP[group.icon] || Camera, // Fallback Camera ikonra
          items: (items || []).filter(item => item.group_id === group.id)
        }));

        setPackageGroups(groupsWithItems);
      } catch (err) {
        console.error('Hiba a csomagok betöltése során:', err);
        setError('Nem sikerült betölteni a csomagokat. Kérjük, próbáld újra később!');
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <section id="packages" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-kiwi">Csomagok betöltése...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="packages" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

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
              key={pkg.id || index}
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