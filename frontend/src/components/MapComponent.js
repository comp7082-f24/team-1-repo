import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

// Styles for the map container
const containerStyle = {
  width: "100%",
  height: "500px",
};

// Default center if no location is found
const initialCenter = { lat: 0, lng: 0 };

// Replace with google api key
const GOOGLE_MAPS_API_KEY = "AIzaSyDPm_CxBIZnPxC40qgoZSKB92o4nXjyYNs";

const MapComponent = ({ location }) => {
  const [coordinates, setCoordinates] = useState(initialCenter); // Center of the map (start position)
  const [activities, setActivities] = useState([]); // Store activities from Geoapify
  const [selectedActivity, setSelectedActivity] = useState(null); // Track selected marker for InfoWindow
  const [startPosition, setStartPosition] = useState(null); // Track the start position marker

  // Fetch geocoding data to get coordinates from the location name
  useEffect(() => {
    if (location) {
      fetch(`/getcoordinates?location=${location}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.latitude && data.longitude) {
            const newCoordinates = { lat: data.latitude, lng: data.longitude };
            setCoordinates(newCoordinates); // Update map center
            setStartPosition(newCoordinates); // Set start position marker
            fetchPlaces(data.latitude, data.longitude); // Fetch nearby activities
          }
        })
        .catch((error) => console.error("Error fetching coordinates:", error));
    }
  }, [location]);

  // Function to fetch nearby activities from Geoapify
  const fetchPlaces = (latitude, longitude) => {
    fetch(`/getplaces?latitude=${latitude}&longitude=${longitude}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.features);
        if (data.features) {
          setActivities(data.features); // Update activities state with fetched data
        }
      })
      .catch((error) => console.error("Error fetching places:", error));
  };

  console.log(activities);

  // Handle marker click event
  const handleMarkerClick = (activity) => {
    setSelectedActivity(activity); // Set the clicked marker's activity
  };

  // Close the InfoWindow
  const handleInfoWindowClose = () => {
    setSelectedActivity(null); // Close the InfoWindow
  };

  return (
    <div>
      {location && (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={coordinates}
            zoom={12}
          >

            {/* Display markers for nearby activities fetched from Geoapify */}
            {activities.map((activity, i) => (
              <Marker
                key={`${activity.properties.id}-${i}`}
                position={{
                  lat: activity.geometry.coordinates[1], // latitude from Geoapify
                  lng: activity.geometry.coordinates[0], // longitude from Geoapify
                }}
                title={activity.properties.name}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-pushpin.png", // Custom pin for nearby activities
                }}
                animation={window.google.maps.Animation.DROP} // Drop animation
                onClick={() => handleMarkerClick(activity)} // Handle marker click
              />
            ))}

            {/* Display InfoWindow when a marker is clicked */}
            {selectedActivity && (
              <InfoWindow
                position={{
                  lat: selectedActivity.geometry.coordinates[1],
                  lng: selectedActivity.geometry.coordinates[0],
                }}
                onCloseClick={handleInfoWindowClose}
                pixelOffset={(0, 0)}

              >
                <div style={{ maxWidth: "200px" }}>
                  <h2>{selectedActivity.properties.name}</h2>
                  <p>
                    <strong>Category:</strong>{" "}
                    {selectedActivity.properties.categories}
                  </p>
                  <p>
                    <strong>Distance:</strong>{" "}
                    {selectedActivity.properties.distance} meters
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}
      {!location && (
        <div className="w-full h-[500px] animate-pulse bg-slate-300 rounded">
          <div className="flex justify-center p-4 mx-auto py-[25%]">
            Please enter a location to search for activities.
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
