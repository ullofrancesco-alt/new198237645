import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Wallet, Trophy, Zap, Link as LinkIcon, Loader2, Users, Coins, Clock, CheckCircle, ArrowRight, Sparkles, Shield, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import ChatInterface from "../components/chat/ChatInterface";
import { LanguageContext } from "../Layout";
import { motion } from "framer-motion";

function createPageUrl(pageName) {
  return `/${pageName}`;
}

const translations = {
  // ... keep existing translations ...
  en: {
    home_title: "Prompt4Future",
    home_subtitle: "Collective Intelligence to Accelerate Humanoid Development",
    home_hero_cta_primary: "Start Contributing Now",
    home_hero_cta_secondary: "Watch Demo",
    home_stats_conversations: "Conversations",
    home_stats_acceleration: "Days Saved",
    home_stats_users: "Active Contributors",
    home_stats_volume: "Betting Volume",
    home_how_it_works_title: "How It Works",
    home_how_step1: "Ask AI Anything",
    home_how_step2: "Best Insights Published",
    home_how_step3: "Community Bets & Wins",
    home_social_proof_title: "Trusted by Innovators Worldwide",
    home_features_betting: "Predict Breakthroughs",
    home_features_wallet: "Earn $BOT Tokens",
    home_features_timeline: "Track Progress",
    home_cta_final: "Join the Movement",
  },
  it: {
    home_title: "Prompt4Future",
    home_subtitle: "Intelligenza Collettiva per Accelerare lo Sviluppo di Umanoidi",
    home_hero_cta_primary: "Inizia a Contribuire",
    home_hero_cta_secondary: "Guarda Demo",
    home_stats_conversations: "Conversazioni",
    home_stats_acceleration: "Giorni Risparmiati",
    home_stats_users: "Contributori Attivi",
    home_stats_volume: "Volume Scommesse",
    home_how_it_works_title: "Come Funziona",
    home_how_step1: "Chiedi Qualsiasi Cosa all'AI",
    home_how_step2: "I Migliori Insight Pubblicati",
    home_how_step3: "La Community Scommette e Vince",
    home_social_proof_title: "Usato da Innovatori in Tutto il Mondo",
    home_features_betting: "Prevedi i Breakthrough",
    home_features_wallet: "Guadagna $BOT",
    home_features_timeline: "Traccia i Progressi",
    home_cta_final: "Unisciti al Movimento",
  }
};

