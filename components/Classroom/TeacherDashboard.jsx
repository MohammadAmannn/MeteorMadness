import React, { useState, useEffect } from 'react';
import { loadClassroomData, saveClassroomData, generateCode } from '../../lib/classroom-store';
import AssignmentCreator from './AssignmentCreator';
import TeacherAnalytics from './TeacherAnalytics';
import { Users, Plus, LayoutDashboard, Copy, Activity } from 'lucide-react';

export default function TeacherDashboard() {
    const [data, setData] = useState({ classrooms: [], assignments: [], submissions: [] });
    const [activeClassroom, setActiveClassroom] = useState(null);
    const [view, setView] = useState('dashboard'); // 'dashboard', 'create-assignment', 'analytics'
    const [newClassName, setNewClassName] = useState('');

    useEffect(() => {
        const loadedData = loadClassroomData();
        setData(loadedData);
        if (loadedData.classrooms && loadedData.classrooms.length > 0) {
            setActiveClassroom(loadedData.classrooms[0]);
        }
    }, []);

    const handleCreateClassroom = (e) => {
        e.preventDefault();
        if (!newClassName.trim()) return;

        const newClass = {
            id: Date.now().toString(),
            name: newClassName,
            code: generateCode()
        };

        const updatedData = {
            ...data,
            classrooms: [...(data.classrooms || []), newClass]
        };

        saveClassroomData(updatedData);
        setData(updatedData);
        setActiveClassroom(newClass);
        setNewClassName('');
    };

    const copyCode = () => {
        if (activeClassroom) {
            navigator.clipboard.writeText(activeClassroom.code);
            alert('Code copied to clipboard!');
        }
    };

    const handleAssignmentCreated = (assignment) => {
        const updatedData = {
            ...data,
            assignments: [assignment, ...(data.assignments || [])]
        };
        saveClassroomData(updatedData);
        setData(updatedData);
        setView('dashboard');
    };

    if (!activeClassroom) {
        return (
            <div className="bg-gray-800/50 p-6 rounded-lg border border-purple-500/30 text-center max-w-md mx-auto">
                <Users className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-80" />
                <h3 className="text-2xl font-bold text-white mb-2">Create Your First Classroom</h3>
                <p className="text-gray-400 mb-6">Start assigning interactive asteroid simulations to your students.</p>

                <form onSubmit={handleCreateClassroom} className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="e.g. Earth Science 101"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-purple-500 focus:outline-none"
                        required
                    />
                    <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded transition">
                        Create Classroom
                    </button>
                </form>
            </div>
        );
    }

    const classAssignments = (data.assignments || []).filter(a => a.classroomId === activeClassroom.id);
    const classSubmissions = (data.submissions || []).filter(s => classAssignments.some(a => a.id === s.assignmentId));

    return (
        <div className="flex gap-6">
            {/* SIDEBAR */}
            <div className="w-64 flex-shrink-0">
                <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 mb-4">
                    <h3 className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-2">Current Class</h3>
                    <select
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white mb-4 focus:border-purple-500 focus:outline-none"
                        value={activeClassroom.id}
                        onChange={(e) => setActiveClassroom((data.classrooms || []).find(c => c.id === e.target.value))}
                    >
                        {(data.classrooms || []).map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <div className="bg-gray-900/80 p-3 rounded border border-dashed border-purple-500/50 relative group cursor-pointer" onClick={copyCode}>
                        <p className="text-xs text-purple-300 font-bold mb-1">JOIN CODE</p>
                        <p className="text-2xl font-mono text-white tracking-widest">{activeClassroom.code}</p>
                        <Copy className="w-4 h-4 text-gray-500 absolute top-3 right-3 group-hover:text-purple-400 transition" />
                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    <button
                        onClick={() => setView('dashboard')}
                        className={`flex items-center gap-3 p-3 rounded transition ${view === 'dashboard' ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <LayoutDashboard size={18} />
                        Assignments
                    </button>
                    <button
                        onClick={() => setView('analytics')}
                        className={`flex items-center gap-3 p-3 rounded transition ${view === 'analytics' ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <Activity size={18} />
                        Student Analytics
                        <span className="ml-auto bg-gray-700 text-xs px-2 py-0.5 rounded-full">{classSubmissions.length}</span>
                    </button>
                </nav>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 bg-gray-800/30 rounded-lg border border-gray-700/50 p-6 min-h-[500px]">
                {view === 'dashboard' && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                            <h2 className="text-2xl font-bold text-white">Assignments</h2>
                            <button
                                onClick={() => setView('create-assignment')}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition text-sm shadow-lg shadow-purple-500/20"
                            >
                                <Plus size={16} /> New Assignment
                            </button>
                        </div>

                        {classAssignments.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <p className="mb-4">No assignments yet.</p>
                                <p className="text-sm">Create an assignment to start giving simulation tasks to your students.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {classAssignments.map(assignment => (
                                    <div key={assignment.id} className="bg-gray-800/70 border border-gray-700 p-4 rounded-lg flex justify-between items-center hover:border-purple-500/30 transition">
                                        <div>
                                            <h4 className="font-bold text-lg text-blue-300">{assignment.title}</h4>
                                            <p className="text-sm text-gray-400 line-clamp-1">{assignment.instructions}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded inline-block mb-1">
                                                {assignment.isMission ? '🚀 Gamified Mission' : '📓 Standard Sim'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {classSubmissions.filter(s => s.assignmentId === assignment.id).length} submissions
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {view === 'create-assignment' && (
                    <AssignmentCreator
                        classroomId={activeClassroom.id}
                        onCancel={() => setView('dashboard')}
                        onSave={handleAssignmentCreated}
                    />
                )}

                {view === 'analytics' && (
                    <TeacherAnalytics
                        assignments={classAssignments}
                        submissions={classSubmissions}
                    />
                )}
            </div>
        </div>
    );
}
