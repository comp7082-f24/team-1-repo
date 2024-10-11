import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import LandingPage from './pages/landing.js';
import ActivitiesPlanner from './pages/activitiesPlanner.js';
import DestinationDetails from './pages/destinationDetails.js'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/details" element={<DestinationDetails />} />
        <Route path="/planner" element={<ActivitiesPlanner />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

