export interface LogoConfig {
  icon: {
    type: 'lucide' | 'image';
    name?: string;  // Lucide icon name
    size: number;
    color?: string;
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    image?: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
  };
  text: {
    showPrimary?: boolean;
    showSecondary?: boolean;
    primary?: {
      text: string;
      color: string;
      fontSize: string;
      fontWeight: string;
    };
    secondary?: {
      text: string;
      color: string;
      fontSize: string;
      fontWeight: string;
    };
  };
}

// Navbar logo configuration
export const navbarLogoConfig: LogoConfig = {
  icon: {
    type: 'image',
    size: 24,
    image: {
      src: '/assets/kiwi-logo.png',
      alt: 'Kiwi Reels Logo',
      width: 40,
      height: 40
    }
  },
  text: {
    showPrimary: true,
    showSecondary: true,
    primary: {
      text: 'Kiwi',
      color: 'text-white',
      fontSize: 'text-2xl',
      fontWeight: 'font-bold'
    },
    secondary: {
      text: 'Reels',
      color: 'text-white/80',
      fontSize: 'text-sm',
      fontWeight: 'font-medium'
    }
  }
};

// Footer logo configuration
export const footerLogoConfig: LogoConfig = {
  icon: {
    type: 'image',
    size: 24,
    image: {
      src: '/assets/kiwi-logo.png',
      alt: 'Kiwi Reels Logo',
      width: 80,
      height: 80
    }
  },
  text: {
    showPrimary: true,
    showSecondary: true,
    primary: {
      text: 'Kiwi',
      color: 'text-white',
      fontSize: 'text-xl',
      fontWeight: 'font-bold'
    },
    secondary: {
      text: 'Reels',
      color: 'text-white/80',
      fontSize: 'text-xs',
      fontWeight: 'font-medium'
    }
  }
}; 