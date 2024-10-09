import React from 'react';
import Navbar from './components/navbar';
import Footer from './components/footer';
import LandingPage from './pages/landing.js'

function App() {
  return (
    <div className="App">
      <Navbar />  
      <LandingPage />
      <Footer />
    </div>
  );
}

export default App;

