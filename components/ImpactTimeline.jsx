'use client';

export default function ImpactTimeline({ progress, onProgressChange, isPlaying, onTogglePlay }) {
    return (
        <div className="bg-gray-800/80 p-4 rounded-lg mt-4 border border-blue-500/30">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-blue-400 flex items-center gap-2">
                    ⏱️ Simulation Timeline
                </h3>
                <button
                    onClick={onTogglePlay}
                    className={`px-3 py-1 rounded text-sm font-bold ${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
            </div>

            <div className="relative pt-6 pb-2">
                <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.01"
                    value={progress}
                    onChange={(e) => onProgressChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />

                <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                    <div className="flex flex-col items-center">
                        <span className="text-lg">🔭</span>
                        <span>Detection</span>
                        <span>(T-3s)</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-lg">☄️</span>
                        <span>Approach</span>
                        <span>(T-1.5s)</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-lg">💥</span>
                        <span>Impact</span>
                        <span>(T-0s)</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-lg">🌋</span>
                        <span>Aftermath</span>
                        <span>(T+1s)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
