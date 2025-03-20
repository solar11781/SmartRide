import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// mapboxgl.accessToken =
//   import.meta.env.MAPBOX_TOKEN;

const MapComponent = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Initialize the map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // Reference to the map container div
      style: "mapbox://styles/mapbox/streets-v11", // Map style (changeable)
      center: [-74.5, 40], // Default longitude, latitude (New York City example)
      zoom: 9, // Initial zoom level
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl());

    return () => map.remove(); // Clean up the map on unmount
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "500px", borderRadius: "10px" }}
    />
  );
};

export default MapComponent;
