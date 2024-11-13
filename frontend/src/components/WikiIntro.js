import { useState, useEffect } from "react";
import { useLocationData } from "../utils/contexts";
export default function WikiIntro() {
  const [locationInfo, setLocationInfo] = useState({});
  const [locationData, setLocationData] = useLocationData();

  useEffect(() => {
    if (locationData?.location) {
      const fetchLocationData = async () => {
        try {
          const response = await fetch(`/wiki-summary?location=${encodeURIComponent(locationData.location)}`);
          if (!response.ok) {
            throw new Error("Location not found.");
          }
          const data = await response.json();
          setLocationInfo(data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchLocationData();
    }
  }, []);


  return (
    <div className="flex flex-row items-start col-span-12 space-x-4">
      {locationInfo.thumbnail && (
        <img
          src={locationInfo.originalimage.source}
          alt={locationInfo.title}
          className="w-1/4 rounded-md"
        />
      )}
      {locationInfo.extract && <p className="w-3/4">{locationInfo.extract}</p>}
    </div>
  );
}
