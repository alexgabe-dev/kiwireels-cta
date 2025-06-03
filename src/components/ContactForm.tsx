import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import AnimatedElement from './AnimatedElement';
import { Link } from 'react-router-dom';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAccepted) {
      return;
    }
    setStatus('loading');

    try {
      const response = await fetch('https://formspree.io/f/xwpbkavv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        setPrivacyAccepted(false);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-8 pb-8 lg:pb-4">
      {/* Mobile and Tablet View - Default is visible, hidden on lg and above */}
      <div className="space-y-8 lg:hidden"> {/* Removed lg:hidden for default visibility, kept for explicit hide */} 
        <div className="text-center space-y-4">
          <h2 className="section-title text-3xl font-bold text-white mb-4">Kapcsolat</h2>
          <h3 className="text-xl text-white/80">Vedd fel velünk a kapcsolatot</h3>
          <p className="text-white/70">
            Ha bármilyen kérdésed van, vagy szeretnél egyedi ajánlatot, töltsd ki az alábbi űrlapot, 
            és mi 24 órán belül jelentkezünk.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Neved *"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                       text-white placeholder-white/50"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email címed *"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                       text-white placeholder-white/50"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Telefonszámod"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                       text-white placeholder-white/50"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Üzeneted *"
              required
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                       text-white placeholder-white/50 resize-none"
            ></textarea>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="privacy-mobile"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              required
              className="mt-1"
            />
            <label htmlFor="privacy-mobile" className="text-white/70 text-sm">
              Elolvastam és elfogadom az <Link to="/adatvedelem" className="text-kiwi hover:text-kiwi/80 underline">adatvédelmi tájékoztatót</Link> *
            </label>
          </div>
          
          <button
            type="submit"
            disabled={status === 'loading' || !privacyAccepted}
            className={`w-full btn bg-kiwi text-white hover:bg-kiwi/90 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {status === 'loading' ? 'Küldés...' : 'Küldés'}
          </button>

          {status === 'success' && (
            <p className="text-green-400 text-center">Köszönjük! Hamarosan felvesszük veled a kapcsolatot.</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-center">Sajnáljuk, hiba történt. Kérjük próbáld újra később.</p>
          )}
        </form>

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

      {/* Desktop View */}
      <div className="hidden lg:grid grid-cols-2 gap-12"> {/* Keep hidden lg:grid for desktop */}
        <div className="space-y-8">
          <div>
            <div className="text-center lg:text-left space-y-4">
              <h2 className="section-title section-title-left text-3xl font-bold text-white mb-4">Kapcsolat</h2>
              <h3 className="text-xl text-white/70 text-lg mt-6">
                Ha bármilyen kérdésed van, vagy szeretnél egyedi ajánlatot, töltsd ki az alábbi űrlapot, 
                és mi 24 órán belül jelentkezünk.
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-kiwi">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Neved *"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                       text-white placeholder-white/50"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email címed *"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                       text-white placeholder-white/50"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Telefonszámod"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                       text-white placeholder-white/50"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Üzeneted *"
              required
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-kiwi/50 focus:border-kiwi
                       text-white placeholder-white/50 resize-none"
            ></textarea>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="privacy-desktop"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              required
              className="mt-1"
            />
            <label htmlFor="privacy-desktop" className="text-white/70 text-sm">
              Elfogadom az <Link to="/adatvedelem" className="text-kiwi hover:text-kiwi/80 underline">adatvédelmi tájékoztatót</Link>.
            </label>
          </div>
          
          <button
            type="submit"
            disabled={status === 'loading' || !privacyAccepted}
            className={`w-full btn bg-kiwi text-white hover:bg-kiwi/90 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {status === 'loading' ? 'Küldés...' : 'Küldés'}
          </button>

          {status === 'success' && (
            <p className="text-green-400 text-center">Köszönjük! Hamarosan felvesszük veled a kapcsolatot.</p>
          )}
          {status === 'error' && (
            <p className="text-red-400 text-center">Sajnáljuk, hiba történt. Kérjük próbáld újra később.</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm; 