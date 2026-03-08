import React from 'react';
import { Play, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function MissionChallengePanel({ assignment, hasSubmitted, isActive, simulationResult, onRun, onSubmitReport }) {
    return (
        <div className={`rounded-lg border p-5 flex flex-col h-full relative overflow-hidden transition-all duration-300 ${assignment.isMission
                ? 'bg-purple-900/20 border-purple-500/40 hover:border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                : 'bg-gray-800/60 border-gray-600 hover:border-blue-500/50'
            }`}>

            {/* Background glow for missions */}
            {assignment.isMission && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            )}

            <div className="flex justify-between items-start mb-3 z-10 relative">
                <h4 className={`font-bold text-xl ${assignment.isMission ? 'text-purple-300' : 'text-blue-300'} pr-2`}>
                    {assignment.title}
                </h4>
                {assignment.isMission ? (
                    <span className="bg-purple-600 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold shadow-lg shadow-purple-500/30">
                        Mission
                    </span>
                ) : (
                    <span className="bg-blue-900 text-blue-200 text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">
                        Standard
                    </span>
                )}
            </div>

            <p className="text-gray-300 text-sm mb-4 flex-1 z-10 relative bg-gray-900/40 p-3 rounded-md border border-gray-700/50">
                {assignment.instructions}
            </p>

            {/* Required Parameters Preview */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-900 p-2 rounded text-center border border-gray-800 text-xs shadow-inner">
                    <div className="text-gray-500 mb-1">Diameter</div>
                    <div className="font-mono text-gray-200">{assignment.parameters.diameter}m</div>
                </div>
                <div className="bg-gray-900 p-2 rounded text-center border border-gray-800 text-xs shadow-inner">
                    <div className="text-gray-500 mb-1">Velocity</div>
                    <div className="font-mono text-gray-200">{assignment.parameters.velocity}km/s</div>
                </div>
                <div className="bg-gray-900 p-2 rounded text-center border border-gray-800 text-xs shadow-inner">
                    <div className="text-gray-500 mb-1">Density</div>
                    <div className="font-mono text-gray-200">{assignment.parameters.density}kg/m³</div>
                </div>
            </div>

            <div className="mt-auto space-y-3 z-10 relative pt-2 border-t border-gray-700/50">
                {hasSubmitted ? (
                    <div className="bg-green-900/30 border border-green-500/30 text-green-400 p-3 rounded-md flex justify-center items-center gap-2 text-sm font-bold shadow-inner">
                        <CheckCircle2 size={18} />
                        Report Submitted
                    </div>
                ) : (
                    <>
                        {isActive && simulationResult ? (
                            <div className="bg-gray-900/90 p-3 rounded-md border border-yellow-500/50 shadow-lg">
                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700">
                                    <AlertTriangle size={16} className="text-yellow-500" />
                                    <span className="text-yellow-500 font-bold text-sm">Simulation Complete!</span>
                                </div>
                                <div className="text-xs text-gray-300 mb-3 ml-6 font-mono space-y-1 bg-black/40 p-2 rounded">
                                    <div>Energy: {simulationResult.energy.energyMegatons?.toLocaleString()} Mt</div>
                                    <div>Crater: {(simulationResult.crater.diameter / 1000).toFixed(1)} km</div>
                                    {simulationResult.mitigationUsed && simulationResult.mitigationUsed !== 'none' && (
                                        <div className="text-blue-400 font-bold mt-1">🛡️ Mitigation: {simulationResult.mitigationUsed}</div>
                                    )}
                                </div>
                                <button
                                    onClick={onSubmitReport}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition flex justify-center items-center gap-2 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                                >
                                    <FileText size={18} />
                                    Submit Analysis Report
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onRun}
                                className={`w-full font-bold py-3 px-4 rounded transition flex justify-center items-center gap-2 ${assignment.isMission
                                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                    }`}
                            >
                                <Play size={18} />
                                Load & Run Simulation
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
