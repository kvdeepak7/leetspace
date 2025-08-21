import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, ExternalLink, Target, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { skipRevision, calculateNextReview } from "@/lib/spacedRepetition";

export function TodaysRevision({ revision, className = "", onRevisionUpdate }) {
  const navigate = useNavigate();
  const [skipped, setSkipped] = useState(false);
  const [showQualitySelector, setShowQualitySelector] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(null);

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
              All caught up with your spaced repetition
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

  const handleReview = () => {
    navigate(`/problems/${revision.id}`);
  };

  const handleSkip = () => {
    // Apply spaced repetition skip logic
    const updatedProblem = skipRevision(revision);
    
    // Update the problem in the parent component
    if (onRevisionUpdate) {
      onRevisionUpdate(updatedProblem);
    }
    
    setSkipped(true);
    
    // Reset after showing feedback
    setTimeout(() => {
      setSkipped(false);
    }, 3000);
  };

  const handleReviewComplete = (quality) => {
    setSelectedQuality(quality);
    setShowQualitySelector(false);
    
    // Apply spaced repetition logic
    const updatedProblem = calculateNextReview(revision, quality);
    
    // Update the problem in the parent component
    if (onRevisionUpdate) {
      onRevisionUpdate(updatedProblem);
    }
    
    // Show success message briefly
    setTimeout(() => {
      setSelectedQuality(null);
    }, 2000);
  };

  const getQualityDescription = (quality) => {
    const descriptions = {
      0: "Complete blackout",
      1: "Incorrect response",
      2: "Correct response with difficulty",
      3: "Correct response with hesitation",
      4: "Correct response with minor errors",
      5: "Perfect response"
    };
    return descriptions[quality] || "Unknown";
  };

  const getQualityColor = (quality) => {
    if (quality >= 4) return "text-green-600 dark:text-green-400";
    if (quality >= 3) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  if (skipped) {
    return (
      <Card className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
            <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Revision Skipped
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Revision skipped for today
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This problem will be rescheduled for tomorrow
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedQuality !== null) {
    return (
      <Card className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            Review Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className={`text-2xl font-bold mb-2 ${getQualityColor(selectedQuality)}`}>
              Quality: {selectedQuality}/5
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {getQualityDescription(selectedQuality)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Next review scheduled based on your performance
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showQualitySelector) {
    return (
      <Card className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Rate Your Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              How well did you remember this problem?
            </p>
            
            <div className="grid grid-cols-6 gap-2">
              {[0, 1, 2, 3, 4, 5].map((quality) => (
                <Button
                  key={quality}
                  variant="outline"
                  size="sm"
                  className="h-12 text-xs"
                  onClick={() => handleReviewComplete(quality)}
                >
                  {quality}
                </Button>
              ))}
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
              <p>0 = Complete blackout</p>
              <p>5 = Perfect response</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            {revision.tags && revision.tags.length > 0 && (
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
            )}

            {/* Time since solved */}
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3" />
              <span>
                Solved {revision.days_since_solved} day{revision.days_since_solved !== 1 ? 's' : ''} ago
              </span>
            </div>

            {/* Simple Spaced Repetition Info - Just 1-2 lines */}
            {revision.spaced_repetition && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                <span>
                  {revision.spaced_repetition.repetitions > 0 
                    ? `Reviewed ${revision.spaced_repetition.repetitions} time${revision.spaced_repetition.repetitions !== 1 ? 's' : ''} • Next: ${revision.spaced_repetition.next_review ? new Date(revision.spaced_repetition.next_review).toLocaleDateString() : 'Not scheduled'}`
                    : 'First review • Next: Tomorrow'
                  }
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowQualitySelector(true)}
              className="flex-1 text-sm h-8 bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Complete Review
            </Button>
            <Button 
              onClick={handleReview}
              variant="outline"
              className="flex-1 text-sm h-8 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
              size="sm"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Problem
            </Button>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSkip}
              variant="outline" 
              className="flex-1 text-sm h-8 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
              size="sm"
            >
              <XCircle className="h-3 w-3 mr-1" />
              Skip Today
            </Button>
          </div>

          {/* Simple Info */}
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Rate your performance to optimize review intervals
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}