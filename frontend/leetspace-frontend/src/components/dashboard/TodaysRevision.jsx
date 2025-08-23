import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, ExternalLink, Target, CheckCircle, UserCheck, SkipForward, Lock, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { problemsAPI, analyticsAPI } from "@/lib/api";
import { toast } from "sonner";

export function TodaysRevision({ revision, lockedByServer = false, className = "", onRevisionUpdate }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);

  // Compute a daily key to lock today's revision after any action
  const todayKey = `todaysRevisionDone:${new Date().toISOString().slice(0, 10)}`;

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (localStorage.getItem(todayKey)) {
          setLocked(true);
        }
      }
    } catch (_) {
      // Ignore storage access issues; fail open
    }
  }, [todayKey]);

  const handleUnlockToday = async () => {
    try {
      // Clear local lock
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(todayKey);
      }
    } catch (_) {}
    try {
      await analyticsAPI.unlockToday();
    } catch (_) {}
    setLocked(false);
    toast.success("Unlocked today.");
  };

  if (locked || lockedByServer) {
    return (
      <Card className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
            <Lock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Today's revision action taken
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">Come back tomorrow.</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={handleUnlockToday} variant="outline" size="sm" className="h-8 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300">
                <RotateCcw className="h-3 w-3 mr-1" />
                Unlock Today
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!revision) {
    return (
      <Card className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
            <BookOpen className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Today's Revision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              No problems to review today!
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              All caught up with your retry queue
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const difficultyColors = {
    Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  };

  const handleViewProblem = () => {
    navigate(`/problems/${revision.id}`);
  };

  const handleSkipToday = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(todayKey, '1');
      }
    } catch (_) {}
    // Server-side lock
    analyticsAPI.lockToday().catch(() => {});
    setLocked(true);
    toast.success("Skipped today. Come back tomorrow.");
  };

  const handleCompleteReviewFuture = async () => {
    setLoading(true);
    try {
      // Update review_count by incrementing it
      const currentReviewCount = revision.review_count || 0;
      const updateData = {
        review_count: currentReviewCount + 1
      };

      await problemsAPI.updateProblem(revision.id, updateData);
      
      // Update local state
      const updatedProblem = {
        ...revision,
        review_count: currentReviewCount + 1
      };
      
      if (onRevisionUpdate) {
        onRevisionUpdate(updatedProblem);
      }

      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(todayKey, '1');
        }
      } catch (_) {}
      // Server-side lock
      analyticsAPI.lockToday().catch(() => {});
      setLocked(true);
      toast.success("Review completed. Come back tomorrow.");

      setTimeout(() => {
        setActionCompleted(null);
      }, 3000);

    } catch (error) {
      console.error("Failed to update review count:", error);
      toast.error("Failed to update review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReviewRemove = async () => {
    setLoading(true);
    try {
      // Set retry_later = No to remove from queue
      const updateData = {
        retry_later: "No"
      };

      await problemsAPI.updateProblem(revision.id, updateData);
      
      // Update local state
      const updatedProblem = {
        ...revision,
        retry_later: "No"
      };
      
      if (onRevisionUpdate) {
        onRevisionUpdate(updatedProblem);
      }

      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(todayKey, '1');
        }
      } catch (_) {}
      // Server-side lock
      analyticsAPI.lockToday().catch(() => {});
      setLocked(true);
      toast.success("Removed from retry. Come back tomorrow.");

      setTimeout(() => {
        setActionCompleted(null);
      }, 3000);

    } catch (error) {
      console.error("Failed to update retry_later:", error);
      toast.error("Failed to remove from retry queue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // No transient success card; actions lock the card for the day

  return (
    <Card className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
          <Target className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          Today's Revision
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Problem Info */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-sm leading-relaxed text-gray-900 dark:text-white">
                {revision.title}
              </h3>
              <Badge 
                className={`text-xs ml-2 ${difficultyColors[revision.difficulty] || difficultyColors.Medium}`}
              >
                {revision.difficulty}
              </Badge>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {revision.tags.slice(0, 3).map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-zinc-800 rounded text-gray-600 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
              {revision.tags.length > 3 && (
                <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-zinc-800 rounded text-gray-600 dark:text-gray-300">
                  +{revision.tags.length - 3}
                </span>
              )}
            </div>
            
            {/* Days since solved and review count */}
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  Solved {revision.days_since_solved} day{revision.days_since_solved !== 1 ? 's' : ''} ago
                </span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>
                  Reviewed {(revision.review_count ?? 0)} time{(revision.review_count ?? 0) !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Complete Review Actions */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Complete Review:</p>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                onClick={handleCompleteReviewFuture}
                disabled={loading}
                className="flex-1 text-sm h-8 bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Choose to come back in future
              </Button>
              <Button 
                onClick={handleCompleteReviewRemove}
                disabled={loading}
                className="flex-1 text-sm h-8 bg-purple-600 hover:bg-purple-700 text-white"
                size="sm"
              >
                <UserCheck className="h-3 w-3 mr-1" />
                Have confidence, remove from retry
              </Button>
            </div>
          </div>

          {/* Other Actions */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={handleSkipToday}
                variant="outline"
                className="text-sm h-8 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300"
                size="sm"
              >
                <SkipForward className="h-3 w-3 mr-1" />
                Skip Today
              </Button>
              <Button 
                onClick={handleViewProblem}
                variant="outline"
                className="text-sm h-8 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300"
                size="sm"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Problem
              </Button>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Queue Updates:</strong> Choose "come back in future" to increment review count and keep in queue. 
              Choose "remove from retry" to permanently remove from queue.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}