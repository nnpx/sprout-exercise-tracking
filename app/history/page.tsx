import dbConnect from '@/lib/dbConnect';
import Activity from '@/models/Activity';
import ActivityCard from '@/components/ActivityCard';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
    await dbConnect();
    const allActivities = await Activity.find().sort({ date: -1 }).lean();

    return (
        <div className="space-y-8 animate-in fade-in duration-500 py-6">
            <div className="border-b border-[var(--color-border)] pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-main)] mb-1">
                    Activity History
                </h1>
                <p className="text-sm text-[var(--color-text-muted)]">
                    A comprehensive log of all recorded sessions.
                </p>
            </div>

            {allActivities.length === 0 ? (
                <div className="dashboard-card p-12 text-center border-dashed">
                    <p className="text-sm text-[var(--color-text-muted)]">No historical data available.</p>
                </div>
            ) : (
                <div className="columns-1 md:columns-2 gap-6 space-y-6">
                    {allActivities.map((activity: any) => (
                        <ActivityCard key={activity._id.toString()} activity={{ ...activity, _id: activity._id.toString() }} />
                    ))}
                </div>
            )}
        </div>
    );
}