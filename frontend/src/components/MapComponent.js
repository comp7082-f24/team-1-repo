import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// Styles for the map container
const containerStyle = {
    width: '100%',
    height: '500px',
};

// Default center if no location is found
const initialCenter = { lat: 0, lng: 0 };

// Replace with your Geoapify API key
const GEOAPIFY_API_KEY = "1bff187db2c849e1a26c02a3c16c8462";

// Replace with google api key
const GOOGLE_MAPS_API_KEY = "AIzaSyDPm_CxBIZnPxC40qgoZSKB92o4nXjyYNs"

const MapComponent = ({ location }) => {
    const [coordinates, setCoordinates] = useState(initialCenter); // Center of the map (start position)
    const [activities, setActivities] = useState([]); // Store activities from Geoapify
    const [selectedActivity, setSelectedActivity] = useState(null); // Track selected marker for InfoWindow
    const [startPosition, setStartPosition] = useState(null); // Track the start position marker

    // Fetch geocoding data to get coordinates from the location name
    useEffect(() => {
        const geocodeURL = `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`;
        fetch(geocodeURL)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const { latitude, longitude } = data.results[0];
                    const startPosition = { lat: latitude, lng: longitude };
                    setCoordinates(startPosition);
                    setStartPosition(startPosition);  // Set the start position marker

                    // Fetch nearby places using Geoapify after getting coordinates
                    fetchPlaces(latitude, longitude);
                }
            })
            .catch(error => console.error('Error fetching geocoding data:', error));
    }, [location]);

    // Function to fetch nearby activities from Geoapify
    const fetchPlaces = (lat, lng) => {
        const placesURL = `https://api.geoapify.com/v2/places?categories=entertainment,tourism&limit=10&apiKey=${GEOAPIFY_API_KEY}&filter=circle:${lng},${lat},10000`;

        fetch(placesURL)
            .then(response => response.json())
            .then(data => {
                if (data.features) {
                    setActivities(data.features); // Store activities in state
                }
            })
            .catch(error => console.error('Error fetching activities:', error));
    };

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
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={coordinates}
                    zoom={12}
                >
                    {/* Marker for the start position */}
                    {startPosition && (
                        <Marker
                            position={startPosition}
                            title="Start Position"
                            label={{
                                text: 'Start',  // Label for the start position marker
                                color: 'black',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                backgroundColor: 'white',
                            }}
                            icon={{
                                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Custom icon for the start position
                            }}
                        />
                    )}

                    {/* Display markers for nearby activities fetched from Geoapify */}
                    {activities.map((activity,i) => (
                        <Marker
                            key={`${activity.properties.id}-${i}`}
                            position={{
                                lat: activity.geometry.coordinates[1], // latitude from Geoapify
                                lng: activity.geometry.coordinates[0], // longitude from Geoapify
                            }}
                            label={{
                                text: activity.properties.name,  // Display activity name
                                color: 'black',  // Customize the text color
                                fontSize: '16px', // Customize the font size
                                fontWeight: 'bold',
                                fontFamily: 'Roboto',
                            }}
                            title={activity.properties.name}
                            icon={{
                                url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png', // Custom pin for nearby activities
                            }}
                            animation={window.google.maps.Animation.BOUNCE} // Drop animation
                            onClick={() => handleMarkerClick(activity)} // Handle marker click
                        />
                    ))}

                    {/* Display InfoWindow when a marker is clicked */}
                    {selectedActivity && (
                        <InfoWindow
                            position={{
                                lat: selectedActivity.geometry.coordinates[1],
                                lng: selectedActivity.geometry.coordinates[0]
                            }}
                            onCloseClick={handleInfoWindowClose}
                        >
                            <div style={{ maxWidth: '200px' }}>
                                <h4>{selectedActivity.properties.name}</h4>
                                <p><strong>Category:</strong> {selectedActivity.properties.category}</p>
                                <p><strong>Distance:</strong> {selectedActivity.properties.distance} meters</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default MapComponent;
