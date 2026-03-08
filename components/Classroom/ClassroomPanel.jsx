import React, { useState } from 'react';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';

export default function ClassroomPanel({ onRunMission, simulationResult }) {
    const [role, setRole] = useState(null); // 'teacher' or 'student'

    if (!role) {
        return (
            <div className="bg-gray-800/80 p-8 rounded-lg border border-purple-500/50 max-w-2xl mx-auto text-center mt-8">
                <h2 className="text-3xl font-bold mb-4 text-purple-400 border-b border-gray-700 pb-4 flex justify-center items-center gap-2">
                    Classroom Premium
                    <span className="text-[10px] bg-purple-600 text-white px-2 py-1 rounded-full uppercase tracking-wider relative -top-3">PRO</span>
                </h2>
                <p className="mb-8 text-gray-300">
                    Welcome to the STEM Education Module. Please select your role to continue.
                </p>
                <div className="flex gap-6 justify-center">
                    <button
                        onClick={() => setRole('teacher')}
                        className="px-8 py-4 bg-purple-700 hover:bg-purple-600 rounded-lg font-bold text-xl transition shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                    >
                        👨‍🏫 I am a Teacher
                    </button>
                    <button
                        onClick={() => setRole('student')}
                        className="px-8 py-4 bg-blue-700 hover:bg-blue-600 rounded-lg font-bold text-xl transition shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                    >
                        🎓 I am a Student
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in mt-4">
            <div className="mb-6 flex justify-between items-center bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <span className="text-purple-300 font-bold bg-purple-900/30 px-3 py-1 rounded">
                    {role === 'teacher' ? '👨‍🏫 Teacher Mode' : '🎓 Student Mode'}
                </span>
                <button
                    onClick={() => setRole(null)}
                    className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-gray-300 transition"
                >
                    Change Role
                </button>
            </div>

            {role === 'teacher' && <TeacherDashboard />}
            {role === 'student' && (
                <StudentDashboard
                    onRunMission={onRunMission}
                    simulationResult={simulationResult}
                />
            )}
        </div>
    );
}
