import React, { useState, useEffect } from 'react';
import { loadClassroomData, saveClassroomData } from '../../lib/classroom-store';
import MissionChallengePanel from './MissionChallengePanel';
import { GraduationCap } from 'lucide-react';

export default function StudentDashboard({ onRunMission, simulationResult }) {
    const [data, setData] = useState({ classrooms: [], assignments: [], submissions: [] });
    const [session, setSession] = useState({ name: '', classId: null });
    const [joinCode, setJoinCode] = useState('');
    const [joinName, setJoinName] = useState('');
    const [error, setError] = useState('');

    // activeAssignment tracks which assignment the student just ran a simulation for.
    const [activeAssignmentId, setActiveAssignmentId] = useState(null);

    useEffect(() => {
        setData(loadClassroomData());
    }, [simulationResult]); // Reload if simulation result changes just in case

    const handleJoin = (e) => {
        e.preventDefault();
        if (!joinCode || !joinName) return;

        const classroom = (data.classrooms || []).find(c => c.code.toUpperCase() === joinCode.toUpperCase());
        if (classroom) {
            setSession({ name: joinName, classId: classroom.id });
            setError('');
        } else {
            setError('Invalid classroom code.');
        }
    };

    const handleRunSimulation = (assignment) => {
        setActiveAssignmentId(assignment.id);

        // Call the parent to switch tab and set simulator state
        onRunMission({
            name: `Mission: ${assignment.title}`,
            diameter: assignment.parameters.diameter,
            velocity: assignment.parameters.velocity,
            density: assignment.parameters.density,
            hazardous: true,
            orbital_data: { semi_major_axis: 1.5, eccentricity: 0.2 },
            impactPoint: assignment.parameters.impactPoint,
            miss_distance: 0,
        });
    };

    const handleSubmitReport = (assignmentId) => {
        if (!simulationResult) return;

        const newSubmission = {
            id: Date.now().toString(),
            assignmentId,
            studentName: session.name,
            results: simulationResult,
            submittedAt: new Date().toISOString()
        };

        const updatedData = {
            ...data,
            submissions: [...(data.submissions || []), newSubmission]
        };

        saveClassroomData(updatedData);
        setData(updatedData);
    };

    if (!session.classId) {
        return (
            <div className="bg-gray-800/50 p-8 rounded-lg border border-blue-500/30 text-center max-w-md mx-auto animate-fade-in shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <GraduationCap className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-80" />
                <h3 className="text-2xl font-bold text-white mb-2">Join a Classroom</h3>
                <p className="text-gray-400 mb-6 text-sm">Enter the code provided by your teacher to access simulations and missions.</p>

                {error && <div className="bg-red-900/50 text-red-300 p-2 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleJoin} className="flex flex-col gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Your Full Name"
                            value={joinName}
                            onChange={(e) => setJoinName(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Classroom Code (e.g. A1B2C)"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white uppercase tracking-widest focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-center font-mono text-xl"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded transition shadow-[0_0_10px_rgba(59,130,246,0.3)] mt-2">
                        Enter Classroom
                    </button>
                </form>
            </div>
        );
    }

    const classroom = (data.classrooms || []).find(c => c.id === session.classId);
    const classAssignments = (data.assignments || []).filter(a => a.classroomId === session.classId);

    return (
        <div className="animate-fade-in mt-2">
            <div className="flex justify-between items-center mb-6 bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
                <div>
                    <h2 className="text-xl font-bold text-white">Welcome, {session.name}</h2>
                    <p className="text-sm text-blue-300">Classroom: {classroom?.name}</p>
                </div>
                <button
                    onClick={() => setSession({ name: '', classId: null })}
                    className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded transition border border-gray-600 text-gray-300"
                >
                    Leave Class
                </button>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2 flex items-center gap-2">
                Your Assignments
            </h3>

            {classAssignments.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-900/30 rounded-lg border border-gray-800">
                    <p>No assignments posted yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {classAssignments.map(assignment => {
                        const hasSubmitted = (data.submissions || []).some(s => s.assignmentId === assignment.id && s.studentName === session.name);
                        const isActive = activeAssignmentId === assignment.id;

                        return (
                            <MissionChallengePanel
                                key={assignment.id}
                                assignment={assignment}
                                hasSubmitted={hasSubmitted}
                                isActive={isActive}
                                simulationResult={isActive ? simulationResult : null}
                                onRun={() => handleRunSimulation(assignment)}
                                onSubmitReport={() => handleSubmitReport(assignment.id)}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
