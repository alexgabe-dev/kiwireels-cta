import React from 'react';
import AnimatedElement from '../components/AnimatedElement';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div 
        className="absolute inset-0 z-0 hero-parallax"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=1920')"
        }}
      ></div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 z-10"></div>
      
      <div className="container mx-auto px-4 z-20 text-center">
        <AnimatedElement>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Emeld magasabb szintre a
            <span className="bg-gradient-to-r from-kiwi to-kiwi-light bg-clip-text text-transparent"> márkád!</span>
          </h1>
        </AnimatedElement>
        
        <AnimatedElement delay={200}>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Egyedi, modern és hatékony vizuális megoldásokkal segítjük vállalkozásodat kitűnni a digitális térben.
          </p>
        </AnimatedElement>
        
        <AnimatedElement delay={400}>
          <a 
            href="#contact" 
            className="btn text-lg px-8 py-4"
          >
            Vágjunk bele!
          </a>
        </AnimatedElement>
        
        <AnimatedElement delay={600} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <a 
            href="#about"
            className="text-white/80 hover:text-white transition-colors duration-300 animate-float block"
            aria-label="Görgess lejjebb"
          >
            <ChevronDown size={32} />
          </a>
        </AnimatedElement>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/40 to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
    </section>
  );
};

export default Hero;