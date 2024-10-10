import React from 'react';
import Navbar from './components/navbar';
import Footer from './components/footer';
import LandingPage from './pages/landing.js'
import DestinationDetails from './pages/destinationDetails.js'

function App() {
  return (
    <div className="App">
      <Navbar />  
      <DestinationDetails />
      <Footer />
    </div>
  );
}

export default App;

