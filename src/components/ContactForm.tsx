import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import AnimatedElement from './AnimatedElement';

const ContactForm: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Mobile View */}
      <div className="lg:hidden space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">Kapcsolat</h2>
          <h3 className="text-xl text-white/80">Vedd fel velünk a kapcsolatot</h3>
          <p className="text-white/70">
            Ha bármilyen kérdésed van, vagy szeretnél egyedi ajánlatot, töltsd ki az alábbi űrlapot, 
            és mi 24 órán belül jelentkezünk.
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Neved"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                       text-white placeholder-white/50"
            />
            <input
              type="email"
              placeholder="Email címed"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                       text-white placeholder-white/50"
            />
            <input
              type="tel"
              placeholder="Telefonszámod"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                       text-white placeholder-white/50"
            />
            <textarea
              placeholder="Üzeneted"
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                       text-white placeholder-white/50 resize-none"
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full btn bg-kiwi text-white hover:bg-kiwi/90"
          >
            Küldés
          </button>
        </form>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-kiwi-dark">Elérhetőségek</h3>
            <div className="space-y-4">
              <a href="mailto:info@kiwireels.hu" className="flex items-center space-x-3 text-kiwi-dark hover:text-kiwi transition-colors duration-300">
                <Mail size={20} />
                <span>info@kiwireels.hu</span>
              </a>
              <a href="tel:+36301234567" className="flex items-center space-x-3 text-kiwi-dark hover:text-kiwi transition-colors duration-300">
                <Phone size={20} />
                <span>+36 30 123 4567</span>
              </a>
              <div className="flex items-center space-x-3 text-kiwi-dark">
                <MapPin size={20} />
                <span>Budapest, Magyarország</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:grid grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Kapcsolat</h2>
            <p className="text-white/70 text-lg">
              Ha bármilyen kérdésed van, vagy szeretnél egyedi ajánlatot, töltsd ki az alábbi űrlapot, 
              és mi 24 órán belül jelentkezünk.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-kiwi-dark">Elérhetőségek</h3>
              <div className="space-y-4">
                <a href="mailto:info@kiwireels.hu" className="flex items-center space-x-3 text-kiwi-dark hover:text-kiwi transition-colors duration-300">
                  <Mail size={24} />
                  <span className="text-lg">info@kiwireels.hu</span>
                </a>
                <a href="tel:+36301234567" className="flex items-center space-x-3 text-kiwi-dark hover:text-kiwi transition-colors duration-300">
                  <Phone size={24} />
                  <span className="text-lg">+36 30 123 4567</span>
                </a>
                <div className="flex items-center space-x-3 text-kiwi-dark">
                  <MapPin size={24} />
                  <span className="text-lg">Budapest, Magyarország</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8">
          <form className="space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Neved"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                         text-white placeholder-white/50"
              />
              <input
                type="email"
                placeholder="Email címed"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                         text-white placeholder-white/50"
              />
              <input
                type="tel"
                placeholder="Telefonszámod"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                         text-white placeholder-white/50"
              />
              <textarea
                placeholder="Üzeneted"
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                         text-white placeholder-white/50 resize-none"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full btn bg-kiwi text-white hover:bg-kiwi/90"
            >
              Küldés
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm; 