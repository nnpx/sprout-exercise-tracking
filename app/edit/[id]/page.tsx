"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // <-- Added useParams here

export default function EditActivity() {
    const router = useRouter();
    const params = useParams(); // <-- Safely grab the URL parameters
    const activityId = params?.id;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [activityType, setActivityType] = useState('Running');
    const [durationMins, setDurationMins] = useState('');

    // Running State
    const [distanceKm, setDistanceKm] = useState('');
    const [pace, setPace] = useState('');

    // Weightlifting State
    const [focus, setFocus] = useState('');
    const [sets, setSets] = useState([{ exercise: '', weightKg: '', reps: '' }]);

    // FETCH EXISTING DATA ON LOAD
    useEffect(() => {
        if (!activityId) return; // Don't fetch until we have the ID from the URL

        const fetchActivity = async () => {
            try {
                const res = await fetch(`/api/activities/${activityId}`);
                const json = await res.json();

                if (json.success) {
                    const data = json.data;

                    // Populate the state with the database values
                    setActivityType(data.activityType);
                    setDurationMins(data.durationMins?.toString() || '');

                    if (data.activityType === 'Running') {
                        setDistanceKm(data.metrics?.distanceKm?.toString() || '');
                        setPace(data.metrics?.pace || '');
                    } else if (data.activityType === 'Weightlifting') {
                        setFocus(data.metrics?.focus || '');
                        if (data.metrics?.sets) setSets(data.metrics.sets);
                    }
                } else {
                    console.error("Failed to fetch activity data:", json.error);
                }
            } catch (err) {
                console.error("Network error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivity();
    }, [activityId]); // Re-run if the ID changes

    const handleSetChange = (index: number, field: string, value: string) => {
        const newSets = [...sets];
        newSets[index] = { ...newSets[index], [field]: value };
        setSets(newSets);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        let metrics = {};
        if (activityType === 'Running') {
            metrics = { distanceKm: Number(distanceKm), pace: pace };
        } else {
            metrics = {
                focus: focus,
                sets: sets.map(s => ({
                    exercise: s.exercise, weightKg: Number(s.weightKg), reps: Number(s.reps)
                }))
            };
        }

        const payload = { activityType, durationMins: Number(durationMins), metrics };

        try {
            const res = await fetch(`/api/activities/${activityId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/history');
                router.refresh(); // Tells Next.js to pull fresh data on the history page
            }
        } catch (err) {
            console.error(err);
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full p-4 rounded-xl border border-gray-200/80 bg-gray-50/60 shadow-inner hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-softTeal)] focus:border-transparent transition-all";

    // Show a nice loading state while we grab the data
    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center">
                <div className="animate-pulse text-[var(--color-brand-teal)] font-bold text-xl">
                    Loading your activity... 🌱
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-10 animate-in fade-in duration-300">
            <div className="glass-card p-8 md:p-12">
                <h1 className="text-3xl font-extrabold mb-8 text-[var(--color-brand-teal)] tracking-tight">Edit Activity</h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[var(--color-brand-teal)]/70 uppercase tracking-wider">Activity Type</label>
                            {/* Cannot edit type, so we show it as a disabled block */}
                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-100/50 text-gray-500 font-bold shadow-inner">
                                {activityType === 'Running' ? '🏃 ' : '🏋️ '}{activityType}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[var(--color-brand-teal)]/70 uppercase tracking-wider">Duration (mins)</label>
                            <input type="number" required value={durationMins} onChange={(e) => setDurationMins(e.target.value)} className={inputClass} />
                        </div>
                    </div>

                    <hr className="border-gray-200/60" />

                    {/* RUNNING FIELDS */}
                    {activityType === 'Running' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--color-brand-teal)]/70 uppercase tracking-wider">Distance (km)</label>
                                <input type="number" step="0.1" required value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} className={inputClass} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--color-brand-teal)]/70 uppercase tracking-wider">Average Pace</label>
                                <input type="text" required value={pace} onChange={(e) => setPace(e.target.value)} className={inputClass} />
                            </div>
                        </div>
                    )}

                    {/* WEIGHTLIFTING FIELDS */}
                    {activityType === 'Weightlifting' && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[var(--color-brand-teal)]/70 uppercase tracking-wider">Focus Area</label>
                                <input type="text" required value={focus} onChange={(e) => setFocus(e.target.value)} className={inputClass} />
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

                    <button type="submit" disabled={isSubmitting} className="w-full mt-8 bg-gradient-to-r from-[var(--color-brand-softTeal)] to-[#86D8BA] text-[#1A534C] text-lg font-extrabold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                        {isSubmitting ? 'Saving...' : 'Update Activity'}
                    </button>
                </form>
            </div>
        </div>
    );
}