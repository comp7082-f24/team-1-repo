// MapComponent.js
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import ActivityCards from './ActivityCards';

const containerStyle = {
    width: '100%',
    height: '500px',
};

const initialCenter = { lat: 0, lng: 0 }; // Default center if no location is found

const MapComponent = ({ location, events }) => {
    const [coordinates, setCoordinates] = useState(initialCenter);

    // Fetch geocoding data to get coordinates from the location name
    useEffect(() => {
        const URL = `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`;
        fetch(URL)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const { latitude, longitude } = data.results[0];
                    setCoordinates({ lat: latitude, lng: longitude });
                }
            })
            .catch(error => console.error('Error fetching geocoding data:', error));
    }, [location]);

    return (
        <div>
            <LoadScript googleMapsApiKey="AIzaSyDPm_CxBIZnPxC40qgoZSKB92o4nXjyYNs">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={coordinates}
                    zoom={10}
                >
                    {/* Add the initial marker for the searched location */}
                    <Marker position={coordinates} />

                    {/* Add event markers to the map */}
                    {events && events.map(event => (
                        event.venue && event.venue.latitude && event.venue.longitude ? (
                            <Marker
                                key={event.id}
                                position={{
                                    lat: parseFloat(event.venue.latitude),
                                    lng: parseFloat(event.venue.longitude),
                                }}
                                title={event.name.text}
                            />
                        ) : null
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}

export default MapComponent;
