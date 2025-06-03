import React from 'react';
import AnimatedElement from '../components/AnimatedElement';
import ContactForm from '../components/ContactForm';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="min-h-screen bg-kiwi-dark pt-20 pb-0">
      <div className="container mx-auto">
        <ContactForm />
      </div>
    </section>
  );
};

export default Contact;