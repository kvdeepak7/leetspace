import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { analyticsAPI } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { WeaknessCard } from '@/components/dashboard/WeaknessCard';
import { TodaysRevision } from '@/components/dashboard/TodaysRevision';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  RotateCcw, 
  Tags, 
  TrendingUp,
  Calendar,
  BarChart3,
  Loader2 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('ls_has_seen_welcome')) {
      setShowWelcome(true);
    }
  }, []);

  const handleWelcomePrimary = () => {
    localStorage.setItem('ls_has_seen_welcome', 'true');
    sessionStorage.setItem("addProblemIntent", "fresh");
    setShowWelcome(false);
    navigate('/add-problem');
  };
  const handleWelcomeSecondary = () => {
    localStorage.setItem('ls_has_seen_welcome', 'true');
    setShowWelcome(false);
    navigate('/sample/problem');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await analyticsAPI.getDashboard();
        setData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Error</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 p-8 bg-white dark:bg-zinc-900">
            <h2 className="text-2xl font-bold">Your journal is ready</h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Start by logging one problem you learned from recently.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-sm">
                <Link to="/add-problem" onClick={() => sessionStorage.setItem("addProblemIntent","fresh")}>Add your first entry</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="border border-indigo-300 bg-white/90 text-indigo-700 shadow-sm hover:bg-indigo-50/80 dark:bg-zinc-900/70 dark:text-indigo-200 dark:hover:bg-zinc-800/70">
                <Link to="/sample/problem">See a sample entry</Link>
              </Button>
            </div>
            <div className="mt-6 text-sm">
              <p className="font-medium text-gray-900 dark:text-white">What to include</p>
              <ul className="mt-2 list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Notes: what you learned (1–2 lines)</li>
                <li>Mistakes: one thing you’d avoid next time</li>
                <li>Versions: add a second approach (language/rationale)</li>
                <li>Optional: mark retry later for review</li>
              </ul>
            </div>
          </div>
        </div>

        <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Welcome to your coding journal</DialogTitle>
              <DialogDescription>Log what mattered, compare versions, and review with intent.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-between">
              <Button onClick={handleWelcomePrimary} className="cursor-pointer">Add your first entry</Button>
              <Button onClick={handleWelcomeSecondary} variant="ghost" className="border border-indigo-300 bg-white/90 text-indigo-700 shadow-sm hover:bg-indigo-50/80 dark:bg-zinc-900/70 dark:text-indigo-200 dark:hover:bg-zinc-800/70 cursor-pointer">See a sample entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const { basic_stats, weaknesses, todays_revision, activity_heatmap, recent_activity } = data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hi {user?.displayName?.trim() || (user?.email ? user.email.split('@')[0] : 'there')} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your LeetSpace learning analytics and insights
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Problems"
            value={basic_stats.total_problems}
            subtitle="Problems logged"
            icon={FileText}
          />
          <StatCard
            title="Retry Later"
            value={basic_stats.retry_count}
            subtitle="Need review"
            icon={RotateCcw}
          />
          <StatCard
            title="Active Days"
            value={basic_stats.total_active_days}
            subtitle="Days with activity"
            icon={Calendar}
          />
          <StatCard
            title="Difficulty"
            value={`${basic_stats.difficulty_breakdown.easy}E | ${basic_stats.difficulty_breakdown.medium}M | ${basic_stats.difficulty_breakdown.hard}H`}
            subtitle="Easy | Medium | Hard"
            icon={BarChart3}
          />
        </div>

        {/* Most Used Tags */}
        {basic_stats.most_used_tags.length > 0 && (
          <div className="space-y-3 p-4 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Most Used Tags</h2>
            <div className="flex flex-wrap gap-2">
              {basic_stats.most_used_tags.map(({ tag, count }) => (
                <Badge key={tag} variant="secondary" className="text-sm bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-150 dark:hover:bg-zinc-700 transition-colors border border-gray-200 dark:border-zinc-700">
                  {tag} ({count})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <WeaknessCard weaknesses={weaknesses} />
            <TodaysRevision revision={todays_revision} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <RecentActivity activities={recent_activity} />
          </div>
        </div>

        {/* Activity Heatmap - Full Width */}
        <ActivityHeatmap data={activity_heatmap} />
      </div>

      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to your coding journal</DialogTitle>
            <DialogDescription>Log what mattered, compare versions, and review with intent.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button onClick={handleWelcomePrimary} className="cursor-pointer">Add your first entry</Button>
            <Button onClick={handleWelcomeSecondary} variant="ghost" className="border border-indigo-300 bg-white/90 text-indigo-700 shadow-sm hover:bg-indigo-50/80 dark:bg-zinc-900/70 dark:text-indigo-200 dark:hover:bg-zinc-800/70 cursor-pointer">See a sample entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}