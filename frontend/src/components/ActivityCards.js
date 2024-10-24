import React, { useEffect, useState } from "react";

// Replace with your Geoapify API key

const ActivityCards = ({ latitude, longitude }) => {
  const [activities, setLocalActivities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v2/places?categories=entertainment&bias=proximity:${longitude},${latitude}&limit=10&apiKey=${process.env.REACT_APP_GEOAPIFY_API_KEY}&circle=circle:${longitude},${latitude},1000`
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
          key={`${activity.properties.id}-${i}`}
          className="box-border border border-solid border-[#ccc] rounded-md shadow p-4 m-4 mr-6 flex flex-col h-auto max-h-[400px]"
        >
          <h3 className="flex">
            {activity.properties.name || "No Name Available"}
            {activity.properties.datasource?.raw?.website && (
              <a
                className="flex text-lg font-semibold inline"
                href={activity.properties.datasource?.raw?.website}
              >
                <span className="ml-2 text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </span>
              </a>
            )}
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
