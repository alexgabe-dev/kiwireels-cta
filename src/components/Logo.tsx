import React from 'react';
import type { LogoConfig } from '../config/brand';
import * as LucideIcons from 'lucide-react';

interface LogoProps {
  config: LogoConfig;
  isScrolled?: boolean; // Hozzáadjuk ezt, mert a Navbar használja a scrolled state-et
}

const Logo: React.FC<LogoProps> = ({ config, isScrolled }) => {
  // Dinamikusan lekérjük a Lucide ikont a neve alapján
  const IconComponent = config.icon.type === 'lucide' && config.icon.name 
    ? (LucideIcons as any)[config.icon.name] 
    : null; // Ideiglenes any

  // Biztonsági ellenőrzés, ha a config hiányos vagy rossz
  if (!config || !config.icon || !config.text) {
    console.error('Invalid LogoConfig provided:', config);
    return null; // Ne jelenítsünk meg semmit, ha a config érvénytelen
  }

  // Helper a háttérszín osztályokhoz (amennyiben Lucide ikont használ)
  const getIconBgClass = () => {
      if (config.icon.type === 'image') return '';
      const baseClass = 'icon-container ';
      const bgColor = isScrolled ? 'bg-kiwi/20 hover:bg-kiwi/30' : config.icon.backgroundColor || '';
      const hoverBgColor = isScrolled ? '' : config.icon.hoverBackgroundColor || ''; // Csak nem scrolled állapotban használjuk a hover színt itt
      return `${baseClass}${bgColor} ${hoverBgColor}`.trim();
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Ikon vagy Kép */}
      <div className={config.icon.type === 'image' ? 'p-0' : getIconBgClass()}>
        {config.icon.type === 'lucide' && IconComponent ? (
          <IconComponent 
            size={config.icon.size}
            color={config.icon.color || 'currentColor'} // Alapértelmezett szín
          />
        ) : config.icon.type === 'image' && config.icon.image ? (
          <img
            src={config.icon.image.src}
            alt={config.icon.image.alt}
            width={config.icon.image.width}
            height={config.icon.image.height}
            className="object-contain"
             onError={(e) => { // Hiba kezelés, ha a kép nem töltődik be
              console.error('Failed to load logo image:', config.icon.image?.src);
              e.currentTarget.style.display = 'none'; // Eltüntetjük a törött kép ikont
            }}
          />
        ) : null}
      </div>

      {/* Szöveges részek */}
      {(config.text.showPrimary || config.text.showSecondary) && (
        <div className="flex flex-col">
          {config.text.showPrimary && config.text.primary && (
            <span className={`${config.text.primary.fontSize} ${config.text.primary.fontWeight} ${config.text.primary.color}`}>
              {config.text.primary.text}
            </span>
          )}
          {config.text.showSecondary && config.text.secondary && (
             // Másodlagos szöveg színe függhet a scroll állapottól a navbarban
            <span className={`${config.text.secondary.fontSize} ${config.text.secondary.fontWeight} ${isScrolled ? 'text-kiwi' : config.text.secondary.color}`}>
              {config.text.secondary.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo; 