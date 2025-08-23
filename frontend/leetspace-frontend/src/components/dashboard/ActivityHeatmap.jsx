import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";

export function ActivityHeatmap({ data = [], className = "" }) {
  const [selectedDay, setSelectedDay] = useState(null);

  // Group data by months for layout
  const groupByMonth = (heatmapData) => {
    const months = {};
    heatmapData.forEach(day => {
      const date = new Date(day.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!months[monthKey]) {
        months[monthKey] = {
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          year: date.getFullYear(),
          days: []
        };
      }
      months[monthKey].days.push({
        ...day,
        dayOfWeek: date.getDay(),
        date: date.getDate()
      });
    });
    return Object.values(months);
  };

  const getIntensityClass = (level) => {
    const intensityClasses = {
      0: "bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700",
      1: "bg-green-200 dark:bg-green-900/50 border border-green-300 dark:border-green-800/60",
      2: "bg-green-300 dark:bg-green-800/60 border border-green-400 dark:border-green-700/70",
      3: "bg-green-400 dark:bg-green-700/80 border border-green-500 dark:border-green-600/90",
      4: "bg-green-500 dark:bg-green-600/90 border border-green-600 dark:border-green-500/100"
    };
    return intensityClasses[level] || intensityClasses[0];
  };

  const handleDayClick = (day) => {
    if (day.count > 0) {
      setSelectedDay(selectedDay?.date === day.date ? null : day);
    }
  };

  const months = groupByMonth(data);
  const recentMonths = months.slice(-12); // Show last 12 months

  return (
    <Card className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
          <TrendingUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          Activity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Less activity</span>
            <div className="flex items-center space-x-1">
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getIntensityClass(level)}`}
                />
              ))}
            </div>
            <span className="text-gray-500 dark:text-gray-400">More activity</span>
          </div>

          {/* Day labels */}
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 ml-2">
            <div className="grid grid-cols-7 gap-0.5 w-fit">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="w-3 h-3 flex items-center justify-center text-center font-medium text-xs">
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="flex gap-3 min-w-fit pb-2">
              {recentMonths.map((month, monthIndex) => (
                <div key={`${month.year}-${month.month}`} className="space-y-2 flex-shrink-0">
                  {/* Month label */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium h-4">
                    {month.month}
                  </div>
                  
                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-0.5 w-fit">
                    {/* Fill empty days at start of month */}
                    {month.days.length > 0 && 
                      Array.from({ length: month.days[0].dayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="w-3 h-3" />
                      ))
                    }
                    
                    {/* Actual days */}
                    {month.days.map(day => (
                      <div
                        key={day.date}
                        className={`w-3 h-3 rounded-sm ${getIntensityClass(day.level)} cursor-pointer hover:ring-1 hover:ring-gray-400 transition-all shadow-sm flex-shrink-0`}
                        onClick={() => handleDayClick(day)}
                        title={day.count > 0 ? `${day.count} problem${day.count !== 1 ? 's' : ''} solved on ${day.date}` : `No activity on ${day.date}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Day Info */}
          {selectedDay && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">
                    {selectedDay.count} problem{selectedDay.count !== 1 ? 's' : ''} solved on {selectedDay.date}
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Great progress on this day!
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors p-1 hover:bg-green-100 dark:hover:bg-green-900/50 rounded"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="text-center pt-3 border-t border-gray-200 dark:border-zinc-700">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span>
                {data.filter(d => d.count > 0).length} active days in the last year
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}