'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getNearbyEarthquakes } from '../lib/usgs-api';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function LeafletMap({ impactPoint, craterSize, tsunamiRadius, earthquakeRadius }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);



  // Removed synchronous earthquake fetch

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView([20, 0], 2);

    // Add real tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapInstance.current);

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !impactPoint) return;

    // Clear previous layers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Circle || layer instanceof L.CircleMarker || layer instanceof L.Marker) {
        mapInstance.current.removeLayer(layer);
      }
    });

    // Add impact point marker
    L.marker([impactPoint.lat, impactPoint.lng])
      .addTo(mapInstance.current)
      .bindPopup('Impact Epicenter')
      .openPopup();

    // Add crater zone
    L.circle([impactPoint.lat, impactPoint.lng], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.3,
      radius: Math.max(50000, (craterSize || 500) * 50)
    }).addTo(mapInstance.current);

    // Add earthquake zone
    L.circle([impactPoint.lat, impactPoint.lng], {
      color: 'orange',
      fillColor: 'none',
      fillOpacity: 0,
      radius: Math.max(200000, (earthquakeRadius || 10000) * 20)
    }).addTo(mapInstance.current);

    // Add tsunami zone
    L.circle([impactPoint.lat, impactPoint.lng], {
      color: 'blue',
      fillColor: 'none',
      fillOpacity: 0,
      radius: Math.max(500000, (tsunamiRadius || 5000) * 100)
    }).addTo(mapInstance.current);

    // Fetch and add USGS Earthquakes async
    let isActive = true;
    (async () => {
      const data = await getNearbyEarthquakes(impactPoint.lat, impactPoint.lng);
      if (!isActive || !mapInstance.current) return;

      data.forEach(eq => {
        L.circleMarker([eq.lat, eq.lng], {
          radius: eq.magnitude * 2,
          color: 'yellow',
          fillColor: 'yellow',
          fillOpacity: 0.5
        })
          .addTo(mapInstance.current)
          .bindPopup(`USGS Earthquake<br>Mag: ${eq.magnitude}`);
      });
    })();

    return () => { isActive = false; };
  }, [impactPoint, craterSize, tsunamiRadius, earthquakeRadius]);

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-white text-lg mb-2">🗺️ Interactive World Map</h3>
      <div
        ref={mapRef}
        className="w-full h-64 rounded border-2 border-blue-500"
      />
      <div className="flex flex-wrap gap-4 mt-3 text-white text-sm justify-center">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
          Impact Epicenter
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-600 rounded-full mr-2 opacity-40"></div>
          Crater Zone
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 border-2 border-yellow-500 rounded-full mr-2"></div>
          Earthquake Zone
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 border-2 border-blue-500 rounded-full mr-2"></div>
          Tsunami Zone
        </div>
      </div>
    </div>
  );
}