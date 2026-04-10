"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditActivity() {
    const router = useRouter();
    const params = useParams();
    const activityId = params?.id;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [activityType, setActivityType] = useState('Running');
    const [durationMins, setDurationMins] = useState('');
    const [distanceKm, setDistanceKm] = useState('');
    const [pace, setPace] = useState('');
    const [focus, setFocus] = useState('');
    const [sets, setSets] = useState([{ exercise: '', weightKg: '', reps: '' }]);

    useEffect(() => {
        if (!activityId) return;
        const fetchActivity = async () => {
            try {
                const res = await fetch(`/api/activities/${activityId}`);
                const json = await res.json();
                if (json.success) {
                    const data = json.data;
                    setActivityType(data.activityType);
                    setDurationMins(data.durationMins?.toString() || '');
                    if (data.activityType === 'Running') {
                        setDistanceKm(data.metrics?.distanceKm?.toString() || '');
                        setPace(data.metrics?.pace || '');
                    } else if (data.activityType === 'Weightlifting') {
                        setFocus(data.metrics?.focus || '');
                        if (data.metrics?.sets) setSets(data.metrics.sets);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivity();
    }, [activityId]);

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
                sets: sets.map(s => ({ exercise: s.exercise, weightKg: Number(s.weightKg), reps: Number(s.reps) }))
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
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full px-3 py-2 text-sm rounded-md border border-[var(--color-border)] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all";
    const labelClass = "block text-xs font-semibold text-[var(--color-text-main)] mb-1";

    if (isLoading) {
        return (
            <div className="max-w-xl mx-auto py-20 text-center">
                <div className="animate-pulse text-[var(--color-text-muted)] text-sm font-medium">Loading record...</div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-8">
            <div className="dashboard-card p-6 md:p-8">
                <h1 className="text-xl font-bold mb-6 text-[var(--color-text-main)]">Edit Activity</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Type</label>
                            <div className="px-3 py-2 text-sm rounded-md border border-[var(--color-border)] bg-slate-50 text-[var(--color-text-muted)] font-medium">
                                {activityType}
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Duration (mins)</label>
                            <input type="number" required value={durationMins} onChange={(e) => setDurationMins(e.target.value)} className={inputClass} />
                        </div>
                    </div>

                    <hr className="border-[var(--color-border)]" />

                    {activityType === 'Running' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Distance (km)</label>
                                <input type="number" step="0.1" required value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Average Pace</label>
                                <input type="text" required value={pace} onChange={(e) => setPace(e.target.value)} className={inputClass} />
                            </div>
                        </div>
                    )}

                    {activityType === 'Weightlifting' && (
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Focus Area</label>
                                <input type="text" required value={focus} onChange={(e) => setFocus(e.target.value)} className={inputClass} />
                            </div>

                            <div className="space-y-2">
                                <label className={labelClass}>Sets</label>
                                {sets.map((set, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input type="text" required value={set.exercise} onChange={(e) => handleSetChange(index, 'exercise', e.target.value)} className={`${inputClass} flex-1`} />
                                        <input type="number" required value={set.weightKg} onChange={(e) => handleSetChange(index, 'weightKg', e.target.value)} className={`${inputClass} w-20`} />
                                        <input type="number" required value={set.reps} onChange={(e) => handleSetChange(index, 'reps', e.target.value)} className={`${inputClass} w-20`} />
                                    </div>
                                ))}
                                <button type="button" onClick={() => setSets([...sets, { exercise: '', weightKg: '', reps: '' }])} className="text-xs font-medium text-[var(--color-primary)] mt-1 hover:underline">
                                    + Add Set
                                </button>
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold py-2.5 rounded-md transition-colors disabled:opacity-50">
                        {isSubmitting ? 'Saving...' : 'Update Activity'}
                    </button>
                </form>
            </div>
        </div>
    );
}