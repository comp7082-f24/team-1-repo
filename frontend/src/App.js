import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import LandingPage from './pages/landing.js';
import ActivitiesPlanner from './pages/activitiesPlanner.js';
import DestinationDetails from './pages/destinationDetails.js';
import SignIn from './pages/signin'
import Signup from './pages/signup';

function App() {
  const location = useLocation();

  const hideComponents = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <div className="App">
      {!hideComponents && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/details" element={<DestinationDetails />} />
        <Route path="/planner" element={<ActivitiesPlanner />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {!hideComponents && <Footer />}
    </div>
  );
}

export default App;

