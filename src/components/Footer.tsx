import React from 'react';
import { Camera, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import AnimatedElement from './AnimatedElement';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#181816] text-white overflow-hidden mt-0">
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-10">
        <div className="bg-[#23221f] rounded-2xl shadow-2xl px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-6 flex flex-col justify-center">
            <div className="flex items-center space-x-3">
              <div className="icon-container bg-kiwi/20 hover:bg-kiwi/30">
                <Camera size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">Kiwi</span>
                <span className="text-sm font-medium text-kiwi">Reels</span>
              </div>
            </div>
            <p className="text-white/70 leading-relaxed">
              Egy szenvedélyes és dinamikus kreatív stúdió, ahol a vizuális történetmesélés mestereivé válunk. 
              Minden projekt egyedi történet, amit mi segítünk megfogalmazni.
            </p>
          </div>

          {/* Contact Section */}
          <div className="space-y-6 flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-white">Kapcsolat</h3>
            <div className="space-y-4">
              <a href="mailto:info@kiwireels.hu" className="flex items-center space-x-3 text-white/70 hover:text-kiwi transition-colors duration-300">
                <Mail size={20} />
                <span>info@kiwireels.hu</span>
              </a>
              <a href="tel:+36301234567" className="flex items-center space-x-3 text-white/70 hover:text-kiwi transition-colors duration-300">
                <Phone size={20} />
                <span>+36 30 123 4567</span>
              </a>
              <div className="flex items-center space-x-3 text-white/70">
                <MapPin size={20} />
                <span>Budapest, Magyarország</span>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-6 flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-white">Értesülj elsőként</h3>
            <p className="text-white/70">
              Iratkozz fel hírlevelünkre, hogy értesülj a legújabb projektekről és akciókról.
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Az email címed"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                         text-white placeholder-white/50"
              />
              <button
                type="submit"
                className="w-full btn bg-kiwi text-white hover:bg-kiwi/90"
              >
                Feliratkozás
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 mt-10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Kiwi Reels. Minden jog fenntartva.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;