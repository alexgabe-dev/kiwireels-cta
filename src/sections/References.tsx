import React, { useState, useEffect } from 'react';
import AnimatedElement from '../components/AnimatedElement';
import ReferenceCard from '../components/ReferenceCard';
import { supabase } from '../lib/supabaseClient';
import type { Reference, ReferenceImage } from '../data/references';

// Supabase fetch helper - átmásolva/adaptálva az Admin.tsx-ből, snake_case -> camelCase mappinggal
async function fetchReferencesFromSupabase(): Promise<(Reference & { id: string; images: (ReferenceImage & { id: string })[] })[]> {
  // Lekérés a project_references táblából, sorrend created_at alapján (vagy más sort order, ha később lesz)
  const { data: references, error: refError } = await supabase.from('project_references').select('*').order('created_at', { ascending: true });
  if (refError) {
    console.error('Error fetching project references:', refError);
    return []; // Üres tömb visszaadása hiba esetén
  }

  // Lekérés a project_reference_images táblából, sorrend sort_order alapján
  const { data: images, error: imgError } = await supabase.from('project_reference_images').select('*').order('sort_order', { ascending: true });
  if (imgError) {
    console.error('Error fetching project reference images:', imgError);
     // Hibakezelés, ha a képek betöltése sikertelen
     return (references || []).map(ref => ({
       ...ref,
       // Mappeljük a Supabase neveket camelCase-re
       imageUrl: ref.image_url,
       videoUrl: ref.video_url, // Null értékeket is kezel
       fullDescription: ref.full_description,
       images: [] // Nincsenek képek hiba miatt
     })) as any; // Supabase visszatérési típus pontosítása később
  }

  // Összefűzzük a referenciákat a hozzájuk tartozó képekkel és mappeljük a neveket
  return (references || []).map(ref => ({
    id: ref.id, // Supabase ID
    title: ref.title,
    description: ref.description,
    imageUrl: ref.image_url, // Átképezés
    videoUrl: ref.video_url, // Átképezés (lehet null)
    fullDescription: ref.full_description, // Átképezés
    images: (images || []).filter(img => img.reference_id === ref.id).map(img => ({
      id: img.id, // Supabase ID
      src: img.src,
      alt: img.alt,
      description: img.description, // Null értékeket is kezel
      // sort_order nem szükséges a ReferenceImage típusban
    }))
  })) as any; // Ideiglenes any, Supabase visszatérési típus pontosítása később
}

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
  const [allReferences, setAllReferences] = useState<(Reference & { id: string; images: (ReferenceImage & { id: string })[] })[]>([]);
  const [loadingReferences, setLoadingReferences] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const count = getLoadCount();
      setLoadCount(count);
      // Amikor átméretezünk, állítsuk vissza a látható számot a kezdeti értékre
      setVisibleCount(count);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adatok betöltése Supabase-ből komponens betöltődésekor
  useEffect(() => {
    setLoadingReferences(true);
    fetchReferencesFromSupabase().then(refs => {
      setAllReferences(refs);
      setLoadingReferences(false);
      // Kezdetben csak a 'loadCount' darabot jelenítjük meg
      setVisibleCount(getLoadCount());
    }).catch(error => {
      console.error('Error loading references from Supabase:', error);
      // Hiba kezelés: pl. üzenet megjelenítése, vagy üres lista
      setAllReferences([]);
      setLoadingReferences(false);
    });
  }, []); // Üres dependency array: csak egyszer fut le komponens mountkor

  const handleLoadMore = () => {
    setLoading(true);
    // Töltsünk be többet a Supabase-ből lekérdezett összes referenciából
    const nextCount = Math.min(visibleCount + loadCount, allReferences.length);
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
        
        {loadingReferences && <div className="text-center text-kiwi mb-8">Referenciák betöltése...</div>}

        {/* Csak akkor jelenítjük meg a listát, ha befejeződött a betöltés és van referencia */}
        {!loadingReferences && allReferences.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {allReferences.slice(0, visibleCount).map((reference, index) => (
            <ReferenceCard
                key={reference.id || index} // Supabase ID használata key-ként
              title={reference.title}
              description={reference.description}
              imageUrl={reference.imageUrl}
                videoUrl={reference.videoUrl} // Ez most már camelCase és kezeli a null-t
              fullDescription={reference.fullDescription}
                delay={100 + (index % loadCount) * 100} // Módosított delay a gördülékenyebb betöltéshez
                images={reference.images}
            />
          ))}
        </div>
        )}

        {/* Üzenet, ha nincs megjeleníthető referencia */}
        {!loadingReferences && allReferences.length === 0 && (
           <div className="text-center text-gray-600 text-lg">Jelenleg nincsenek megjeleníthető referenciák.</div>
        )}

        {/* Tovább gomb csak akkor, ha van még megjeleníthető */}
        {visibleCount < allReferences.length && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              className="btn bg-kiwi text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-kiwi-dark transition-all duration-300"
              disabled={loading || loadingReferences} // Letiltva betöltés vagy referencia betöltés alatt
            >
              {loading ? 'Betöltés...' : 'További referenciáink'}
            </button>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default References;