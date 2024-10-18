import React, { useEffect, useState } from 'react';

// Replace with your Amadeus API credentials
const AMADEUS_API_KEY = 'xbXo723ATDIAuIVPcGxsO88HC8K8GpH9';
const AMADEUS_API_SECRET = 'cAEsD28jqbsL3yWV';

const ActivityCards = ({ latitude, longitude }) => {
  const [activities, setLocalActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'grant_type': 'client_credentials',
            'client_id': AMADEUS_API_KEY,
            'client_secret': AMADEUS_API_SECRET,
          }),
        });

        const data = await response.json();
        return data.access_token;
      } catch (err) {
        console.error('Error fetching access token:', err);
        setError('Failed to get API access token');
      }
    };
    console.log(latitude, longitude);

    const fetchActivities = async (accessToken) => {
      try {
        const response = await fetch(
          `https://test.api.amadeus.com/v1/shopping/activities?latitude=${latitude}&longitude=${longitude}&radius=5`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(response);

        if (!response.ok) {
          throw new Error('Error fetching activities');
        }

        const data = await response.json();
        console.log(data.data);
        setLocalActivities(data.data);  // Store activities in the local state
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    const initFetch = async () => {
      const accessToken = await fetchAccessToken();
      if (accessToken) {
        fetchActivities(accessToken);
      }
    };

    initFetch();
  }, [latitude, longitude]);

  if (loading) {
    return <p>Loading activities...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Nearby Points of Interest</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {activities.map(activity => (
          <div
            key={activity.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              margin: '10px',
              width: '250px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h3>{activity.name}</h3>
            <p>{activity.category}</p>
            <p><strong>Distance:</strong> {activity.distance} meters</p>
            <p><strong>Geo Location:</strong> {activity.geoCode.latitude}, {activity.geoCode.longitude}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityCards;
