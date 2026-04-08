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
                sets: sets.map(s => ({
                    exercise: s.exercise, weightKg: Number(s.weightKg), reps: Number(s.reps)
                }))
            };
        }

        const payload = {
            userId: 'user_1',
            activityType,
            durationMins: Number(durationMins),
            metrics,
        };

        try {
            const res = await fetch('/api/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setMessage('✨ Activity logged successfully!');
                setTimeout(() => router.push('/'), 1500);
            } else {
                const errorData = await res.json();
                setMessage(`Error: ${errorData.error}`);
            }
        } catch (err) {
            setMessage('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // REUSABLE INPUT CLASS FOR CONSISTENCY
    const inputClass = "w-full p-4 rounded-xl border border-gray-200/80 bg-gray-50/60 shadow-inner hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-softTeal)] focus:border-transparent transition-all";

    return (
        <div className="max-w-2xl mx-auto py-10">
            <div className="glass-card p-8 md:p-12">
                <h1 className="text-3xl font-extrabold mb-8 text-[var(--color-brand-teal)] tracking-tight">Add Activity</h1>

                {message && (
                    <div className="mb-8 p-4 rounded-xl bg-[var(--color-brand-mint)]/80 text-[var(--color-brand-teal)] font-medium border border-[var(--color-brand-mint)]">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[var(--color-brand-teal)]/70 uppercase tracking-wider">Activity Type</label>
                            <div className="relative">
                                <select
                                    value={activityType}
                                    onChange={(e) => setActivityType(e.target.value)}
                                    className={`${inputClass} appearance-none cursor-pointer`}
                                >
                                    <option value="Running">Running 🏃</option>
                                    <option value="Weightlifting">Weightlifting 🏋️</option>
                                </select>
                                {/* Custom Dropdown Arrow */}
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[var(--color-brand-teal)]/70 uppercase tracking-wider">Duration (mins)</label>
                            <input
                                type="number" required value={durationMins} onChange={(e) => setDurationMins(e.target.value)}
                                className={inputClass} placeholder="e.g. 45"
                            />
                        </div>
                    </div>

                    <hr className="border-gray-400/60" />

                    {/* RUNNING FIELDS */}
                    {activityType === 'Running' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--color-brand-teal)]/70 uppercase tracking-wider">Distance (km)</label>
                                <input
                                    type="number" step="0.1" required value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)}
                                    className={inputClass} placeholder="5.0"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--color-brand-teal)]/70 uppercase tracking-wider">Average Pace</label>
                                <input
                                    type="text" required value={pace} onChange={(e) => setPace(e.target.value)}
                                    className={inputClass} placeholder="e.g. 5:30"
                                />
                            </div>
                        </div>
                    )}

                    {/* WEIGHTLIFTING FIELDS */}
                    {activityType === 'Weightlifting' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--color-brand-teal)]/70 uppercase tracking-wider">Focus Area</label>
                                <input
                                    type="text" required value={focus} onChange={(e) => setFocus(e.target.value)}
                                    className={inputClass} placeholder="e.g. Legs, Upper Body"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-[var(--color-brand-teal)]/80">Workout Sets</label>
                                {sets.map((set, index) => (
                                    <div key={index} className="flex gap-3 items-center">
                                        <input
                                            type="text" placeholder="Exercise" required
                                            value={set.exercise} onChange={(e) => handleSetChange(index, 'exercise', e.target.value)}
                                            className="flex-1 p-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-softTeal)]"
                                        />
                                        <input
                                            type="number" placeholder="Kg" required
                                            value={set.weightKg} onChange={(e) => handleSetChange(index, 'weightKg', e.target.value)}
                                            className="w-20 p-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-softTeal)]"
                                        />
                                        <input
                                            type="number" placeholder="Reps" required
                                            value={set.reps} onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                                            className="w-20 p-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-softTeal)]"
                                        />
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => setSets([...sets, { exercise: '', weightKg: '', reps: '' }])}
                                    className="text-sm font-medium text-[var(--color-brand-teal)] bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50"
                                >
                                    + Add Another Set
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit" disabled={isSubmitting}
                        className="w-full mt-8 bg-gradient-to-r from-[var(--color-brand-mint)] to-[#b0c0b3] text-[#1A534C] text-lg font-extrabold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
                    >
                        {isSubmitting ? 'Saving...' : 'Add Activity'}
                    </button>

                </form>
            </div>
        </div>
    );
}



