import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Calendar, Target } from "lucide-react";

export function RevisionHistory({ problem, className = "" }) {
  if (!problem || !problem.spacedRepetition) {
    return null;
  }

  const sr = problem.spacedRepetition;
  const nextReview = sr.nextReview ? new Date(sr.nextReview) : null;
  const today = new Date();
  const isOverdue = nextReview && nextReview < today;

  const getNextReviewText = () => {
    if (!nextReview) return "Not scheduled";
    
    const diffTime = nextReview - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
    } else if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else {
      return `In ${diffDays} days`;
    }
  };

  const getEasinessColor = (easiness) => {
    if (easiness >= 2.5) return "text-green-600 dark:text-green-400";
    if (easiness >= 2.0) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getEasinessDescription = (easiness) => {
    if (easiness >= 2.5) return "Easy to remember";
    if (easiness >= 2.0) return "Moderate difficulty";
    return "Hard to remember";
  };

  return (
    <Card className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
          <Target className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          Revision Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {sr.repetitions}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Reviews
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {sr.interval}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Day{sr.interval !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Next Review */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Next Review
              </span>
            </div>
            <div className={`text-sm ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-blue-700 dark:text-blue-300'}`}>
              {getNextReviewText()}
            </div>
          </div>

          {/* Easiness Factor */}
          <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Easiness Factor
              </span>
            </div>
            <div className={`text-lg font-bold ${getEasinessColor(sr.easiness)}`}>
              {sr.easiness.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {getEasinessDescription(sr.easiness)}
            </div>
          </div>

          {/* Review History */}
          {sr.reviewHistory && sr.reviewHistory.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Recent Reviews
                </span>
              </div>
              <div className="space-y-2">
                {sr.reviewHistory.slice(-3).reverse().map((review, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-zinc-800 rounded text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">
                        {review.date ? new Date(review.date).toLocaleDateString() : 'Unknown'}
                      </span>
                      {review.action === 'skipped' ? (
                        <Badge variant="secondary" className="text-xs">
                          Skipped
                        </Badge>
                      ) : (
                        <Badge 
                          variant={review.quality >= 4 ? "default" : review.quality >= 3 ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {review.quality}/5
                        </Badge>
                      )}
                    </div>
                    {review.interval && (
                      <span className="text-gray-500 dark:text-gray-400">
                        {review.interval}d
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <div className="text-sm text-green-900 dark:text-green-100 mb-2">
              Progress Status
            </div>
            <div className="text-xs text-green-700 dark:text-green-300">
              {sr.repetitions === 0 && "First review - start your learning journey!"}
              {sr.repetitions === 1 && "Good start! Keep reviewing to strengthen memory."}
              {sr.repetitions === 2 && "Building momentum! Regular reviews are working."}
              {sr.repetitions >= 3 && sr.repetitions < 5 && "Excellent progress! You're developing strong retention."}
              {sr.repetitions >= 5 && "Master level! This concept is well-embedded in your memory."}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

