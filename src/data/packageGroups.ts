import { Camera, Film, Mic, Image } from 'lucide-react';

export interface PackageItem {
  name: string;
  price: string;
  description: string;
}

export interface PackageGroup {
  title: string;
  icon: any;
  items: PackageItem[];
}

const packageGroups: PackageGroup[] = [
  {
    title: 'TikTok/Reels videócsomagok',
    icon: Camera,
    items: [
      {
        name: 'Starter csomag',
        description: '2 rövid videó/hónap (max. 30 mp)',
        price: '55 000 Ft/hó'
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

export default packageGroups; 