export interface LogoConfig {
  icon: {
    type: 'lucide' | 'image';
    name?: string | null;  // Lucide icon name, lehet null
    size?: number; // Opcionális size
    color?: string | null; // Szín string (pl. hex, rgb), lehet null
    backgroundColor?: string | null; // Szín string (pl. hex, rgb), lehet null
    hoverBackgroundColor?: string | null; // Szín string (pl. hex, rgb), lehet null
    showIcon?: boolean; // Logó ikon/kép megjelenítése
    image?: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
  };
  text: {
    showPrimary: boolean; // Szöveg megjelenítése, legyen kötelező boolean
    showSecondary: boolean; // Szöveg megjelenítése, legyen kötelező boolean
    primary?: {
      text: string;
      color: string; // Itt még Tailwind class, ezt később változtatjuk
      fontSize: string;
      fontWeight: string;
    };
    secondary?: {
      text: string;
      color: string; // Itt még Tailwind class, ezt később változtatjuk
      fontSize: string;
      fontWeight: string;
    };
  };
}

// Navbar logo configuration
export const navbarLogoConfig: LogoConfig = {
  icon: {
    type: 'image',
    size: 24, // Méretet megőrizzük
    showIcon: true, // Alapértelmezett: mutasd az ikont
    image: {
      src: '/assets/kiwi-logo.png',
      alt: 'Kiwi Reels Logo',
      width: 40, // Méretek megőrzése
      height: 40 // Méretek megőrzése
    }
  },
  text: {
    showPrimary: true,
    showSecondary: true,
    primary: {
      text: 'Kiwi',
      color: 'text-white', // Use Tailwind color class
      fontSize: 'text-2xl',
      fontWeight: 'font-bold'
    },
    secondary: {
      text: 'Reels',
      color: 'text-gray-400', // Use Tailwind color class
      fontSize: 'text-sm',
      fontWeight: 'font-medium'
    }
  }
};

// Footer logo configuration
export const footerLogoConfig: LogoConfig = {
  icon: {
    type: 'image',
    size: 24, // Méretet megőrizzük
    showIcon: true, // Alapértelmezett: mutasd az ikont
    image: {
      src: '/assets/kiwi-logo.png',
      alt: 'Kiwi Reels Logo',
      width: 80, // Méretek megőrzése
      height: 80 // Méretek megőrzése
    }
  },
  text: {
    showPrimary: true,
    showSecondary: true,
    primary: {
      text: 'Kiwi',
      color: 'text-white', // Use Tailwind color class
      fontSize: 'text-xl',
      fontWeight: 'font-bold'
    },
    secondary: {
      text: 'Reels',
      color: 'text-gray-400', // Use Tailwind color class
      fontSize: 'text-xs',
      fontWeight: 'font-medium'
    }
  }
}; 