import React from 'react';
import AnimatedElement from '../components/AnimatedElement';
import { Users, Heart, Star } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="relative py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <AnimatedElement>
          <h2 className="section-title text-center mb-16">Rólunk</h2>
        </AnimatedElement>
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <AnimatedElement delay={200} className="lg:w-1/2">
            <div className="prose max-w-none space-y-6">
              <div className="flex items-start space-x-4">
                <div className="icon-container mt-1 flex-shrink-0">
                  <Users size={20} />
                </div>
                <p className="text-lg leading-relaxed">
                <p>A <span className="font-semibold text-kiwi">Kiwi Reels</span> egy kreatív tartalomgyártó csapat, akik hisznek abban, hogy egy jó történet vizuálisan mesélve a legerősebb. Modern videókkal és fotókkal segítünk márkáknak kitűnni és emlékezetessé válni.
                </p>
                </p>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="icon-container mt-1 flex-shrink-0">
                  <Heart size={20} />
                </div>
                <p className="text-lg leading-relaxed">
                  Legyen szó <span className="font-semibold">social media kampányról</span>, <span className="font-semibold">imázsfilmről</span> vagy <span className="font-semibold">rendezvényvideókról</span>, nálunk megtalálod a megoldást.
                </p>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="icon-container mt-1 flex-shrink-0">
                  <Star size={20} />
                </div>
                <p className="text-lg leading-relaxed">
                  Tapasztalt csapatunk rugalmassága és kreativitása lehetővé teszi, hogy a legkülönfélébb igényeket is kielégítsük. Az elkészült anyagokat akár <span className="font-semibold text-kiwi">hirdetéskezeléssel</span> is kiegészítjük.
                </p>
              </div>
            </div>
          </AnimatedElement>
          
          <AnimatedElement delay={400} className="lg:w-1/2">
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/2608519/pexels-photo-2608519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Kiwi Reels Team" 
                className="rounded-lg shadow-xl hover-lift"
              />
              <img 
                src="https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Kiwi Reels Camera Work" 
                className="absolute -bottom-12 -left-12 w-2/3 rounded-lg shadow-xl border-4 border-white hover-lift z-10 hidden md:block"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-kiwi/20 to-transparent rounded-lg"></div>
            </div>
          </AnimatedElement>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </section>
  );
};

export default About;