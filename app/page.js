'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ResizableBox } from 'react-resizable';
import "react-resizable/css/styles.css";

import RealAsteroidSelector from '../components/RealAsteroidSelector';
import LiveAsteroidFeed from '../components/LiveAsteroidFeed';
import CustomAsteroidPanel from '../components/CustomAsteroidPanel';
import ImpactTimeline from '../components/ImpactTimeline';
import USGSEarthquakeLayer from '../components/usgsEarthquakeLayer';
import ClassroomPanel from '../components/Classroom/ClassroomPanel';

import { getAsteroidData, IMPACTOR_2025 } from '../lib/nasa-api';

import {
  calculateImpactEnergy,
  calculateCraterSize,
  calculateEarthquakeMagnitude,
  calculateTsunamiEffects,
  calculateCasualties,
  calculateMitigationEffect
} from '../physics/impact-calculations';

const LeafletMap = dynamic(() => import('../components/LeafletMap'), { ssr: false });
const Earth3D = dynamic(() => import('../simulation/Earth3D'), { ssr: false });
const ImpactChart = dynamic(() => import('../components/ImpactChart'), { ssr: false });

export default function Home() {

  const [asteroid, setAsteroid] = useState(IMPACTOR_2025);
  const [impactPoint, setImpactPoint] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [mitigationType, setMitigationType] = useState('none');
  const [results, setResults] = useState(null);
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState('DEMO');
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('Simulation');

  useEffect(() => {
    loadAsteroidData('impactor-2025');
  }, []);

  const loadAsteroidData = async (asteroidId) => {

    setIsLoading(true);

    const data = await getAsteroidData(asteroidId);

    setAsteroid(data);
    setImpactPoint({ lat: 20, lng: -150 });

    if (data.realData) {
      setDataSource('NASA REAL DATA');
    } else {
      setDataSource('DEMO SCENARIO');
    }

    setIsLoading(false);

  };

  const handleAsteroidSelect = async (asteroidId) => {
    await loadAsteroidData(asteroidId);
  };

  const runSimulation = () => {

    setIsSimulating(true);
    setIsPlaying(true);
    setTimelineProgress(0);

    const energy = calculateImpactEnergy(
      asteroid.diameter,
      asteroid.velocity,
      asteroid.density
    );

    const crater = calculateCraterSize(energy.energyMegatons);
    const earthquakeMag = calculateEarthquakeMagnitude(energy.energyMegatons);
    const tsunami = calculateTsunamiEffects(energy.energyMegatons);
    const casualties = calculateCasualties(energy.energyMegatons, 'medium');

    const simulationResult = {
      energy,
      crater,
      earthquakeMag,
      tsunami,
      casualties,
      affectedArea: Math.round(crater.diameter * 3),
      timestamp: new Date().toLocaleTimeString(),
      mitigationUsed: mitigationType,
      asteroidName: asteroid.name,
      dataSource: dataSource
    };

    setResults(simulationResult);
    setSimulationHistory(prev => [simulationResult, ...prev.slice(0, 4)]);

  };

  const applyMitigation = () => {

    if (mitigationType === 'none') {
      alert('Please select a mitigation strategy first!');
      return;
    }

    const newVelocity = calculateMitigationEffect(
      asteroid.velocity,
      mitigationType,
      365
    );

    const velocityChange = asteroid.velocity - newVelocity;
    const distanceIncrease = velocityChange * 50000;

    setAsteroid(prev => ({
      ...prev,
      velocity: newVelocity,
      miss_distance: prev.miss_distance + distanceIncrease,
      orbital_data: {
        ...prev.orbital_data,
        semi_major_axis: prev.orbital_data.semi_major_axis + (velocityChange * 0.1)
      }
    }));

    if (velocityChange > 0.1) {
      alert(`Mitigation successful! Velocity reduced by ${velocityChange.toFixed(2)} km/s.`);
    }

  };

  const resetSimulation = () => {

    setAsteroid(IMPACTOR_2025);
    setResults(null);
    setIsSimulating(false);
    setMitigationType('none');
    setDataSource('DEMO SCENARIO');


  };

  if (isLoading) {
    return (<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"> <div className="text-center"> <h1 className="text-2xl font-bold">Connecting to NASA API...</h1> <p className="text-blue-300">Fetching real asteroid data</p> </div> </div>
    );
  }

  return (


    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">

      {/* HEADER */}

      <header className="bg-black/50 py-4 px-6 border-b border-purple-500">
        <div className="max-w-7xl mx-auto text-center">

          <h1 className="text-4xl font-bold mb-2">
            Meteor Madness
          </h1>



          <div className={`inline-block mt-1 px-3 py-1 rounded text-sm font-bold ${dataSource.includes('REAL') ? 'bg-green-600' : 'bg-yellow-600'}`}>
            {dataSource}
          </div>

        </div>
      </header>

      {/* NAVIGATION TABS */}
      <nav className="bg-gray-900/80 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {['Simulation', 'Asteroid Data', 'Impact Map', 'Classroom Mode'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === tab
                  ? tab === 'Classroom Mode'
                    ? 'border-purple-500 text-purple-400 bg-purple-900/20'
                    : 'border-blue-500 text-blue-400 bg-blue-900/20'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  }`}
              >
                {tab}
                {tab === 'Classroom Mode' && (
                  <span className="ml-2 text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Premium
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 animate-fade-in">

        {/* SIMULATION TAB */}
        <div className={activeTab === 'Simulation' ? 'block' : 'hidden'}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            {/* LEFT PANEL */}

            <div className="bg-gray-800/50 rounded-lg p-6">

              <h2 className="text-2xl font-bold mb-4 text-blue-400">
                Asteroid Controls
              </h2>

              <RealAsteroidSelector
                onAsteroidSelect={handleAsteroidSelect}
                currentAsteroid={asteroid}
              />

              <CustomAsteroidPanel
                onSimulate={(customAsteroid) => {
                  setAsteroid(customAsteroid);
                  setImpactPoint(customAsteroid.impactPoint);
                  setDataSource('CUSTOM SIMULATION');
                  setResults(null);
                  setIsSimulating(false);
                }}
              />

              {/* Asteroid Properties */}
              {asteroid && (
                <div className="mt-6 bg-gray-900/60 p-4 rounded-lg border border-gray-700 shadow-inner">
                  <h3 className="text-sm font-bold text-gray-300 mb-3 border-b border-gray-700 pb-1 flex justify-between items-center">
                    <span>Asteroid Properties</span>
                    {asteroid.hazardous ? (
                      <span className="text-[10px] bg-red-900/50 text-red-400 px-2 py-0.5 rounded border border-red-500/30 uppercase tracking-wider">Potentially Hazardous</span>
                    ) : (
                      <span className="text-[10px] bg-green-900/50 text-green-400 px-2 py-0.5 rounded border border-green-500/30 uppercase tracking-wider">Safe</span>
                    )}
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 block text-xs">Diameter</span>
                      <span className="font-mono text-blue-300">{asteroid.diameter?.toLocaleString() || 0} meters</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs">Velocity</span>
                      <span className="font-mono text-blue-300">{asteroid.velocity?.toFixed(2) || 0} km/s</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs">Density</span>
                      <span className="font-mono text-blue-300">{asteroid.density?.toLocaleString() || 0} kg/m³</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs">Mass</span>
                      <span className="font-mono text-blue-300 text-xs truncate block" title={asteroid.density && asteroid.diameter ? `${Math.round(asteroid.density * (4 / 3) * Math.PI * Math.pow(asteroid.diameter / 2, 3)).toExponential(2)} kg` : '0 kg'}>
                        {asteroid.density && asteroid.diameter ? `${Math.round(asteroid.density * (4 / 3) * Math.PI * Math.pow(asteroid.diameter / 2, 3)).toExponential(2)} kg` : '0 kg'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mitigation Controls */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">🛡️ Mitigation Strategy</label>
                <select
                  value={mitigationType}
                  onChange={(e) => setMitigationType(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mb-3"
                >
                  <option value="none">No Mitigation</option>
                  <option value="kinetic">Kinetic Impactor</option>
                  <option value="gravity">Gravity Tractor</option>
                  <option value="nuclear">Nuclear Deflection</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={applyMitigation}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded font-medium transition duration-200"
                  >
                    Apply Mitigation
                  </button>
                  <button
                    onClick={runSimulation}
                    className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-3 rounded font-medium transition duration-200"
                  >
                    Simulate Impact
                  </button>
                </div>

                <button
                  onClick={resetSimulation}
                  className="w-full mt-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm"
                >
                  Reset Simulation
                </button>
              </div>

            </div>

            {/* CENTER PANEL */}

            <div className="bg-gray-800/50 rounded-lg p-4">

              <h2 className="text-xl font-bold mb-4 text-center">
                Live Orbital View
              </h2>

              <div className="flex justify-center w-full overflow-hidden">
                <ResizableBox
                  width={600}
                  height={400}
                  minConstraints={[300, 200]}
                  maxConstraints={[1000, 800]}
                  resizeHandles={["se"]}
                  className="border border-blue-500/30 rounded-lg overflow-hidden max-w-full"
                >

                  <div className="w-full h-full relative">

                    <Earth3D
                      impactPoint={impactPoint}
                      isImpact={isSimulating}
                      timelineProgress={timelineProgress}
                      isPlaying={isPlaying}
                      onProgressUpdate={setTimelineProgress}
                      orbitalData={asteroid.orbital_data}
                      hazardous={asteroid.hazardous}
                    />

                  </div>

                </ResizableBox>
              </div>

              {isSimulating && (
                <ImpactTimeline
                  progress={timelineProgress}
                  onProgressChange={(p) => {
                    setTimelineProgress(p);
                    setIsPlaying(false);
                  }}
                  isPlaying={isPlaying}
                  onTogglePlay={() => setIsPlaying(!isPlaying)}
                />
              )}

            </div>

            {/* RIGHT PANEL */}

            <div className="bg-gray-800/50 rounded-lg p-6">

              <h2 className="text-2xl font-bold mb-4 text-red-400">
                Impact Analysis
              </h2>

              {results && (
                <div className="space-y-4">
                  <div className="bg-blue-900/30 p-2 rounded text-center text-sm">
                    Simulating: <strong>{results.asteroidName}</strong> • {results.dataSource}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-900/30 p-3 rounded border border-red-500/30">
                      <div className="font-bold">💣 Energy Release</div>
                      <div className="text-xl">{results.energy.energyMegatons} Megatons TNT</div>
                      <div className="text-xs">({results.energy.hiroshimaEquivalent}x Hiroshima bomb)</div>
                    </div>

                    <div className="bg-orange-900/30 p-3 rounded border border-orange-500/30">
                      <div className="font-bold">🕳️ Crater Size</div>
                      <div>{(results.crater.diameter / 1000).toFixed(1)} km diameter</div>
                      <div className="text-xs">{(results.crater.depth / 1000).toFixed(1)} km deep</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-yellow-900/30 p-3 rounded border border-yellow-500/30">
                      <div className="font-bold">🌋 Earthquake</div>
                      <div>Magnitude {results.earthquakeMag}</div>
                      <div className="text-xs">Global effects</div>
                    </div>

                    <div className="bg-blue-900/30 p-3 rounded border border-blue-500/30">
                      <div className="font-bold">🌊 Tsunami</div>
                      <div>{results.tsunami.waveHeight}m waves</div>
                      <div className="text-xs">{results.tsunami.inundationDistance} km inland</div>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 p-3 rounded text-sm">
                    <div className="font-bold">📊 Estimated Impact</div>
                    <div>Casualties: {results.casualties.toLocaleString()}+ people</div>
                    <div>Area Affected: {results.affectedArea.toLocaleString()} km²</div>
                    <div className="text-xs mt-1 text-gray-400">Simulation: {results.timestamp}</div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* END GRID 3 COL AND SIMULATION TAB */}
        </div>

        {/* ASTEROID DATA TAB */}
        {activeTab === 'Asteroid Data' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12 mt-4">
            <LiveAsteroidFeed />
            <div className="bg-gray-800/50 p-6 rounded-lg h-[600px] flex flex-col">
              <h2 className="text-xl text-center font-bold mb-4 opacity-80 border-b border-gray-700 pb-2">Energy & Impact Breakdown</h2>
              <div className="flex-1 min-h-[400px]">
                <ImpactChart results={results} />
              </div>
            </div>
          </div>
        )}

        {/* IMPACT MAP TAB */}
        {activeTab === 'Impact Map' && (
          <div className="w-full h-[700px] border border-blue-500/30 mt-4 rounded-lg overflow-hidden bg-gray-800/50">
            <LeafletMap
              impactPoint={impactPoint}
              craterSize={results?.crater.diameter}
              tsunamiRadius={results?.tsunami?.inundationDistance}
              earthquakeRadius={results?.affectedArea}
            />
          </div>
        )}

        {/* CLASSROOM MODE TAB */}
        <div className={activeTab === 'Classroom Mode' ? 'block pb-12' : 'hidden'}>
          <ClassroomPanel
            onRunMission={(missionAsteroid) => {
              setAsteroid(missionAsteroid);
              setImpactPoint(missionAsteroid.impactPoint || { lat: 20, lng: -150 });
              setDataSource('CLASSROOM MISSION');
              setResults(null);
              setIsSimulating(false);
              setActiveTab('Simulation');
            }}
            simulationResult={results}
          />
        </div>

      </div>

    </div>

  );
}
