'use client';
import { useEffect, useState } from 'react';
import { getNearbyEarthquakes } from '../lib/usgs-api';

export default function USGSEarthquakeLayer({ impactPoint }) {

    const [earthquakes, setEarthquakes] = useState([]);

    useEffect(() => {
        if (!impactPoint) return;

        async function loadEarthquakes() {
            const data = await getNearbyEarthquakes(
                impactPoint.lat,
                impactPoint.lng,
                500
            );
            setEarthquakes(data);
        }

        loadEarthquakes();
    }, [impactPoint]);

    return (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-yellow-500/30">
            <h3 className="text-lg font-bold mb-3">
                🌎 USGS Seismic Activity (Nearby)
            </h3>

            {earthquakes.length === 0 ? (
                <p className="text-sm text-gray-400">
                    No recent earthquakes detected nearby
                </p>
            ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {earthquakes.map((eq, index) => (
                        <div key={index} className="bg-gray-700/30 p-2 rounded text-sm">
                            <div className="font-bold">
                                Magnitude {eq.magnitude}
                            </div>
                            <div className="text-xs text-gray-300">
                                {eq.place}
                            </div>
                            <div className="text-xs text-gray-400">
                                Depth: {eq.depth} km
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500/30 rounded text-xs text-blue-200">
                <p className="font-bold mb-1">Impact vs Natural Earthquakes</p>
                <p>
                    Natural tectonic earthquakes generate deep seismic waves over fault lines.
                    In contrast, asteroid impacts transfer kinetic energy from the surface downwards,
                    creating intense but localized high-frequency shockwaves resembling shallow nuclear detonations.
                </p>
            </div>

            <div className="text-xs text-gray-400 mt-2">
                📡 Data sourced from USGS Earthquake API
            </div>
        </div>
    );
}