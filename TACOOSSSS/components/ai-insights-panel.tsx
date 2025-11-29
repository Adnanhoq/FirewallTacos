import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface AIInsightsPanelProps {
  insights: string[];
  isLoading?: boolean;
}

export function AIInsightsPanel({ insights, isLoading }: AIInsightsPanelProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold text-slate-900">
            AI Insights
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-slate-500">
            Analyzing latest energy patterns…
          </p>
        ) : (
          <ul className="space-y-3">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span className="text-sm text-slate-700 leading-relaxed">
                  {insight}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
