import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Globe, TrendingUp, MessageSquare, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Analytics() {
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list("-created_date"),
    initialData: [],
  });

  const categoryStats = conversations.reduce((acc, conv) => {
    acc[conv.category] = (acc[conv.category] || 0) + 1;
    return acc;
  }, {});

  const languageStats = conversations.reduce((acc, conv) => {
    acc[conv.language] = (acc[conv.language] || 0) + 1;
    return acc;
  }, {});

  const averageRelevance = conversations.length > 0
    ? conversations.reduce((sum, conv) => sum + (conv.relevance_score || 0), 0) / conversations.length
    : 0;

  const topInsights = conversations
    .filter(conv => conv.key_insights && conv.key_insights.length > 0)
    .flatMap(conv => conv.key_insights)
    .slice(0, 10);

  const categoryColors = {
    work_automation: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    emotional_companionship: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    sexual_companionship: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    general_ai: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    other: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              Global Analytics
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Insights and statistics from worldwide conversations about humanoid development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Total Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                {conversations.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Avg Relevance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {averageRelevance.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-pink-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                {Object.keys(languageStats).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {topInsights.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-200">
                Conversations by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <Badge variant="outline" className={`${categoryColors[category]} border`}>
                      {category.replace(/_/g, " ")}
                    </Badge>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                          style={{ width: `${(count / conversations.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-slate-300 font-medium w-12 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-200">
                Top Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(languageStats)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([language, count]) => (
                    <div key={language} className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium uppercase">{language}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${(count / conversations.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-slate-300 font-medium w-12 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {topInsights.length > 0 && (
          <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-200 flex items-center gap-2">
                <Zap className="w-6 h-6 text-cyan-400" />
                Recent Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topInsights.map((insight, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-slate-800/30 rounded-xl border border-cyan-500/10 hover:border-cyan-500/30 transition-colors"
                  >
                    <p className="text-slate-300 text-sm leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}