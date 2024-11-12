import React, { useEffect, useState } from "react";
import EventCard from "../components/eventCard/eventCard";

// Replace with your Geoapify API key
const GEOAPIFY_API_KEY = "1bff187db2c849e1a26c02a3c16c8462";

const ActivityCards = ({ latitude, longitude, onAdd, onRemove }) => {
  const [activities, setLocalActivities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v2/places?categories=entertainment,tourism&limit=10&apiKey=${GEOAPIFY_API_KEY}&filter=circle:${longitude},${latitude},10000`
        );

        if (!response.ok) {
          throw new Error("Error fetching activities");
        }

        const data = await response.json();
        setLocalActivities(data.features); // Store activities from Geoapify response
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError(err.message);
      }
    };

    if (latitude && longitude) {
      fetchActivities();
    }
  }, [latitude, longitude]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="h-[1100px] pb-[200px] overflow-auto">
      {!activities.length &&
        !error &&
        new Array(10).fill(null).map((item) => (
          <div class="border border-[#ccc] shadow rounded-md p-4 m-4 mr-6 h-[300px]">
            <div class="animate-pulse flex space-x-4">
              <div class="flex-1 space-y-6 py-4">
                <div class="h-4 bg-slate-700 rounded"></div>
                <div class="h-2 bg-slate-700 rounded"></div>
                <div class="h-2 bg-slate-700 rounded"></div>
                <div class="space-y-4">
                  <div class="grid grid-cols-12 gap-4">
                    <div class="h-2 bg-slate-700 rounded col-span-3"></div>
                    <div class="h-2 bg-slate-700 rounded col-span-9"></div>
                  </div>
                  <div class="grid grid-cols-12 gap-4">
                    <div class="h-2 bg-slate-700 rounded col-span-3"></div>
                    <div class="h-2 bg-slate-700 rounded col-span-9"></div>
                  </div>
                  <div class="grid grid-cols-12 gap-4">
                    <div class="h-2 bg-slate-700 rounded col-span-3"></div>
                    <div class="h-2 bg-slate-700 rounded col-span-9"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      {activities.map((activity, i) => (
        <div
          key={`${activity.properties.place_id}-${i}`}
          className="box-border border border-solid border-[#ccc] rounded-md shadow p-4 m-4 mr-6 flex flex-col h-auto max-h-[400px]"
        >
          <EventCard
            event={activity.properties}
            onAddEvent={(event) => onAdd(event)}
          />
        </div>
      ))}
    </div>
  );
};

export default ActivityCards;
