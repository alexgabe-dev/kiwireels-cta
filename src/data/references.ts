export interface Reference {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  fullDescription: string;
}

const references: Reference[] = [
  {
    title: 'Social media kampány – FashionBrand X',
    description: 'Egy hónap alatt 50 ezer megtekintés, 3 ezer megosztás.',
    imageUrl: 'https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    videoUrl: '/refvideos/redvid1.mp4',
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
  },
  {
    title: 'Kocsma fotózás',
    description: 'Exkluziv kocsma est',
    imageUrl: 'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?cs=srgb&dl=pexels-andre-furtado-43594-1264210.jpg',
    videoUrl: '',
    fullDescription: 'Kocsma est fotózás, készítettünk kép- és videóanyagot a kocsma és a vendégek közötti interakciókhoz.'
  },
  {
    title: 'Kocsma túra',
    description: 'Exkluziv kocsma est turázgáts',
    imageUrl: 'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?cs=srgb&dl=pexels-andre-furtado-43594-1264210.jpg',
    videoUrl: 'https://youtube.com/embed/dyTvDm41MDY?si=YsXZRrf9er9VyqGu',
    fullDescription: 'Kocsma est fotózás, készítettünk kép- és videóanyagot a kocsma és a vendégek közötti interakciókhoz.'
  }
];

export default references; 