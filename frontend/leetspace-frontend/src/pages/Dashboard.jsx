import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useDemo } from "@/context/DemoContext";
import { analyticsAPI, problemsAPI } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { WeaknessCard } from '@/components/dashboard/WeaknessCard';
import { TodaysRevision } from '@/components/dashboard/TodaysRevision';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  RotateCcw, 
  Tags, 
  TrendingUp,
  Calendar,
  BarChart3,
  Loader2,
  Plus,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user } = useAuth();
  const { isDemo } = useDemo();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (isRefresh = false) => {
    if (!user && !isDemo) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await analyticsAPI.getDashboard();
      setData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, isDemo]);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  const handleAddProblem = () => {
    navigate('/add-problem');
  };

  const handleViewAllProblems = () => {
    navigate('/problems');
  };

  const handleViewRetryProblems = () => {
    navigate('/problems?filter=retry');
  };

  const handleViewProblemsByTag = (tag) => {
    navigate(`/problems?tag=${tag}`);
  };

  const handleViewProblemsByWeakness = (tag) => {
    navigate(`/problems?tag=${tag}&filter=weakness`);
  };

  const handleRevisionUpdate = async (updatedProblem) => {
    try {
      // Update the problem in the local state immediately for responsive UI
      if (data && data.todays_revision && data.todays_revision.id === updatedProblem.id) {
        setData(prevData => ({
          ...prevData,
          todays_revision: updatedProblem
        }));
      }

      // Update the problem in the backend
      if (!isDemo) {
        // Extract only the spaced repetition data to send to backend
        const updateData = {
          spaced_repetition: updatedProblem.spaced_repetition
        };
        
        // Debug logging
        console.log('🔍 Sending update data to backend:', updateData);
        console.log('🔍 Updated problem:', updatedProblem);
        
        await problemsAPI.updateProblem(updatedProblem.id, updateData);
        console.log('✅ Spaced repetition data updated in backend');
      } else {
        // Demo mode: just log the update
        console.log('Demo mode: revision updated locally', updatedProblem);
      }
    } catch (error) {
      console.error('❌ Failed to update spaced repetition data:', error);
      
      // Show error toast
      toast.error('Failed to save revision progress. Please try again.');
      
      // Revert local state change on error
      if (data && data.todays_revision && data.todays_revision.id === updatedProblem.id) {
        setData(prevData => ({
          ...prevData,
          todays_revision: data.todays_revision // Revert to original
        }));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Loading your dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleRefresh} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={handleAddProblem} className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Problem
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Data Available</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start solving problems to see your analytics here</p>
            <Button onClick={handleAddProblem} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Problem
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { basic_stats, weaknesses, todays_revision, activity_heatmap, recent_activity } = data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Simple Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Hi {user?.displayName?.trim() || (user?.email ? user.email.split('@')[0] : (isDemo ? 'demo explorer' : 'there'))}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your LeetSpace learning analytics and insights {isDemo && '(demo)'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button onClick={handleAddProblem} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Plus className="h-4 w-4" />
            Add Problem
          </Button>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Problems"
            value={basic_stats.total_problems}
            subtitle="Problems logged"
            icon={FileText}
            onClick={handleViewAllProblems}
          />
          <StatCard
            title="Retry Later"
            value={basic_stats.retry_count}
            subtitle="Need review"
            icon={RotateCcw}
            onClick={handleViewRetryProblems}
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
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Tags className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                Most Used Tags
              </h2>
              <Button 
                onClick={handleViewAllProblems} 
                variant="outline" 
                size="sm"
                className="border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                View All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {basic_stats.most_used_tags.map(({ tag, count }, index) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  onClick={() => handleViewProblemsByTag(tag)}
                >
                  {tag} ({count})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <WeaknessCard weaknesses={weaknesses} onTagClick={handleViewProblemsByWeakness} />
            <TodaysRevision revision={todays_revision} onRevisionUpdate={handleRevisionUpdate} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <RecentActivity activities={recent_activity} />
          </div>
        </div>

        {/* Activity Heatmap */}
        <ActivityHeatmap data={activity_heatmap} />
      </div>
    </div>
  );
}