export interface StaticCarouselImage {
  src: string;
  alt: string | null;
}

const initialCarouselImages: StaticCarouselImage[] = [
  { src: '/carousel/1.jpg', alt: 'Csapatunk videó projekten dolgozik' },
  { src: '/carousel/2.jpg', alt: 'Videó vágás folyamatban' },
  { src: '/carousel/3.jpg', alt: 'Kamera beállítás egy forgatáson' },
  { src: '/carousel/4.jpg', alt: 'Utómunka stúdióban' },
  { src: '/carousel/5.jpg', alt: 'Forgatási helyszín előkészítése' },
];

export default initialCarouselImages; 