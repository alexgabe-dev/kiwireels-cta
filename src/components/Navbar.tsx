import React, { useState, useEffect } from 'react';
import { Menu, X, Camera } from 'lucide-react';
import AnimatedElement from './AnimatedElement';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showCtaAnimation, setShowCtaAnimation] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
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
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Kezdőlap', href: '#hero', id: 'hero' },
    { name: 'Rólunk', href: '#about', id: 'about' },
    { name: 'Referenciák', href: '#references', id: 'references' },
    { name: 'Csomagok', href: '#packages', id: 'packages' },
    { name: 'Kapcsolat', href: '#contact', id: 'contact' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleContactClick = () => {
    setIsMenuOpen(false);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
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
            <a 
              href="#hero" 
              className={`flex items-center space-x-3 transition-all duration-300 hover:scale-105 ${
                !isScrolled ? 'text-white' : 'text-white'
              }`}
            >
              <div className={`icon-container ${!isScrolled ? 'bg-white/20 hover:bg-white/30' : 'bg-kiwi/20 hover:bg-kiwi/30'}`}>
                <Camera size={24} />
              </div>
              <div className="flex flex-col">
                <span className={`text-2xl font-bold ${!isScrolled ? 'text-white' : 'text-white'}`}>
                  Kiwi
                </span>
                <span className={`text-sm font-medium ${!isScrolled ? 'text-white/80' : 'text-kiwi'}`}>Reels</span>
              </div>
            </a>
          </AnimatedElement>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <AnimatedElement key={link.name} delay={index * 100}>
                <a
                  href={link.href}
                  className={`nav-link font-medium transition-all duration-300 ${
                    activeSection === link.id 
                      ? 'text-kiwi after:w-full' 
                      : !isScrolled 
                        ? 'text-white hover:text-white/80 after:bg-white' 
                        : 'text-white hover:text-kiwi after:bg-kiwi'
                  }`}
                >
                  {link.name}
                </a>
              </AnimatedElement>
            ))}
            
            {/* CTA Button */}
            <AnimatedElement delay={500}>
              <a
                href="#contact"
                className={`relative bg-kiwi text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 
                           hover:scale-105 hover:shadow-lg hover:shadow-kiwi/40 
                           active:scale-95
                           before:absolute before:inset-0 before:rounded-full before:bg-white/20 before:scale-0 before:opacity-0
                           hover:before:scale-100 hover:before:opacity-100 before:transition-all before:duration-300
                           overflow-hidden
                           ${showCtaAnimation ? 'animate-cta-pulse' : ''}`}
              >
                Ajánlatkérés
              </a>
            </AnimatedElement>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              className={`relative w-10 h-10 flex items-center justify-center transition-all duration-300
                         ${!isScrolled ? 'text-white' : 'text-white'}
                         hover:bg-white/10 active:bg-white/20`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <div className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100'}`}>
                <Menu size={24} />
              </div>
              <div className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}>
                <X size={24} />
              </div>
            </button>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        <div 
          className={`lg:hidden fixed inset-x-0 top-[72px] bg-kiwi-dark/95 backdrop-blur-md transition-all duration-500 ease-in-out
                     ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link, index) => (
                <AnimatedElement key={link.name} delay={index * 100}>
                  <a
                    href={link.href}
                    className={`nav-link block px-4 py-2 transition-all duration-300 ${
                      activeSection === link.id
                        ? 'bg-kiwi/10 text-kiwi'
                        : 'text-white hover:bg-kiwi/5 hover:text-kiwi'
                    }`}
                    onClick={toggleMenu}
                  >
                    {link.name}
                  </a>
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
      </div>
    </header>
  );
};

export default Navbar;