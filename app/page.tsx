import dbConnect from '@/lib/dbConnect';
import Activity from '@/models/Activity';
import ActivityCard from '@/components/ActivityCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  await dbConnect();

  const globalStats = await Activity.aggregate([
    {
      $group: {
        _id: null,
        totalDuration: { $sum: "$durationMins" },
        totalActivities: { $sum: 1 }
      }
    }
  ]);

  const typeDistribution = await Activity.aggregate([
    {
      $group: {
        _id: "$activityType",
        count: { $sum: 1 }
      }
    }
  ]);

  const recentActivities = await Activity.find()
    .sort({ date: -1 })
    .limit(4) // Changed to 4 for a perfect 2x2 grid
    .lean();

  const stats = globalStats[0] || { totalDuration: 0, totalActivities: 0 };
  const hasData = recentActivities.length > 0;

  return (
    <div className="space-y-12 animate-in fade-in duration-500 py-6">

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-brand-teal)] mb-2">
            Your Dashboard
          </h1>
          <p className="text-lg text-[var(--color-brand-teal)]/70">
            Welcome back! Here is your wellness summary.
          </p>
        </div>
      </div>

      {/* --- REFORMATTED METRIC CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="glass-card p-6 flex justify-start items-center gap-5">
          <div className="p-4 bg-[var(--color-brand-mint)] rounded-2xl text-3xl shadow-sm">🔥</div>
          <div className="flex flex-col">
            <span className="text-4xl font-black text-[var(--color-brand-teal)] leading-none">{stats.totalDuration}</span>
            <span className="text-xs font-bold text-[var(--color-brand-teal)]/60 uppercase tracking-widest mt-1">Total Minutes</span>
          </div>
        </div>

        <div className="glass-card p-6 flex justify-start items-center gap-5">
          <div className="p-4 bg-[var(--color-brand-mint)] rounded-2xl text-3xl shadow-sm">📈</div>
          <div className="flex flex-col">
            <span className="text-4xl font-black text-[var(--color-brand-teal)] leading-none">{stats.totalActivities}</span>
            <span className="text-xs font-bold text-[var(--color-brand-teal)]/60 uppercase tracking-widest mt-1">Total Sessions</span>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-center">
          <h3 className="text-xs font-bold text-[var(--color-brand-teal)]/60 uppercase tracking-widest mb-4">
            Activity Split
          </h3>
          <div className="space-y-3">
            {typeDistribution.length === 0 ? (
              <p className="text-sm font-medium text-[var(--color-brand-teal)]/50">No data yet.</p>
            ) : (
              typeDistribution.map((type) => (
                <div key={type._id} className="flex justify-between items-center text-sm font-bold text-[var(--color-brand-teal)]">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-brand-softTeal)]"></div>
                    {type._id}
                  </span>
                  <span className="bg-gray-100/80 px-3 py-1 rounded-lg border border-gray-200/50">{type.count}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* --- RECENT ACTIVITY FEED --- */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-brand-teal)]">Recent Activity</h2>
          <Link href="/history" className="text-sm font-bold text-[var(--color-brand-teal)] hover:text-emerald-600 underline underline-offset-4 transition-colors">
            View All History →
          </Link>
        </div>

        {hasData ? (
          <div className="columns-1 md:columns-2 gap-6 space-y-6">
            {recentActivities.map((activity: any) => (
              <ActivityCard key={activity._id.toString()} activity={{ ...activity, _id: activity._id.toString() }} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-lg text-[var(--color-brand-teal)]/70 mb-6 font-medium">You haven't logged any activities yet.</p>
            <Link href="/log" className="bg-gradient-to-r from-[var(--color-brand-softTeal)] to-[#86D8BA] text-[#1A534C] px-8 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all inline-block">
              Add Your First Sprout 🌱
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}