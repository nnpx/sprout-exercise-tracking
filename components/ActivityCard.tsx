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
        if (!confirm('Delete this activity record?')) return;
        try {
            const res = await fetch(`/api/activities/${activity._id}`, { method: 'DELETE' });
            if (res.ok) router.refresh();
        } catch (err) {
            console.error("Failed to delete", err);
        }
    };

    return (
        <div className="dashboard-card p-5 flex flex-col gap-4 break-inside-avoid mb-6 inline-block w-full group">

            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    {/* SVG Icon Background */}
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[var(--color-primary)]">
                        {activity.activityType === 'Running' ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-[var(--color-text-main)] text-base">
                            {activity.activityType}
                        </h3>
                        <p className="text-xs text-[var(--color-text-muted)]">{formattedDate}</p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-baseline gap-1">
                        <span className="font-bold text-lg text-[var(--color-text-main)] leading-none">{activity.durationMins}</span>
                        <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase">mins</span>
                    </div>

                    <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/edit/${activity._id}`} className="p-1.5 text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-50 rounded transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </Link>
                        <button onClick={handleDelete} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-[var(--color-border)]">
                {activity.activityType === 'Running' && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="flex flex-col">
                            <span className="text-xs text-[var(--color-text-muted)] font-medium mb-0.5">Distance</span>
                            <strong className="text-[var(--color-text-main)] font-semibold">{activity.metrics.distanceKm} km</strong>
                        </span>
                        <span className="flex flex-col text-right">
                            <span className="text-xs text-[var(--color-text-muted)] font-medium mb-0.5">Pace</span>
                            <strong className="text-[var(--color-text-main)] font-semibold">{activity.metrics.pace} <span className="font-normal text-[var(--color-text-muted)]">/km</span></strong>
                        </span>
                    </div>
                )}

                {activity.activityType === 'Weightlifting' && (
                    <div className="space-y-3">
                        <p className="text-xs text-[var(--color-text-muted)] font-medium">
                            Focus: <strong className="text-[var(--color-text-main)] font-semibold ml-1">{activity.metrics.focus}</strong>
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {activity.metrics.sets?.map((set: any, idx: number) => (
                                <div key={idx} className="bg-white px-3 py-2 rounded border border-[var(--color-border)] flex justify-between items-center shadow-sm">
                                    <span className="font-medium text-xs text-[var(--color-text-main)] truncate">{set.exercise}</span>
                                    <span className="text-[var(--color-text-muted)] text-[11px]">
                                        {set.weightKg}kg <span className="mx-0.5">×</span> {set.reps}
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