import React, { useState, useEffect } from 'react';
import { Menu, X, Camera } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AnimatedElement from './AnimatedElement';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navbarLogoConfig } from '../config/brand';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showCtaAnimation, setShowCtaAnimation] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  // Get the icon component dynamically
  const IconComponent = Camera; // For now, we'll use Camera as the default icon
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      if (isHomePage) {
        // Update active section based on scroll position
        const sections = ['hero', 'about', 'references', 'packages', 'contact'];
        const currentSection = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        
        if (currentSection) {
          setActiveSection(currentSection);
        }

        // Check if we're near the contact section for CTA animation
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          const rect = contactSection.getBoundingClientRect();
          if (rect.top <= 200 && rect.top >= -100) {
            setShowCtaAnimation(true);
            // Reset animation after 2 seconds
            setTimeout(() => setShowCtaAnimation(false), 2000);
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  const handleNavigation = (section: string) => {
    if (isHomePage) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${section}`);
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Kezdőlap', section: 'hero' },
    { name: 'Rólunk', section: 'about' },
    { name: 'Referenciák', section: 'references' },
    { name: 'Csomagok', section: 'packages' },
    { name: 'Kapcsolat', section: 'contact' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleContactClick = () => {
    handleNavigation('contact');
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-kiwi-dark py-3 shadow-lg' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <AnimatedElement className="flex items-center space-x-3">
            <Link 
              to="/"
              className="flex items-center space-x-3 transition-all duration-300 hover:scale-105"
            >
              <div className={`${navbarLogoConfig.icon.type === 'image' ? 'p-0' : 'icon-container ' + (isScrolled ? 'bg-kiwi/20 hover:bg-kiwi/30' : navbarLogoConfig.icon.backgroundColor || '' + ' ' + navbarLogoConfig.icon.hoverBackgroundColor || '')}`}>
                {navbarLogoConfig.icon.type === 'lucide' ? (
                  <IconComponent size={navbarLogoConfig.icon.size} color={navbarLogoConfig.icon.color} />
                ) : navbarLogoConfig.icon.image && (
                  <img
                    src={navbarLogoConfig.icon.image.src}
                    alt={navbarLogoConfig.icon.image.alt}
                    width={navbarLogoConfig.icon.image.width}
                    height={navbarLogoConfig.icon.image.height}
                    className="object-contain"
                    onError={(e) => {
                      console.error('Failed to load logo image:', navbarLogoConfig.icon.image?.src);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
              {(navbarLogoConfig.text.showPrimary || navbarLogoConfig.text.showSecondary) && (
                <div className="flex flex-col">
                  {navbarLogoConfig.text.showPrimary && navbarLogoConfig.text.primary && (
                    <span className={`${navbarLogoConfig.text.primary.fontSize} ${navbarLogoConfig.text.primary.fontWeight} ${navbarLogoConfig.text.primary.color}`}>
                      {navbarLogoConfig.text.primary.text}
                    </span>
                  )}
                  {navbarLogoConfig.text.showSecondary && navbarLogoConfig.text.secondary && (
                    <span className={`${navbarLogoConfig.text.secondary.fontSize} ${navbarLogoConfig.text.secondary.fontWeight} ${isScrolled ? 'text-kiwi' : navbarLogoConfig.text.secondary.color}`}>
                      {navbarLogoConfig.text.secondary.text}
                    </span>
                  )}
                </div>
              )}
            </Link>
          </AnimatedElement>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <AnimatedElement key={link.name} delay={index * 100}>
                <button
                  onClick={() => handleNavigation(link.section)}
                  className={`nav-link font-medium transition-all duration-300 ${
                    activeSection === link.section && isHomePage
                      ? 'text-kiwi after:w-full' 
                      : !isScrolled 
                        ? 'text-white hover:text-white/80 after:bg-white' 
                        : 'text-white hover:text-kiwi after:bg-kiwi'
                  }`}
                >
                  {link.name}
                </button>
              </AnimatedElement>
            ))}
            
            {/* CTA Button */}
            <AnimatedElement delay={500}>
              <button
                onClick={handleContactClick}
                className={`relative bg-kiwi text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 
                           hover:scale-105 hover:shadow-lg hover:shadow-kiwi/40 
                           active:scale-95
                           before:absolute before:inset-0 before:rounded-full before:bg-white/20 before:scale-0 before:opacity-0
                           hover:before:scale-100 hover:before:opacity-100 before:transition-all before:duration-300
                           overflow-hidden
                           ${showCtaAnimation ? 'animate-cta-pulse' : ''}`}
              >
                Ajánlatkérés
              </button>
            </AnimatedElement>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden z-50">
            <button
              className={`relative w-10 h-10 flex items-center justify-center transition-all duration-300
                         ${!isScrolled ? 'text-white' : 'text-white'}
                         hover:bg-white/10 active:bg-white/20`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={toggleMenu}
              aria-label="Menü bezárása háttérre kattintva"
            ></div>
            <div 
              className="lg:hidden fixed inset-x-0 top-[72px] bg-kiwi-dark/95 backdrop-blur-md transition-all duration-500 ease-in-out z-50"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link, index) => (
                    <AnimatedElement key={link.name} delay={index * 100}>
                      <button
                        onClick={() => handleNavigation(link.section)}
                        className={`nav-link block w-full text-left px-4 py-2 transition-all duration-300 ${
                          activeSection === link.section && isHomePage
                            ? 'bg-kiwi/10 text-kiwi'
                            : 'text-white hover:bg-kiwi/5 hover:text-kiwi'
                        }`}
                      >
                        {link.name}
                      </button>
                    </AnimatedElement>
                  ))}
                  {/* Mobile CTA Button */}
                  <div className="px-4 pt-4">
                    <AnimatedElement delay={500}>
                      <button
                        onClick={handleContactClick}
                        className={`relative bg-kiwi text-white font-semibold py-3 px-6 w-full text-center block rounded-full transition-all duration-300 
                                 hover:scale-105 hover:shadow-lg hover:shadow-kiwi/40 
                                 active:scale-95
                                 before:absolute before:inset-0 before:rounded-full before:bg-white/20 before:scale-0 before:opacity-0
                                 hover:before:scale-100 hover:before:opacity-100 before:transition-all before:duration-300
                                 overflow-hidden
                                 ${showCtaAnimation ? 'animate-cta-pulse' : ''}`}
                      >
                        Ajánlatkérés
                      </button>
                    </AnimatedElement>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;