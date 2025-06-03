import React, { useState } from 'react';
import { Camera, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import AnimatedElement from './AnimatedElement';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { footerLogoConfig } from '../config/brand';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAccepted) {
      return;
    }
    setStatus('loading');

    try {
      const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setPrivacyAccepted(false);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <footer className="relative bg-[#181816] text-white overflow-hidden mt-0">
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-10">
        <div className="bg-[#23221f] rounded-2xl shadow-2xl px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Brand Section */}
            <div className="space-y-6 flex flex-col justify-center">
              <div className="flex items-center space-x-3">
                <div className={`${footerLogoConfig.icon.type === 'image' ? 'p-0' : 'icon-container ' + footerLogoConfig.icon.backgroundColor || '' + ' ' + footerLogoConfig.icon.hoverBackgroundColor || ''}`}>
                  {footerLogoConfig.icon.type === 'lucide' ? (
                    <Camera size={footerLogoConfig.icon.size} color={footerLogoConfig.icon.color} />
                  ) : footerLogoConfig.icon.image && (
                    <img
                      src={footerLogoConfig.icon.image.src}
                      alt={footerLogoConfig.icon.image.alt}
                      width={footerLogoConfig.icon.image.width}
                      height={footerLogoConfig.icon.image.height}
                      className="object-contain"
                      onError={(e) => {
                        console.error('Failed to load logo image:', footerLogoConfig.icon.image?.src);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                {(footerLogoConfig.text.showPrimary || footerLogoConfig.text.showSecondary) && (
                  <div className="flex flex-col">
                    {footerLogoConfig.text.showPrimary && footerLogoConfig.text.primary && (
                      <span className={`${footerLogoConfig.text.primary.fontSize} ${footerLogoConfig.text.primary.fontWeight} ${footerLogoConfig.text.primary.color}`}>
                        {footerLogoConfig.text.primary.text}
                      </span>
                    )}
                    {footerLogoConfig.text.showSecondary && footerLogoConfig.text.secondary && (
                      <span className={`${footerLogoConfig.text.secondary.fontSize} ${footerLogoConfig.text.secondary.fontWeight} ${footerLogoConfig.text.secondary.color}`}>
                        {footerLogoConfig.text.secondary.text}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-white/70 leading-relaxed">
                Egy szenvedélyes és dinamikus kreatív stúdió, ahol a vizuális történetmesélés mestereivé válunk. 
                Minden projekt egyedi történet, amit mi segítünk megfogalmazni.
              </p>
            </div>

            {/* Contact Section */}
            <div className="space-y-6 flex flex-col justify-center">
              <div className="relative">
                <h3 className="text-xl font-semibold text-white mb-6">Kapcsolat</h3>
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-kiwi"></div>
              </div>
              <div className="space-y-4 mt-4">
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
              <div className="relative">
                <h3 className="text-xl font-semibold text-white mb-6">Értesülj elsőként</h3>
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-kiwi"></div>
              </div>
              <p className="text-white/70 mt-4">
                Iratkozz fel hírlevelünkre, hogy értesülj a legújabb projektekről és akciókról.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Az email címed"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                           text-white placeholder-white/50"
                />
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="privacy-footer"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    required
                    className="mt-1"
                  />
                  <label htmlFor="privacy-footer" className="text-white/70 text-sm">
                    Elolvastam és elfogadom az <Link to="/adatvedelem" className="text-kiwi hover:text-kiwi/80 underline">adatvédelmi tájékoztatót</Link>.
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading' || !privacyAccepted}
                  className={`w-full btn bg-kiwi text-white hover:bg-kiwi/90 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {status === 'loading' ? 'Feldolgozás...' : 'Feliratkozás'}
                </button>

                {status === 'success' && (
                  <p className="text-green-400 text-center">Sikeres feliratkozás! Köszönjük!</p>
                )}
                {status === 'error' && (
                  <p className="text-red-400 text-center">Sajnáljuk, hiba történt. Kérjük próbáld újra később.</p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 mt-10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} kiwireels.hu | Minden jog fenntartva.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;