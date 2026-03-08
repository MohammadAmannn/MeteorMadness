import React, { useState } from 'react';

export default function AssignmentCreator({ classroomId, onCancel, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        instructions: '',
        isMission: false,
        diameter: 200,
        velocity: 18,
        density: 3000,
        impactLat: 20,
        impactLng: -150,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create random unique ID mapped slightly differently since assignments can't duplicate
        const newAssignment = {
            id: Date.now().toString() + Math.random().toString(16).slice(2),
            classroomId,
            title: formData.title,
            instructions: formData.instructions,
            isMission: formData.isMission,
            parameters: {
                diameter: Number(formData.diameter),
                velocity: Number(formData.velocity),
                density: Number(formData.density),
                impactPoint: { lat: Number(formData.impactLat), lng: Number(formData.impactLng) }
            },
            createdAt: new Date().toISOString()
        };

        onSave(newAssignment);
    };

    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">Create New Assignment</h2>

            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="space-y-4 bg-gray-900/50 p-5 rounded-lg border border-gray-700">
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-1">Assignment Title</label>
                        <input
                            required
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Pacific Ocean Impact Study"
                            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-1">Instructions / Mission Brief</label>
                        <textarea
                            required
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleChange}
                            placeholder="Describe the simulation students need to run and analyze..."
                            rows={3}
                            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer mt-2 bg-purple-900/20 p-3 rounded border border-purple-500/30 w-fit">
                        <input
                            type="checkbox"
                            name="isMission"
                            checked={formData.isMission}
                            onChange={handleChange}
                            className="w-4 h-4 accent-purple-500 cursor-pointer"
                        />
                        <span className="text-purple-300 font-bold text-sm">Make this a Gamified Mission (Special Challenge)</span>
                    </label>
                </div>

                <div className="space-y-4 bg-gray-900/50 p-5 rounded-lg border border-gray-700">
                    <h4 className="text-blue-300 font-bold mb-2">Pre-filled Asteroid Parameters</h4>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Diameter (meters)</label>
                            <input
                                type="number" min="10" max="100000"
                                name="diameter" value={formData.diameter} onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Velocity (km/s)</label>
                            <input
                                type="number" min="1" max="100" step="0.1"
                                name="velocity" value={formData.velocity} onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Density (kg/m³)</label>
                            <input
                                type="number" min="100" max="10000"
                                name="density" value={formData.density} onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Impact Latitude</label>
                            <input
                                type="number" min="-90" max="90" step="0.1"
                                name="impactLat" value={formData.impactLat} onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Impact Longitude</label>
                            <input
                                type="number" min="-180" max="180" step="0.1"
                                name="impactLng" value={formData.impactLng} onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 rounded text-gray-300 hover:bg-gray-800 transition border border-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-lg shadow-purple-500/20"
                    >
                        Deploy Assignment
                    </button>
                </div>

            </form>
        </div>
    );
}
