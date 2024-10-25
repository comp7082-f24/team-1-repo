import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import LandingPage from "./pages/landing.js";
import ActivitiesPlanner from "./pages/activitiesPlanner.js";
import DestinationDetails from "./pages/destinationDetails.js";
import SignIn from "./pages/signin";
import Signup from "./pages/signup";
import UserProfile from "./pages/userProfile";
import { AppContextProvider } from "./utils/contexts";

function App() {
  const location = useLocation();
  const hideComponents =
    location.pathname === "/signin" || location.pathname === "/signup";

  return (
    <div className="App">
      <AppContextProvider>
        {!hideComponents && <Navbar />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/details" element={<DestinationDetails />} />
          <Route path="/planner" element={<ActivitiesPlanner />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
        {!hideComponents && <Footer />}
      </AppContextProvider>
    </div>
  );
}

export default App;
