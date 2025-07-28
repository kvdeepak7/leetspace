import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Target, Brain, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.uid) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, recRes] = await Promise.all([
        axios.get("/api/problems/stats", {
          baseURL: "http://localhost:8000",
        }),
        axios.get("/api/problems/recommendations/next", {
          baseURL: "http://localhost:8000",
        })
      ]);
      
      setStats(statsRes.data);
      setRecommendations(recRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-zinc-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
          Welcome to LeetSpace
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Track your coding practice and get intelligent insights
        </p>
        <Button onClick={() => navigate("/auth")}>
          Get Started
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's your coding practice overview
          </p>
        </div>
        <Button onClick={() => navigate("/add-problem")}>
          Log New Problem
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_solved || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.insights?.total_practice_days || 0} practice days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Velocity</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.insights?.learning_velocity || "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Current pace
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consistency</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.insights?.consistency_score || 0}%</div>
            <p className="text-xs text-muted-foreground">
              30-day activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.retry_later_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Problems to retry
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Intelligent Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Smart Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations?.recommendations?.slice(0, 3).map((rec, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{rec.reason}</h4>
                  <Badge variant={rec.difficulty === "Easy" ? "default" : 
                                rec.difficulty === "Medium" ? "secondary" : "destructive"}>
                    {rec.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {rec.description}
                </p>
                <div className="flex gap-1 flex-wrap">
                  {rec.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            {recommendations?.recommendations?.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Solve a few problems to get personalized recommendations!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Learning Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Difficulty Distribution */}
            <div>
              <h4 className="font-medium mb-2">Difficulty Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(stats?.by_difficulty || {}).map(([diff, count]) => (
                  <div key={diff} className="flex justify-between items-center">
                    <span className="text-sm">{diff}</span>
                    <Badge variant={diff === "Easy" ? "default" : 
                                  diff === "Medium" ? "secondary" : "destructive"}>
                      {count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Strength & Weakness */}
            {stats?.insights && (
              <>
                {stats.insights.strength_areas?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-green-600">Strengths</h4>
                    <div className="flex gap-1 flex-wrap">
                      {stats.insights.strength_areas.map(area => (
                        <Badge key={area} variant="outline" className="text-green-600">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {stats.insights.weakness_areas?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-orange-600">Focus Areas</h4>
                    <div className="flex gap-1 flex-wrap">
                      {stats.insights.weakness_areas.map(area => (
                        <Badge key={area} variant="outline" className="text-orange-600">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Next Goal: {stats.insights.next_recommended_difficulty}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Button onClick={() => navigate("/problems")}>
              View All Problems
            </Button>
            <Button variant="outline" onClick={() => navigate("/add-problem")}>
              Add Problem
            </Button>
            {stats?.retry_later_count > 0 && (
              <Button variant="outline" onClick={() => navigate("/problems?filter=retry")}>
                Review {stats.retry_later_count} Problems
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
  