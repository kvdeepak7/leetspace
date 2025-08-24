import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink, RotateCcw, Activity, Pencil, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function RecentActivity({ activities = [], className = "" }) {
  const navigate = useNavigate();

  if (activities.length === 0) {
    return (
      <Card className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
            <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              No recent activity
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Start solving problems to see your activity here
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

  const handleProblemClick = (problemId) => {
    navigate(`/problems/${problemId}`);
  };

  return (
    <Card className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
          <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              onClick={() => handleProblemClick(activity.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate text-gray-900 dark:text-white">
                    {activity.title}
                  </h4>
                  {activity.retry_later && (
                    <RotateCcw className="h-3 w-3 text-gray-500 dark:text-gray-400 flex-shrink-0" title="Marked for retry" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    className={`text-xs ${difficultyColors[activity.difficulty] || difficultyColors.Medium}`}
                  >
                    {activity.difficulty}
                  </Badge>
                  {activity.action && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300">
                      {activity.action === 'edit' ? (
                        <>
                          <Pencil className="h-3 w-3" /> Edited
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-3 w-3" /> Created
                        </>
                      )}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time_ago}
                  </span>
                </div>

                {/* Tags */}
                {activity.tags && activity.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {activity.tags.map(tag => (
                      <span 
                        key={tag}
                        className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-zinc-700 rounded text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-zinc-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <ExternalLink className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0" />
            </div>
          ))}

          {/* View All Link */}
          <div className="pt-3 border-t border-gray-200 dark:border-zinc-700">
            <button 
              onClick={() => navigate('/problems')}
              className="w-full cursor-pointer p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-sm text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors font-medium"
            >
              <span className="flex items-center justify-center gap-2">
                View all problems
                <ExternalLink className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}