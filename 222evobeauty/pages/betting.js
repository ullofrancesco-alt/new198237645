import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import BettingMarketCard from "../components/betting/BettingMarketCard";
import UserBalance from "../components/betting/UserBalance";
import MyBets from "../components/betting/MyBets";
import { Coins, TrendingUp, Trophy, Users, Zap, Activity, Target, Clock, Flame, Crown, Medal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageContext } from "../Layout";

const translations = {
  en: {
    betting_title: "$BOT Betting Pools",
    betting_subtitle: "Bet on the next prompt!",
    betting_active_pools: "Active Pools",
    betting_my_bets: "My Bets",
    betting_resolved: "Resolved",
    betting_no_active: "No active pools.",
    betting_no_resolved: "No resolved markets yet.",
    betting_login_required: "⚠️ Login required.",
    betting_live_stats: "Live Stats",
    betting_total_volume: "Total Volume",
    betting_active_bettors: "Active Bettors",
    betting_total_markets: "Total Markets",
    betting_avg_pool: "Avg Pool Size",
    betting_recent_activity: "Recent Activity",
    betting_leaderboard: "Top Bettors",
    betting_hot_markets: "🔥 Hot Markets",
    betting_closing_soon: "⏰ Closing Soon",
  },
  it: {
    betting_title: "Pool Scommesse $BOT",
    betting_subtitle: "Scommetti sul prossimo prompt!",
    betting_active_pools: "Pool Attivi",
    betting_my_bets: "Le Mie Scommesse",
    betting_resolved: "Risolti",
    betting_no_active: "Nessun pool attivo.",
    betting_no_resolved: "Nessun mercato risolto ancora.",
    betting_login_required: "⚠️ Login richiesto.",
    betting_live_stats: "Statistiche Live",
    betting_total_volume: "Volume Totale",
    betting_active_bettors: "Scommettitori Attivi",
    betting_total_markets: "Mercati Totali",
    betting_avg_pool: "Pool Medio",
    betting_recent_activity: "Attività Recente",
    betting_leaderboard: "Top Scommettitori",
    betting_hot_markets: "🔥 Mercati Hot",
    betting_closing_soon: "⏰ Chiudono Presto",
  },
};

