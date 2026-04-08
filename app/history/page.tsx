import dbConnect from '@/lib/dbConnect';
import Activity from '@/models/Activity';
import ActivityCard from '@/components/ActivityCard';

// This tells Next.js to always fetch fresh data for this page 
// rather than caching an old version.
export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
    // Connect to database
    await dbConnect();

    // Fetch ALL activities, sorted by newest first
    const allActivities = await Activity.find().sort({ date: -1 }).lean();

    return (
        <div className="space-y-12 animate-in fade-in duration-500 py-6">

            <div className="mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-brand-teal)] mb-2">
                    Activity History
                </h1>
                <p className="text-lg text-[var(--color-brand-teal)]/70">
                    A complete add of all your wellness journey.
                </p>
            </div>

            {allActivities.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <p className="text-lg text-[var(--color-brand-teal)]/70">No activities found.</p>
                </div>
            ) : (
                <div className="columns-1 md:columns-2 gap-6 space-y-6">
                    {allActivities.map((activity: any) => (
                        <ActivityCard
                            key={activity._id.toString()}
                            activity={{ ...activity, _id: activity._id.toString() }}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}