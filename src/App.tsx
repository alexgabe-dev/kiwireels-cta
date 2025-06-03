import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import Admin from './pages/Admin';
import ImageCarousel from './components/ImageCarousel';

// Create a wrapper component to conditionally render the Navbar
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="font-poppins">
      <ScrollProgress />
      {!isAdminPage && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <About />
              <References />
              <Packages />
              <Contact />
              <ImageCarousel />
            </>
          } />
          <Route path="/adatvedelem" element={<Privacy />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isAdminPage && <ScrollToTopButton />}
      {!isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;