export default function Betting() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const { language } = React.useContext(LanguageContext);
  const t = translations[language] || translations.en;

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.log("User not logged in");
      }
    };
    fetchUser();
  }, []);

  const { data: markets } = useQuery({
    queryKey: ['markets'],
    queryFn: () => base44.entities.BettingMarket.list("-created_date"),
    initialData: [],
  });

  const { data: userBets } = useQuery({
    queryKey: ['userBets', user?.email],
    queryFn: () => base44.entities.UserBet.filter({ user_email: user?.email }, "-created_date"),
    initialData: [],
    enabled: !!user?.email,
  });

  const { data: allBets } = useQuery({
    queryKey: ['allBets'],
    queryFn: () => base44.entities.UserBet.list("-created_date", 50),
    initialData: [],
  });

  const { data: balances } = useQuery({
    queryKey: ['balances'],
    queryFn: () => base44.entities.TokenBalance.list(),
    initialData: [],
  });

  const userBalance = user ? balances.find(b => b.user_email === user.email) : null;

  const ensureBalanceMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const existing = balances.find(b => b.user_email === user.email);
      if (!existing) {
        await base44.entities.TokenBalance.create({
          user_email: user.email,
          balance: 0,
          total_deposited: 0,
          total_won: 0,
          total_lost: 0,
          total_bets: 0
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balances'] });
    }
  });

  React.useEffect(() => {
    if (user && !userBalance) {
      ensureBalanceMutation.mutate();
    }
  }, [user, userBalance]);

  // Calculate live stats
  const activeMarkets = markets.filter(m => m.status === 'active');
  const resolvedMarkets = markets.filter(m => m.status === 'resolved');
  
  const totalVolume = markets.reduce((sum, m) => 
    sum + (m.total_back_a || 0) + (m.total_lay_a || 0) + (m.total_back_b || 0) + (m.total_lay_b || 0), 0
  );
  
  const activeBettors = new Set(allBets.map(b => b.user_email)).size;
  const avgPoolSize = markets.length > 0 ? totalVolume / markets.length : 0;

  // Recent activity (last 10 bets)
  const recentBets = allBets.slice(0, 10);

  // Leaderboard (top 5 by total won)
  const leaderboard = [...balances]
    .sort((a, b) => (b.total_won || 0) - (a.total_won || 0))
    .slice(0, 5);

  // Hot markets (highest volume)
  const hotMarkets = [...activeMarkets]
    .sort((a, b) => {
      const volumeA = (a.total_back_a || 0) + (a.total_lay_a || 0) + (a.total_back_b || 0) + (a.total_lay_b || 0);
      const volumeB = (b.total_back_a || 0) + (b.total_lay_a || 0) + (b.total_back_b || 0) + (b.total_lay_b || 0);
      return volumeB - volumeA;
    })
    .slice(0, 3);

  // Closing soon (next 24h)
  const closingSoon = activeMarkets
    .filter(m => {
      if (!m.closes_at) return false;
      const closeTime = new Date(m.closes_at);
      const now = new Date();
      const hoursUntilClose = (closeTime - now) / (1000 * 60 * 60);
      return hoursUntilClose > 0 && hoursUntilClose < 24;
    })
    .sort((a, b) => new Date(a.closes_at) - new Date(b.closes_at))
    .slice(0, 3);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Coins className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              {t.betting_title}
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            {t.betting_subtitle}
          </p>
        </div>

        {/* User Balance */}
        {user && userBalance && (
          <UserBalance balance={userBalance} />
        )}

        {!user && (
          <div className="mb-8 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-400">
              {t.betting_login_required}
            </p>
          </div>
        )}

        {/* Live Stats Dashboard */}
        <Card className="mb-8 bg-gradient-to-br from-slate-900/50 to-blue-900/30 backdrop-blur-xl border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
              {t.betting_live_stats}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-slate-800/50 rounded-xl border border-cyan-500/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-5 h-5 text-cyan-400" />
                  <p className="text-xs text-slate-400">{t.betting_total_volume}</p>
                </div>
                <p className="text-2xl font-bold text-cyan-400">{totalVolume.toFixed(0)}</p>
                <p className="text-xs text-slate-500">$BOT</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 bg-slate-800/50 rounded-xl border border-purple-500/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <p className="text-xs text-slate-400">{t.betting_active_bettors}</p>
                </div>
                <p className="text-2xl font-bold text-purple-400">{activeBettors}</p>
                <p className="text-xs text-slate-500">Users</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-slate-800/50 rounded-xl border border-pink-500/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-pink-400" />
                  <p className="text-xs text-slate-400">{t.betting_total_markets}</p>
                </div>
                <p className="text-2xl font-bold text-pink-400">{markets.length}</p>
                <p className="text-xs text-slate-500">Markets</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-slate-800/50 rounded-xl border border-green-500/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <p className="text-xs text-slate-400">{t.betting_avg_pool}</p>
                </div>
                <p className="text-2xl font-bold text-green-400">{avgPoolSize.toFixed(0)}</p>
                <p className="text-xs text-slate-500">$BOT</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Widgets */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Hot Markets */}
          {hotMarkets.length > 0 && (
            <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2 text-lg">
                  <Flame className="w-5 h-5 text-orange-400" />
                  {t.betting_hot_markets}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hotMarkets.map((market, index) => {
                    const volume = (market.total_back_a || 0) + (market.total_lay_a || 0) + 
                                  (market.total_back_b || 0) + (market.total_lay_b || 0);
                    return (
                      <div key={market.id} className="p-3 bg-slate-800/30 rounded-lg border border-orange-500/20">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-bold text-slate-200 line-clamp-2">{market.title}</p>
                          <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 flex-shrink-0">
                            #{index + 1}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-orange-400" />
                          <p className="text-xs text-orange-300 font-bold">{volume.toFixed(0)} $BOT</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Closing Soon */}
          {closingSoon.length > 0 && (
            <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 backdrop-blur-xl border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />
                  {t.betting_closing_soon}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {closingSoon.map((market) => {
                    const closeTime = new Date(market.closes_at);
                    const now = new Date();
                    const hoursUntilClose = Math.floor((closeTime - now) / (1000 * 60 * 60));
                    return (
                      <div key={market.id} className="p-3 bg-slate-800/30 rounded-lg border border-yellow-500/20">
                        <p className="text-sm font-bold text-slate-200 line-clamp-2 mb-2">{market.title}</p>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <p className="text-xs text-yellow-300 font-bold">
                            {hoursUntilClose}h remaining
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leaderboard */}
          {leaderboard.length > 0 && (
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2 text-lg">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  {t.betting_leaderboard}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((balance, index) => (
                    <div key={balance.id} className="p-3 bg-slate-800/30 rounded-lg border border-purple-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-yellow-500/20 border-2 border-yellow-500' :
                            index === 1 ? 'bg-slate-400/20 border-2 border-slate-400' :
                            index === 2 ? 'bg-amber-600/20 border-2 border-amber-600' :
                            'bg-slate-600/20 border border-slate-600'
                          }`}>
                            {index === 0 ? <Crown className="w-4 h-4 text-yellow-400" /> :
                             index === 1 ? <Medal className="w-4 h-4 text-slate-300" /> :
                             index === 2 ? <Medal className="w-4 h-4 text-amber-500" /> :
                             <span className="text-slate-400 text-xs font-bold">#{index + 1}</span>}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-200">
                              {balance.user_email?.split('@')[0] || 'Anonymous'}
                            </p>
                            <p className="text-xs text-slate-500">
                              {balance.total_bets || 0} bets
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-400">
                            +{(balance.total_won || 0).toFixed(0)}
                          </p>
                          <p className="text-xs text-slate-500">$BOT won</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity Feed */}
        {recentBets.length > 0 && (
          <Card className="mb-8 bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Zap className="w-6 h-6 text-cyan-400" />
                {t.betting_recent_activity}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {recentBets.map((bet, index) => {
                    const market = markets.find(m => m.id === bet.market_id);
                    return (
                      <motion.div
                        key={bet.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:border-cyan-500/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            bet.bet_type === 'back' ? 'bg-green-400' : 'bg-red-400'
                          } animate-pulse`}></div>
                          <div>
                            <p className="text-sm text-slate-300">
                              <span className="font-bold">{bet.user_email?.split('@')[0]}</span>
                              {' '}bet{' '}
                              <span className="text-cyan-400 font-bold">{bet.amount} $BOT</span>
                              {' '}on{' '}
                              <span className="text-purple-400">{bet.option === 'A' ? 'Option A' : 'Option B'}</span>
                            </p>
                            <p className="text-xs text-slate-500 truncate max-w-md">
                              {market?.title || 'Unknown market'}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={`${
                          bet.bet_type === 'back' 
                            ? 'bg-green-500/10 text-green-300 border-green-500/30' 
                            : 'bg-red-500/10 text-red-300 border-red-500/30'
                        }`}>
                          {bet.bet_type.toUpperCase()}
                        </Badge>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 p-1">
            <TabsTrigger 
              value="active"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {t.betting_active_pools} ({activeMarkets.length})
            </TabsTrigger>
            <TabsTrigger 
              value="mybets"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Coins className="w-4 h-4 mr-2" />
              {t.betting_my_bets}
            </TabsTrigger>
            <TabsTrigger 
              value="resolved"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Trophy className="w-4 h-4 mr-2" />
              {t.betting_resolved} ({resolvedMarkets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeMarkets.length > 0 ? (
              <div className="grid gap-6">
                {activeMarkets.map((market) => (
                  <BettingMarketCard 
                    key={market.id} 
                    market={market} 
                    user={user}
                    userBalance={userBalance}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900/30 backdrop-blur-xl rounded-2xl border border-cyan-500/20">
                <Coins className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  {t.betting_no_active}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mybets">
            {user ? (
              <MyBets bets={userBets} markets={markets} />
            ) : (
              <div className="text-center py-12 bg-slate-900/30 backdrop-blur-xl rounded-2xl border border-cyan-500/20">
                <p className="text-slate-400">
                  {t.betting_login_required}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="resolved">
            {resolvedMarkets.length > 0 ? (
              <div className="grid gap-6">
                {resolvedMarkets.map((market) => (
                  <BettingMarketCard 
                    key={market.id} 
                    market={market} 
                    user={user}
                    userBalance={userBalance}
                    readonly
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900/30 backdrop-blur-xl rounded-2xl border border-cyan-500/20">
                <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  {t.betting_no_resolved}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}