import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Vissza a tetejére"
      className={`fixed bottom-4 right-4 z-50 p-2 rounded-xl bg-white/70 backdrop-blur-md border border-kiwi/60 text-kiwi-dark shadow-md transition-all duration-300
        hover:scale-110 hover:shadow-xl hover:bg-kiwi/90 hover:text-white
        active:scale-95 active:shadow
        focus:outline-none focus:ring-2 focus:ring-kiwi/40
        scrolltop-pop
        ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      style={{ transitionProperty: 'all' }}
    >
      <ArrowUp size={18} strokeWidth={3} className="drop-shadow-sm transition-all duration-300" />
    </button>
  );
};

export default ScrollToTopButton; 