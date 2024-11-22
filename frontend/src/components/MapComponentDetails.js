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

const MapComponentDetails = ({ location, events }) => {
  const [coordinates, setCoordinates] = useState(initialCenter); // Center of the map (start position)
  const [selectedEvent, setSelectedEvent] = useState(null); // Track selected marker for InfoWindow

  // Fetch geocoding data to get coordinates from the location name
  useEffect(() => {
    if (location) {
      fetch(`/getcoordinates?location=${location}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.latitude && data.longitude) {
            const newCoordinates = { lat: data.latitude, lng: data.longitude };
            setCoordinates(newCoordinates); // Update map center
          }
        })
        .catch((error) => console.error("Error fetching coordinates:", error));
    }
  }, [location]);

  // Handle marker click event
  const handleMarkerClick = (event) => {
    setSelectedEvent(event); // Set the clicked marker's event
  };

  // Close the InfoWindow
  const handleInfoWindowClose = () => {
    setSelectedEvent(null); // Close the InfoWindow
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
            {/* Display markers for events */}
            {events.map((event, i) => (
              <Marker
                key={`${event.id}-${i}`}
                position={{
                  lat: event.latitude,
                  lng: event.longitude,
                }}
                title={event.title}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-pushpin.png", // Custom pin for events
                }}
                onClick={() => handleMarkerClick(event)} // Handle marker click
              />
            ))}

            {/* Display InfoWindow when a marker is clicked */}
            {selectedEvent && (
              <InfoWindow
                position={{
                  lat: selectedEvent.latitude,
                  lng: selectedEvent.longitude,
                }}
                onCloseClick={handleInfoWindowClose}
              >
                <div style={{ maxWidth: "500px" }}>
                  <h2>{selectedEvent.title}</h2>
                  <p>
                    <strong>Description:</strong> {selectedEvent.description}
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

export default MapComponentDetails;
