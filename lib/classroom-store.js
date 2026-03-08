// A simple wrapper around localStorage for the classroom mode

const STORAGE_KEY = 'meteor-madness-classroom';

const getInitialData = () => {
    return {
        classrooms: [],
        assignments: [],
        submissions: []
    };
};

export const loadClassroomData = () => {
    if (typeof window === 'undefined') return getInitialData();
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            return { ...getInitialData(), ...JSON.parse(data) };
        } catch (e) {
            console.error('Failed to parse classroom data', e);
        }
    }
    return getInitialData();
};

export const saveClassroomData = (data) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};
