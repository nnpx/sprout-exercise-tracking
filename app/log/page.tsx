"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogActivity() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const [activityType, setActivityType] = useState('Running');
    const [durationMins, setDurationMins] = useState('');
    const [distanceKm, setDistanceKm] = useState('');
    const [pace, setPace] = useState('');
    const [focus, setFocus] = useState('');
    const [sets, setSets] = useState([{ exercise: '', weightKg: '', reps: '' }]);

    const handleSetChange = (index: number, field: string, value: string) => {
        const newSets = [...sets];
        newSets[index] = { ...newSets[index], [field]: value };
        setSets(newSets);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        let metrics = {};
        if (activityType === 'Running') {
            metrics = { distanceKm: Number(distanceKm), pace: pace };
        } else if (activityType === 'Weightlifting') {
            metrics = {
                focus: focus,
                sets: sets.map(s => ({ exercise: s.exercise, weightKg: Number(s.weightKg), reps: Number(s.reps) }))
            };
        }

        const payload = { userId: 'user_1', activityType, durationMins: Number(durationMins), metrics };

        try {
            const res = await fetch('/api/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setMessage('Record successfully created.');
                setTimeout(() => router.push('/'), 1000);
            } else {
                const errorData = await res.json();
                setMessage(`Error: ${errorData.error}`);
            }
        } catch (err) {
            setMessage('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "px-3 py-2.5 text-sm rounded-md border border-[var(--color-border)] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";
    const labelClass = "block text-xs font-semibold text-[var(--color-text-main)] mb-1.5";

    return (
        <div className="max-w-xl mx-auto py-8">
            <div className="dashboard-card border-t-4 border-t-indigo-500 p-6 md:p-8">
                <h1 className="text-2xl font-bold mb-6 text-[var(--color-text-main)] tracking-tight">Add New Activity</h1>

                {message && (
                    <div className="mb-6 px-4 py-3 rounded-md bg-teal-50 text-teal-700 text-sm font-semibold border border-teal-100">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Type</label>
                            <select value={activityType} onChange={(e) => setActivityType(e.target.value)} className={inputClass}>
                                <option value="Running">Running</option>
                                <option value="Weightlifting">Weightlifting</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Duration (mins)</label>
                            <input type="number" required value={durationMins} onChange={(e) => setDurationMins(e.target.value)} className={inputClass} placeholder="45" />
                        </div>
                    </div>

                    <hr className="border-[var(--color-border)]" />

                    {activityType === 'Running' && (
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}>Distance (km)</label>
                                <input type="number" step="0.1" required value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} className={inputClass} placeholder="5.0" />
                            </div>
                            <div>
                                <label className={labelClass}>Average Pace</label>
                                <input type="text" required value={pace} onChange={(e) => setPace(e.target.value)} className={inputClass} placeholder="5:30" />
                            </div>
                        </div>
                    )}

                    {activityType === 'Weightlifting' && (
                        <div className="space-y-5">
                            <div>
                                <label className={labelClass}>Focus Area</label>
                                <input type="text" required value={focus} onChange={(e) => setFocus(e.target.value)} className={inputClass} placeholder="e.g. Upper Body" />
                            </div>

                            <div className="space-y-3">
                                <label className={labelClass}>Sets</label>
                                {sets.map((set, index) => (
                                    <div key={index} className="flex gap-3 items-center">
                                        <input type="text" placeholder="Exercise" required value={set.exercise} onChange={(e) => handleSetChange(index, 'exercise', e.target.value)} className={`${inputClass} flex-1`} />
                                        <input type="number" placeholder="Kg" required value={set.weightKg} onChange={(e) => handleSetChange(index, 'weightKg', e.target.value)} className={`${inputClass} w-20`} />
                                        <input type="number" placeholder="Reps" required value={set.reps} onChange={(e) => handleSetChange(index, 'reps', e.target.value)} className={`${inputClass} w-20`} />
                                    </div>
                                ))}


                                <button type="button" onClick={() => setSets([...sets, { exercise: '', weightKg: '', reps: '' }])} className="text-xs font-semibold text-indigo-600 mt-1 hover:text-indigo-800 transition-colors">
                                    + Add Set
                                </button>
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 rounded-lg shadow-sm transition-colors disabled:opacity-50">
                        {isSubmitting ? 'Saving...' : 'Save Activity'}
                    </button>
                </form>
            </div>
        </div>
    );
}