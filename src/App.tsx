import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import References from './sections/References';
import Packages from './sections/Packages';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import ScrollToTopButton from './components/ScrollToTopButton';
import Privacy from './pages/Privacy';

function App() {
  return (
    <Router>
      <div className="font-poppins">
        <ScrollProgress />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <About />
                <References />
                <Packages />
                <Contact />
              </>
            } />
            <Route path="/adatvedelem" element={<Privacy />} />
          </Routes>
        </main>
        <ScrollToTopButton />
        <Footer />
      </div>
    </Router>
  );
}

export default App;