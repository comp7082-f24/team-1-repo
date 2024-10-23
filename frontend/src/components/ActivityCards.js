import React, { useEffect, useState } from "react";

// Replace with your Geoapify API key

const ActivityCards = ({ latitude, longitude }) => {
  const [activities, setLocalActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v2/places?categories=entertainment&bias=proximity:${longitude},${latitude}&limit=5&apiKey=${process.env.REACT_APP_GEOAPIFY_API_KEY}&circle=circle:${longitude},${latitude},1000`
        );

        if (!response.ok) {
          throw new Error("Error fetching activities");
        }

        const data = await response.json();
        setLocalActivities(data.features); // Store activities from Geoapify response
        setLoading(false);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchActivities();
    }
  }, [latitude, longitude]);

  if (loading) {
    return <p>Loading activities...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="h-[1100px] pb-[200px] overflow-auto">
      {activities.map((activity, i) => (
        <div
          key={`${activity.properties.id}-${i}`}
          className="box-border border border-solid border-[#ccc] rounded-md p-4 m-4 flex flex-col h-auto max-h-[400px] overflow-hidden"
        >
          <h3 style={{ marginBottom: "10px", fontSize: "1.25rem" }}>
            {activity.properties.name || "No Name Available"}
          </h3>
          <p style={{ marginBottom: "10px", overflowWrap: "break-word" }}>
            {activity.properties.categories
              ? activity.properties.categories.join(", ")
              : "No categories available"}
          </p>
          <p style={{ marginBottom: "5px" }}>
            <strong>Distance:</strong>{" "}
            {activity.properties.distance || "Unknown"} meters
          </p>
          <p style={{ marginBottom: "5px" }}>
            <strong>Address:</strong>{" "}
            {activity.properties.formatted || "No address available"}
          </p>
          <p>
            <strong>City:</strong>{" "}
            {activity.properties.county || "No city available"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ActivityCards;
