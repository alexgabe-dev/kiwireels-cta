import React from 'react';
import AnimatedElement from '../components/AnimatedElement';
import ReferenceCard from '../components/ReferenceCard';

const references = [
  {
    title: 'Social media kampány – FashionBrand X',
    description: 'Egy hónap alatt 50 ezer megtekintés, 3 ezer megosztás.',
    imageUrl: 'https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    videoUrl: '',
    fullDescription: 'Facebook és Instagram story videók létrehozása a FashionBrand X-nek, dinamikus vágásokkal és színes grafikákkal. A kampány 20-30%-kal növelte a követők számát, és 15%-kal emelte a webshop forgalmát.'
  },
  {
    title: 'Imázsfilm – Tech Startup',
    description: 'Professzionális bemutatkozó videó az új applikációhoz.',
    imageUrl: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    videoUrl: '',
    fullDescription: 'Egy teljes, 3 perces imázsfilm készítése a startup új mobil alkalmazásának bemutatásához. A videót a vállalkozás a főoldalán, valamint befektetői prezentációk során használta fel nagy sikerrel.'
  },
  {
    title: 'Termékfotózás – Gourmet Bistro',
    description: '45 professzionális étel- és italkép a menühöz és közösségi médiához.',
    imageUrl: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    videoUrl: '',
    fullDescription: 'Teljes étel- és italsort fotóztunk professzionális körülmények között a Gourmet Bistro számára. A képeket az étterem a menükártyákon és Instagram-oldalán is felhasználta, jelentősen növelve az online elérést és a foglalások számát.'
  },
  {
    title: 'Rendezvényvideó – Nemzetközi Konferencia',
    description: 'Átfogó dokumentáció az 500 fős szakmai eseményről.',
    imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    videoUrl: '',
    fullDescription: 'Háromnapos nemzetközi konferencia teljes dokumentálása több kamerával, interjúkkal és előadás-felvételekkel. Az elkészült anyagokat a szervezők promóciós célokra, valamint a résztvevők tájékoztatására használták fel.'
  },
  {
    title: 'TikTok sorozat – Fitness Brand',
    description: '12 rövid oktatóvideó, 1.2 millió össznézettséggel.',
    imageUrl: 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    videoUrl: '',
    fullDescription: 'Rövid, 30-45 másodperces edzésvideók készítése egy fitnesz márkának, melyek a TikTok és Instagram platformokon értek el kiemelkedő nézettséget. A kampány során a márka követőinek száma 45%-kal növekedett.'
  },
  {
    title: 'Esküvői fotózás – Luxury Wedding',
    description: 'Exkluzív, teljes napos dokumentáció a nagy napról.',
    imageUrl: 'https://images.pexels.com/photos/1427741/pexels-photo-1427741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    videoUrl: '',
    fullDescription: 'Exkluzív esküvői fotózás teljes dokumentációja egy luxus helyszínen. A szolgáltatás magában foglalta az előkészületeket, a ceremóniát és a fogadást is. A páros számára 350+ professzionálisan szerkesztett képet adtunk át.'
  }
];

const References: React.FC = () => {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {references.map((reference, index) => (
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
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default References;