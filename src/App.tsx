import React from 'react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import References from './sections/References';
import Packages from './sections/Packages';
import Contact from './sections/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="font-poppins">
      <Navbar />
      <main>
        <Hero />
        <About />
        <References />
        <Packages />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;