'use client';
import { useState, useEffect } from 'react';
import { getCloseApproachAsteroids } from '../lib/nasa-api';

export default function LiveAsteroidFeed() {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    loadLiveAsteroids();
    // Refresh every 2 minutes
    const interval = setInterval(loadLiveAsteroids, 120000);
    return () => clearInterval(interval);
  }, []);

  const loadLiveAsteroids = async () => {
    setLoading(true);
    try {
      const liveAsteroids = await getCloseApproachAsteroids();
      setAsteroids(liveAsteroids);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error loading live asteroids:', error);
    }
    setLoading(false);
  };

  const getHazardColor = (hazardous) => {
    return hazardous ? 'text-red-400' : 'text-green-400';
  };

  const getHazardIcon = (hazardous) => {
    return hazardous ? '⚠️' : '✅';
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-green-500/30">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold">🛰️ Live Asteroid Feed (NASA)</h3>
        <button
          onClick={loadLiveAsteroids}
          className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
          disabled={loading}
        >
          {loading ? '🔄' : '↻'}
        </button>
      </div>

      {lastUpdated && (
        <div className="text-xs text-gray-400 mb-2">Last updated: {lastUpdated}</div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
          <p className="text-sm mt-2">Loading live data from NASA...</p>
        </div>
      ) : asteroids.length === 0 ? (
        <div className="text-center py-4 text-gray-400">
          <p>No close approaches today</p>
          <p className="text-xs">(NASA data updates daily)</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {asteroids.map(asteroid => (
            <div key={asteroid.id} className="bg-gray-700/30 p-3 rounded text-sm">
              <div className="flex justify-between items-start">
                <div className="font-bold">{asteroid.name}</div>
                <span className={`text-xs px-2 py-1 rounded ${getHazardColor(asteroid.hazardous)}`}>
                  {getHazardIcon(asteroid.hazardous)} {asteroid.hazardous ? 'HAZARDOUS' : 'SAFE'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                <div>Size: <span className="text-yellow-400">{asteroid.diameter}m</span></div>
                <div>Speed: <span className="text-yellow-400">{asteroid.velocity.toFixed(1)} km/s</span></div>
                <div>Distance: <span className="text-yellow-400">{asteroid.miss_distance.toLocaleString()} km</span></div>
                <div>Date: <span className="text-yellow-400">Today</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-400 mt-2">
        📡 Data sourced directly from NASA NEO API
      </div>
    </div>
  );
}