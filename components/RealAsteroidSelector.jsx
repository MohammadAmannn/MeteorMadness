'use client';
import { useState } from 'react';
import { useEffect } from 'react';
import { getLatestAsteroids } from '../lib/nasa-api';
export default function RealAsteroidSelector({ onAsteroidSelect, currentAsteroid }) {
  const [selectedAsteroid, setSelectedAsteroid] = useState('');
  const [asteroids, setAsteroids] = useState([]);

  useEffect(() => {

    async function loadAsteroids() {
      const data = await getLatestAsteroids();
      setAsteroids(data);
    }

    loadAsteroids();

  }, []);

  const handleSelect = async (asteroidId) => {
    setSelectedAsteroid(asteroidId);

    if (asteroidId === 'impactor-2025') {
      onAsteroidSelect('impactor-2025'); // Demo asteroid
    } else if (asteroidId) {
      onAsteroidSelect(asteroidId); // Real asteroid
    }
  };

  return (
    <div className="bg-gray-700/30 p-4 rounded border border-blue-500/30">
      <label className="block text-sm font-medium mb-2">
        🌠 Asteroid Selection Mode:
        <span className={`ml-2 px-2 py-1 rounded text-xs ${currentAsteroid.realData ? 'bg-green-600' : 'bg-yellow-600'}`}>
          {currentAsteroid.realData ? 'REAL NASA DATA' : 'DEMO MODE'}
        </span>
      </label>

      <select
        value={selectedAsteroid}
        onChange={(e) => handleSelect(e.target.value)}
        className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-sm mb-2"
      >
        <option value="">-- Choose an Asteroid --</option>
        <option value="impactor-2025">🚀 Impactor-2025 (Demo Scenario)</option>
        <optgroup label="🔭 Real Asteroids (NASA Live Data)">
          {asteroids.map(asteroid => (
            <option key={asteroid.id} value={asteroid.id}>
              {asteroid.name} - {asteroid.description}
            </option>
          ))}
        </optgroup>
      </select>

      <div className="text-xs text-gray-400">
        {currentAsteroid.realData ? (
          <>✅ Showing <strong>real data</strong> from NASA API</>
        ) : (
          <>🔄 Using <strong>demo data</strong> for simulation</>
        )}
      </div>
    </div>
  );
}