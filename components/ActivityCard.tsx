"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ActivityProps {
    activity: {
        _id: string;
        activityType: string;
        date: Date;
        durationMins: number;
        metrics: any;
    };
}

export default function ActivityCard({ activity }: ActivityProps) {
    const router = useRouter();

    const formattedDate = new Date(activity.date).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric'
    });

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this activity?')) return;

        try {
            const res = await fetch(`/api/activities/${activity._id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (err) {
            console.error("Failed to delete", err);
        }
    };

    return (
        <div className="glass-card p-6 hover:-translate-y-1 transition-transform duration-300 flex flex-col gap-4 break-inside-avoid mb-6 inline-block w-full">

            {/* HEADER ROW */}
            <div className="flex justify-between items-start">

                {/* Left side: Icon + Title + Date */}
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-[var(--color-brand-mint)] text-2xl shadow-inner-soft flex items-center justify-center">
                        {activity.activityType === 'Running' ? '🏃' : '🏋️'}
                    </div>
                    <div>
                        <h3 className="font-extrabold text-[var(--color-brand-teal)] text-xl tracking-tight">
                            {activity.activityType}
                        </h3>
                        <p className="text-sm font-medium text-[var(--color-brand-teal)]/50 mt-0.5">{formattedDate}</p>
                    </div>
                </div>

                {/* Right side: Duration + Action Icons */}
                <div className="flex flex-col items-end gap-3">

                    {/* ICON BUTTONS */}
                    <div className="flex gap-2">
                        <Link
                            href={`/edit/${activity._id}`}
                            title="Edit Activity"
                            className="p-1 bg-white rounded-full text-[var(--color-brand-teal)]/60 shadow-sm border border-gray-100 hover:text-[var(--color-brand-teal)] hover:bg-gray-50 hover:shadow transition-all"
                        >
                            {/* Pencil Icon */}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </Link>

                        <button
                            onClick={handleDelete}
                            title="Delete Activity"
                            className="p-1 bg-white rounded-full text-red-400 shadow-sm border border-gray-100 hover:text-red-600 hover:bg-red-50 hover:shadow transition-all"
                        >
                            {/* Trash Bin Icon */}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className="font-black text-2xl text-[var(--color-brand-teal)] leading-none">{activity.durationMins}</span>
                        <span className="text-xs font-bold text-[var(--color-brand-teal)]/50 uppercase tracking-widest">mins</span>
                    </div>

                </div>
            </div>

            {/* INNER POLYMORPHIC METRICS SECTION */}
            {/* Lightened the background here to create better depth */}
            <div className="bg-white/40 rounded-2xl p-5 border border-white/60 shadow-sm mt-1">

                {activity.activityType === 'Running' && (
                    <div className="flex justify-between items-center text-[var(--color-brand-teal)]/80 font-medium">
                        <span className="flex flex-col">
                            <span className="text-xs uppercase tracking-wider opacity-70">Distance</span>
                            <strong className="text-lg text-[var(--color-brand-teal)] font-extrabold">{activity.metrics.distanceKm} km</strong>
                        </span>
                        <span className="flex flex-col text-right">
                            <span className="text-xs uppercase tracking-wider opacity-70">Pace</span>
                            <strong className="text-lg text-[var(--color-brand-teal)] font-extrabold">{activity.metrics.pace} <span className="text-sm font-medium">/km</span></strong>
                        </span>
                    </div>
                )}

                {activity.activityType === 'Weightlifting' && (
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-[var(--color-brand-teal)]/80">
                            Focus: <strong className="text-[var(--color-brand-teal)] font-extrabold">{activity.metrics.focus}</strong>
                        </p>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            {activity.metrics.sets?.map((set: any, idx: number) => (
                                <div key={idx} className="bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                                    <span className="font-bold text-sm truncate mb-1 text-[var(--color-brand-teal)]">{set.exercise}</span>
                                    <span className="text-[var(--color-brand-teal)]/70 font-semibold text-xs tracking-wide">
                                        {set.weightKg}kg <span className="mx-1 text-gray-300">×</span> {set.reps}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}