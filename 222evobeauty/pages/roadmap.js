import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, Zap, Target, ChevronDown, ChevronUp, User, Bot } from "lucide-react";
import { format, subMonths, subYears, isAfter } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function Roadmap() {
  const [timeframe, setTimeframe] = useState("1M");
  const [expandedPrompt, setExpandedPrompt] = useState(null);

  const { data: highlights, isLoading } = useQuery({
    queryKey: ['highlights'],
    queryFn: () => base44.entities.DailyHighlight.list("-impact_score"),
    initialData: [],
  });

  const getTimeframeDate = () => {
    const now = new Date();
    switch (timeframe) {
      case "1M": return subMonths(now, 1);
      case "3M": return subMonths(now, 3);
      case "6M": return subMonths(now, 6);
      case "1Y": return subYears(now, 1);
      case "5Y": return subYears(now, 5);
      case "MAX": return subYears(now, 17);
      default: return subMonths(now, 1);
    }
  };

  const getMaxPrompts = () => {
    switch (timeframe) {
      case "1M": return 30;
      case "3M": return 45;
      case "6M": return 50;
      case "1Y": return 100;
      case "5Y": return 200;
      case "MAX": return highlights.length;
      default: return 30;
    }
  };

  const filteredHighlights = highlights
    .filter(h => {
      const highlightDate = new Date(h.date);
      return isAfter(highlightDate, getTimeframeDate());
    })
    .sort((a, b) => (b.impact_score || 0) - (a.impact_score || 0))
    .slice(0, getMaxPrompts());

  const totalImpact = filteredHighlights.reduce((sum, h) => sum + (h.impact_score || 0), 0);
  const avgImpact = filteredHighlights.length > 0 ? totalImpact / filteredHighlights.length : 0;

  const categoryColors = {
    diy_beginner: "bg-green-500/20 text-green-300 border-green-500/30",
    component_suppliers: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    cost_breakdown: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    industry_news: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    breakthrough_tech: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    tesla_optimus: "bg-red-500/20 text-red-300 border-red-500/30",
    unitree_robots: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    meta_ai: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  };

  const timeframes = [
    { label: "1 Mese", value: "1M", maxPrompts: 30 },
    { label: "3 Mesi", value: "3M", maxPrompts: 45 },
    { label: "6 Mesi", value: "6M", maxPrompts: 50 },
    { label: "1 Anno", value: "1Y", maxPrompts: 100 },
    { label: "5 Anni", value: "5Y", maxPrompts: 200 },
    { label: "Max (17 Anni)", value: "MAX", maxPrompts: "∞" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              Timeline Milestone
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Le pietre miliari più importanti verso la costruzione di umanoidi completi
          </p>
        </div>

        {/* Timeframe Selector (Stock Chart Style) */}
        <div className="mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
            <CardContent className="p-6">
              {/* Stats Row */}
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Milestone Visualizzate</p>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    {filteredHighlights.length}
                  </p>
                  <p className="text-xs text-slate-500">
                    su max {getMaxPrompts()} per {timeframes.find(t => t.value === timeframe)?.label}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Avg Impact Score</p>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {avgImpact.toFixed(0)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Total Impact</p>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                    {totalImpact.toFixed(0)}
                  </p>
                </div>
              </div>

              {/* Timeframe Buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                {timeframes.map((tf) => (
                  <Button
                    key={tf.value}
                    onClick={() => setTimeframe(tf.value)}
                    variant={timeframe === tf.value ? "default" : "outline"}
                    className={
                      timeframe === tf.value
                        ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white border-none"
                        : "border-cyan-500/30 text-slate-300 hover:bg-cyan-500/10"
                    }
                  >
                    {tf.label}
                    <span className="ml-2 text-xs opacity-70">
                      (max {tf.maxPrompts})
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="text-slate-400 mt-4">Caricamento timeline...</p>
          </div>
        ) : filteredHighlights.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredHighlights.map((highlight, index) => {
                const isIndustry = ['tesla_optimus', 'unitree_robots', 'meta_ai', 'industry_news', 'breakthrough_tech'].includes(highlight.category);
                
                return (
                  <motion.div
                    key={highlight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer">
                      <CardContent className="p-6">
                        <div 
                          className="flex items-start justify-between gap-4"
                          onClick={() => setExpandedPrompt(expandedPrompt === highlight.id ? null : highlight.id)}
                        >
                          <div className="flex-1">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                              <Badge variant="outline" className="bg-cyan-500/10 text-cyan-300 border-cyan-500/30">
                                <Calendar className="w-3 h-3 mr-1" />
                                {format(new Date(highlight.date), 'dd MMM yyyy')}
                              </Badge>
                              
                              <Badge variant="outline" className={isIndustry ? "bg-red-500/10 text-red-300 border-red-500/30" : "bg-green-500/10 text-green-300 border-green-500/30"}>
                                {isIndustry ? '🏭 Grande Player' : '🔧 Community'}
                              </Badge>

                              <Badge variant="outline" className={categoryColors[highlight.category] || "bg-slate-500/20 text-slate-300"}>
                                {highlight.category?.replace(/_/g, ' ')}
                              </Badge>
                              
                              <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
                                <Zap className="w-3 h-3 mr-1" />
                                Impact: {highlight.impact_score}
                              </Badge>

                              {highlight.practical_value >= 70 && (
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-300 border-amber-500/30">
                                  <Target className="w-3 h-3 mr-1" />
                                  Pratico: {highlight.practical_value}
                                </Badge>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-slate-200 mb-2">
                              {highlight.title}
                            </h3>

                            {/* Summary */}
                            <p className="text-slate-400 text-sm leading-relaxed mb-3">
                              {highlight.summary}
                            </p>

                            {/* Expand indicator */}
                            <div className="flex items-center text-cyan-400 text-sm">
                              {expandedPrompt === highlight.id ? (
                                <>
                                  <ChevronUp className="w-4 h-4 mr-1" />
                                  Nascondi dettagli
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4 mr-1" />
                                  Mostra conversazione completa
                                </>
                              )}
                            </div>
                          </div>

                          {/* Impact Bar */}
                          <div className="hidden md:block w-24">
                            <div className="text-xs text-slate-400 mb-2 text-center">Impact</div>
                            <div className="relative h-32 bg-slate-800/50 rounded-lg overflow-hidden">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${highlight.impact_score}%` }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-500 via-purple-500 to-pink-500"
                              />
                            </div>
                            <div className="text-xs text-slate-400 mt-1 text-center font-bold">
                              {highlight.impact_score}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {expandedPrompt === highlight.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-6 pt-6 border-t border-cyan-500/20"
                            >
                              {/* User Message */}
                              <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <User className="w-4 h-4 text-purple-400" />
                                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                                    Domanda Utente
                                  </p>
                                </div>
                                <div className="p-4 bg-slate-800/30 rounded-xl border border-purple-500/20">
                                  <p className="text-slate-300 text-sm leading-relaxed">
                                    {highlight.user_message}
                                  </p>
                                </div>
                              </div>

                              {/* AI Response */}
                              <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Bot className="w-4 h-4 text-cyan-400" />
                                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                                    Risposta AI
                                  </p>
                                </div>
                                <div className="p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/20">
                                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {highlight.ai_response}
                                  </p>
                                </div>
                              </div>

                              {/* Actionable Steps */}
                              {highlight.actionable_steps && highlight.actionable_steps.length > 0 && (
                                <div>
                                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                                    ⚡ Azioni Concrete
                                  </p>
                                  <div className="space-y-2">
                                    {highlight.actionable_steps.map((step, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-start gap-2 p-3 bg-green-500/5 rounded-lg border border-green-500/20"
                                      >
                                        <span className="text-green-400 font-bold flex-shrink-0">
                                          {idx + 1}.
                                        </span>
                                        <span className="text-slate-300 text-sm">{step}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                Nessuna milestone trovata per il periodo selezionato.
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Le milestone verranno aggiunte automaticamente man mano che gli utenti contribuiscono con prompt di valore.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}