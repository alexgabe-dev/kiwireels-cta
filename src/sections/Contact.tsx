import React from 'react';
import AnimatedElement from '../components/AnimatedElement';
import ContactForm from '../components/ContactForm';
import ImageCarousel from '../components/ImageCarousel';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="min-h-screen bg-kiwi-dark py-20">
      <div className="container mx-auto">
        <ContactForm />
      </div>
      <ImageCarousel />
    </section>
  );
};

export default Contact;