export default function Home() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();
  
  let language = 'it';
  
  try {
    const context = React.useContext(LanguageContext);
    language = context?.language || 'it';
  } catch (error) {
    console.error("❌ Home: Error getting LanguageContext:", error);
  }
  
  const t = translations[language] || translations.en || {};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.log("❌ Home: User not logged in");
      }
    };
    fetchUser();
  }, []);

  const { data: balances } = useQuery({
    queryKey: ['balances'],
    queryFn: () => base44.entities.TokenBalance.list(),
    initialData: [],
  });

  const { data: platformStats } = useQuery({
    queryKey: ['platformStats'],
    queryFn: async () => {
      const stats = await base44.entities.PlatformStats.list();
      return stats.length > 0 ? stats[0] : {
        betting_activity: { total_bets_placed: 0, total_volume: 0 },
        user_metrics: { total_users: 0 },
        content_metrics: { total_conversations: 0, total_acceleration_days: 0 }
      };
    }
  });

  const { data: conversations } = useQuery({
    queryKey: ['recentConversations'],
    queryFn: () => base44.entities.Conversation.list("-created_date", 5),
    initialData: [],
  });

  const userBalance = user ? balances.find(b => b.user_email === user.email) : null;

  const connectWalletMutation = useMutation({
    mutationFn: async () => {
      if (!window.ethereum) {
        throw new Error('MetaMask non installato! Scaricalo da metamask.io');
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const address = accounts[0];

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0x89') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                rpcUrls: ['https://polygon-rpc.com'],
                blockExplorerUrls: ['https://polygonscan.com']
              }]
            });
          } else {
            throw switchError;
          }
        }
      }

      if (userBalance) {
        await base44.entities.TokenBalance.update(userBalance.id, {
          wallet_address: address
        });
      } else {
        await base44.entities.TokenBalance.create({
          user_email: user.email,
          wallet_address: address,
          balance: 0,
          total_deposited: 0,
          total_won: 0,
          total_lost: 0,
          total_bets: 0
        });
      }

      return address;
    },
    onSuccess: (address) => {
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      alert(`✅ Wallet collegato: ${address.slice(0, 6)}...${address.slice(-4)}`);
    },
    onError: (error) => {
      alert(`❌ Errore: ${error.message}`);
    }
  });

  const needsWalletConnection = user && (!userBalance || !userBalance.wallet_address);
  const hasWalletConnected = user && userBalance && userBalance.wallet_address;

  return (
    <div className="min-h-screen">
      {/* HERO SECTION - Enhanced with Real-time Stats */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNmI2ZDQiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djI4SDI0VjE2aDEyem0tMTIgMjhoMTJ2MTJIMJRWNDR6bTAtMjhoMTJWNEgyNHYxMyIvPjwvZz4nKV0iIG9wYWNpdHk9IjAuMiI+PC9kaXY+
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/30 rounded-full backdrop-blur-xl">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="text-cyan-300 font-medium">
                {platformStats?.content_metrics?.total_acceleration_days || 0} Days Saved in Development
              </span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </motion.div>
          
          {/* Hero Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-6 leading-tight">
              {t.home_title || "Prompt4Future"}
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              {t.home_subtitle || "Intelligenza Collettiva"}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              {user ? (
                <>
                  {needsWalletConnection && (
                    <Button
                      onClick={() => connectWalletMutation.mutate()}
                      disabled={connectWalletMutation.isPending}
                      className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xl px-12 py-6 rounded-xl shadow-lg shadow-orange-500/30 group"
                    >
                      {connectWalletMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Collegamento...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-5 h-5 mr-2" />
                          🦊 {t.connect_metamask || "Collega MetaMask"}
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    onClick={() => base44.auth.redirectToLogin(window.location.pathname)}
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-xl px-12 py-6 rounded-xl shadow-lg shadow-cyan-500/30 group"
                  >
                    {t.home_hero_cta_primary || "Inizia Ora"}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })}
                    className="border-2 border-slate-600 hover:border-cyan-500 text-slate-200 text-xl px-12 py-6 rounded-xl backdrop-blur-xl"
                  >
                    {t.home_hero_cta_secondary || "Guarda Demo"}
                  </Button>
                </>
              )}
            </div>

            {/* Real-time Stats Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              <div className="p-4 bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <p className="text-2xl font-bold text-cyan-400">
                    {platformStats?.user_metrics?.total_users || 0}
                  </p>
                </div>
                <p className="text-xs text-slate-400 text-center">{t.home_stats_users}</p>
              </div>

              <div className="p-4 bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <p className="text-2xl font-bold text-purple-400">
                    {platformStats?.content_metrics?.total_conversations || 0}
                  </p>
                </div>
                <p className="text-xs text-slate-400 text-center">{t.home_stats_conversations}</p>
              </div>

              <div className="p-4 bg-slate-900/50 backdrop-blur-xl border border-pink-500/20 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-pink-400" />
                  <p className="text-2xl font-bold text-pink-400">
                    {platformStats?.content_metrics?.total_acceleration_days || 0}
                  </p>
                </div>
                <p className="text-xs text-slate-400 text-center">{t.home_stats_acceleration}</p>
              </div>

              <div className="p-4 bg-slate-900/50 backdrop-blur-xl border border-green-500/20 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="w-5 h-5 text-green-400" />
                  <p className="text-2xl font-bold text-green-400">
                    {platformStats?.betting_activity?.total_volume?.toFixed(0) || 0}
                  </p>
                </div>
                <p className="text-xs text-slate-400 text-center">$BOT {t.home_stats_volume}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* HOW IT WORKS Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-300 border-cyan-500/30 text-base px-4 py-2">
            {t.home_how_it_works_title || "Come Funziona"}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Simple. Powerful. Decentralized.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: t.home_how_step1, desc: "Ask our AI anything about humanoid robots", color: "cyan" },
            { icon: Rocket, title: t.home_how_step2, desc: "Best insights published to Timeline", color: "purple" },
            { icon: Trophy, title: t.home_how_step3, desc: "Predict outcomes and earn $BOT", color: "pink" }
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`bg-gradient-to-br from-${step.color}-500/10 to-slate-900/50 backdrop-blur-xl border-${step.color}-500/30 h-full hover:scale-105 transition-transform duration-300`}>
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${step.color}-500/50 mx-auto`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-200 mb-3">{step.title}</h3>
                  <p className="text-slate-400">{step.desc}</p>
                  <div className={`mt-4 text-${step.color}-400 font-bold text-5xl`}>
                    {i + 1}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Chat Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Card className="bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-xl border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/20">
          <CardContent className="p-4 md:p-8">
            <div className="h-[600px]">
              <ChatInterface language={language} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trust Indicators */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-200 mb-2">Blockchain Secured</h4>
            <p className="text-slate-400">All transactions on Polygon network</p>
          </div>
          <div className="p-6">
            <CheckCircle className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-200 mb-2">Transparent AI</h4>
            <p className="text-slate-400">Every decision is auditable</p>
          </div>
          <div className="p-6">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-200 mb-2">Community Governed</h4>
            <p className="text-slate-400">Your voice shapes the future</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Link to={createPageUrl("Betting")}>
            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-pointer h-full hover:scale-105 duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/50 mx-auto group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-200 mb-3">{t.home_features_betting}</h3>
                <p className="text-slate-400">
                  Bet on next breakthrough →
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("Wallet")}>
            <Card className="bg-slate-900/50 backdrop-blur-xl border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer h-full hover:scale-105 duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50 mx-auto group-hover:scale-110 transition-transform">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-200 mb-3">{t.home_features_wallet}</h3>
                <p className="text-slate-400">
                  Manage $BOT tokens →
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("Roadmap")}>
            <Card className="bg-slate-900/50 backdrop-blur-xl border-pink-500/20 hover:border-pink-500/50 transition-all cursor-pointer h-full hover:scale-105 duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/50 mx-auto group-hover:scale-110 transition-transform">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-200 mb-3">{t.home_features_timeline}</h3>
                <p className="text-slate-400">
                  View milestones →
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6">
            {t.home_cta_final || "Unisciti al Movimento"}
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Help us reach 2042 goal faster. Every conversation counts.
          </p>
          <Button
            onClick={() => user ? window.scrollTo({ top: 0, behavior: 'smooth' }) : base44.auth.redirectToLogin('/')}
            className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 hover:from-cyan-500 hover:via-purple-500 hover:to-pink-500 text-white text-xl px-16 py-7 rounded-xl shadow-2xl shadow-purple-500/30 group"
          >
            <Rocket className="w-6 h-6 mr-3 group-hover:translate-y-[-4px] transition-transform" />
            Start Contributing Now
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}