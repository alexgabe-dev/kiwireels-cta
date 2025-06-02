export interface Package {
  title: string;
  description: string;
  price: string;
  features: string[];
  imageUrl?: string;
}

const packages: Package[] = [
  {
    title: 'Alap csomag',
    description: 'Kezdő vállalkozásoknak ajánlott csomag.',
    price: '49 000 Ft',
    features: [
      '1 órás fotózás',
      '10 retusált kép',
      'Online galéria',
    ],
    imageUrl: '/packages/basic.jpg'
  },
  {
    title: 'Prémium csomag',
    description: 'Komplexebb igényekhez, extra szolgáltatásokkal.',
    price: '99 000 Ft',
    features: [
      '3 órás fotózás',
      '30 retusált kép',
      'Online galéria',
      'Kreatív tanácsadás',
    ],
    imageUrl: '/packages/premium.jpg'
  },
  {
    title: 'Videós csomag',
    description: 'Professzionális videós tartalom készítés.',
    price: '149 000 Ft',
    features: [
      '1-2 perces imázsfilm',
      'Forgatókönyv egyeztetés',
      'Vágás, utómunka',
      'Online átadás',
    ],
    imageUrl: '/packages/video.jpg'
  }
];

export default packages; 