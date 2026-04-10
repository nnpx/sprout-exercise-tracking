import dbConnect from '@/lib/dbConnect';
import Activity from '@/models/Activity';
import ActivityCard from '@/components/ActivityCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  await dbConnect();

  const globalStats = await Activity.aggregate([
    { $group: { _id: null, totalDuration: { $sum: "$durationMins" }, totalActivities: { $sum: 1 } } }
  ]);

  const typeDistribution = await Activity.aggregate([
    { $group: { _id: "$activityType", count: { $sum: 1 } } }
  ]);

  const recentActivities = await Activity.find().sort({ date: -1 }).limit(4).lean();

  const stats = globalStats[0] || { totalDuration: 0, totalActivities: 0 };
  const hasData = recentActivities.length > 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-main)] mb-1">
          Overview
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Your key performance metrics and recent activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="dashboard-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-[var(--color-text-muted)]">Total Duration</h3>
            <svg className="w-5 h-5 text-[var(--color-text-muted)] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-[var(--color-text-main)]">{stats.totalDuration}</span>
            <span className="text-sm font-medium text-[var(--color-text-muted)]">mins</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="dashboard-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-[var(--color-text-muted)]">Total Sessions</h3>
            <svg className="w-5 h-5 text-[var(--color-text-muted)] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-[var(--color-text-main)]">{stats.totalActivities}</span>
            <span className="text-sm font-medium text-[var(--color-text-muted)]">sessions</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="dashboard-card p-6 flex flex-col justify-between">
          <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-4">Activity Split</h3>
          <div className="space-y-3">
            {typeDistribution.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No data yet.</p>
            ) : (
              typeDistribution.map((type) => (
                <div key={type._id} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-[var(--color-text-main)] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
                    {type._id}
                  </span>
                  <span className="text-[var(--color-text-muted)] bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">{type.count} logs</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-[var(--color-text-main)]">Recent Activity</h2>
          <Link href="/history" className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">
            View All →
          </Link>
        </div>

        {hasData ? (
          <div className="columns-1 md:columns-2 gap-6 space-y-6">
            {recentActivities.map((activity: any) => (
              <ActivityCard key={activity._id.toString()} activity={{ ...activity, _id: activity._id.toString() }} />
            ))}
          </div>
        ) : (
          <div className="dashboard-card p-12 text-center border-dashed">
            <p className="text-sm text-[var(--color-text-muted)] mb-4">No activities logged yet.</p>
            <Link href="/log" className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
              Add Activity
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}