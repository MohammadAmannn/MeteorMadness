'use client';

import { useState } from 'react';

export default function CustomAsteroidPanel({ onSimulate }) {
    const [diameter, setDiameter] = useState(500); // meters
    const [velocity, setVelocity] = useState(15.5); // km/s
    const [distance, setDistance] = useState(100000); // km
    const [density, setDensity] = useState(3000); // kg/m3
    const [lat, setLat] = useState(20);
    const [lng, setLng] = useState(-150);
    const [hazardous, setHazardous] = useState(true);

    const handleSimulate = () => {
        onSimulate({
            name: 'Custom Asteroid',
            diameter: Number(diameter),
            velocity: Number(velocity),
            miss_distance: Number(distance),
            density: Number(density),
            hazardous,
            impactPoint: { lat: Number(lat), lng: Number(lng) },
            orbital_data: {
                semi_major_axis: 1.5, // Dummy orbit data for visual
                eccentricity: 0.2,
                inclination: 5
            },
            realData: false
        });
    };

    return (
        <div className="bg-gray-700/30 p-4 rounded mt-4 border-l-4 border-purple-500">
            <h3 className="font-bold text-lg mb-3 text-purple-400">🛠️ Custom Asteroid Simulation</h3>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div>
                    <label className="block text-gray-300 mb-1">Diameter (m)</label>
                    <input
                        type="number"
                        value={diameter}
                        onChange={(e) => setDiameter(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-1">Velocity (km/s)</label>
                    <input
                        type="number"
                        value={velocity}
                        onChange={(e) => setVelocity(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-1">Distance (km)</label>
                    <input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-1">Density (kg/m³)</label>
                    <input
                        type="number"
                        value={density}
                        onChange={(e) => setDensity(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-1">Impact Latitude</label>
                    <input
                        type="number"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-1">Impact Longitude</label>
                    <input
                        type="number"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1"
                    />
                </div>
            </div>

            <div className="flex items-center mb-4">
                <input
                    type="checkbox"
                    id="hazardous"
                    checked={hazardous}
                    onChange={(e) => setHazardous(e.target.checked)}
                    className="mr-2"
                />
                <label htmlFor="hazardous" className="text-sm cursor-pointer">
                    Potentially Hazardous Asteroid
                </label>
            </div>

            <button
                onClick={handleSimulate}
                className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-medium transition duration-200"
            >
                Set Custom Asteroid
            </button>
        </div>
    );
}
