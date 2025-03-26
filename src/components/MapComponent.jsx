import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapComponent = ({ pickupCoordinates, dropoffCoordinates }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const pickupMarker = useRef(null);
  const dropoffMarker = useRef(null);
  const [info, setInfo] = useState(null); // Store route info

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40],
      zoom: 10,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl());

    return () => mapRef.current.remove();
  }, []);

  useEffect(() => {
    if (pickupCoordinates) {
      if (pickupMarker.current) pickupMarker.current.remove();
      pickupMarker.current = new mapboxgl.Marker({ color: "green" })
        .setLngLat(pickupCoordinates)
        .addTo(mapRef.current);
    }

    if (dropoffCoordinates) {
      if (dropoffMarker.current) dropoffMarker.current.remove();
      dropoffMarker.current = new mapboxgl.Marker({ color: "red" })
        .setLngLat(dropoffCoordinates)
        .addTo(mapRef.current);
    }

    if (pickupCoordinates && dropoffCoordinates) {
      drawRoute(pickupCoordinates, dropoffCoordinates);
    }
  }, [pickupCoordinates, dropoffCoordinates]);

  const drawRoute = async (start, end) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    const response = await fetch(url);
    const data = await response.json();

    const route = data.routes[0]?.geometry;
    const duration = data.routes[0]?.duration; // in seconds
    const distance = data.routes[0]?.distance; // in meters

    setInfo({
      duration: (duration / 60).toFixed(1), // convert to minutes
      distance: (distance / 1000).toFixed(2), // convert to km
      eta: new Date(Date.now() + duration * 1000).toLocaleTimeString(),
    });

    if (mapRef.current.getSource("route")) {
      mapRef.current.getSource("route").setData({
        type: "Feature",
        geometry: route,
      });
    } else {
      mapRef.current.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: route,
          },
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#1DB954",
          "line-width": 4,
        },
      });
    }

    // Fit bounds
    const bounds = new mapboxgl.LngLatBounds();
    route.coordinates.forEach((coord) => bounds.extend(coord));
    mapRef.current.fitBounds(bounds, { padding: 60 });
  };

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "500px", borderRadius: "10px" }}
      />
      {info && (
        <div className="mt-4 text-sm text-center text-gray-700">
          <p>📏 Distance: <strong>{info.distance} km</strong></p>
          <p>⏱ Duration: <strong>{info.duration} minutes</strong></p>
          <p>🕒 Estimated Arrival: <strong>{info.eta}</strong></p>
          <p>📝 Request Time: <strong>{new Date().toLocaleTimeString()}</strong></p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
