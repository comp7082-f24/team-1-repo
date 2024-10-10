import React from 'react';
import Navbar from './components/navbar';
import Footer from './components/footer';
import LandingPage from './pages/landing.js';
import ActivitiesPlanner from './pages/activitiesPlanner.js';

function App() {
  return (
    <div className="App">
      <Navbar />
      {/* <LandingPage /> */}
      <ActivitiesPlanner />
      <Footer />
    </div>
  );
}

export default App;

