'use client';

export default function ScientificOverlay({ asteroid, results }) {
    if (!asteroid) return null;

    // Mass calculation = density * volume. (Density fallback to 3000 if not provided)
    const density = asteroid.density || 3000;
    const radius = asteroid.diameter / 2;
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    const massKg = density * volume;

    return (
        <div className="absolute top-4 right-4 bg-black/80 border border-blue-500/50 p-4 rounded-lg pointer-events-none text-xs w-64 backdrop-blur-sm shadow-xl z-10">
            <h3 className="text-blue-400 font-bold mb-2 uppercase border-b border-blue-500/30 pb-1">
                🛰️ Live Scientific Telemetry
            </h3>

            <div className="space-y-3">
                <div>
                    <div className="text-gray-400 mb-1 font-mono">ASTEROID DATA</div>
                    <div className="flex justify-between"><span>Diameter:</span> <span className="text-green-400">{asteroid.diameter} m</span></div>
                    <div className="flex justify-between"><span>Velocity:</span> <span className="text-green-400">{asteroid.velocity.toFixed(2)} km/s</span></div>
                    <div className="flex justify-between"><span>Mass:</span> <span className="text-green-400">{massKg.toExponential(2)} kg</span></div>
                    <div className="flex justify-between"><span>Density:</span> <span className="text-green-400">{density} kg/m³</span></div>
                </div>

                {results && (
                    <div>
                        <div className="text-gray-400 mb-1 mt-2 font-mono">IMPACT PHYSICS</div>
                        <div className="flex justify-between"><span>Energy (MT):</span> <span className="text-red-400">{results.energy.energyMegatons} MT</span></div>
                        <div className="flex justify-between"><span>TNT Equivalent:</span> <span className="text-red-400">{results.energy.hiroshimaEquivalent}x</span></div>
                        <div className="flex justify-between"><span>Crater Dia:</span> <span className="text-orange-400">{(results.crater.diameter / 1000).toFixed(2)} km</span></div>
                        <div className="flex justify-between"><span>Eq Mag:</span> <span className="text-yellow-400">{results.earthquakeMag} M</span></div>
                        <div className="flex justify-between"><span>Tsunami Height:</span> <span className="text-blue-300">{results.tsunami.waveHeight} m</span></div>
                    </div>
                )}
            </div>
        </div>
    );
}
