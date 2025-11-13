import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, ExternalLink, CheckCircle, XCircle, Clock, TrendingUp, Users, Coins, Zap, Bot, DollarSign } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ADMIN_EMAIL = "francescoullo1@gmail.com";
const ROBOT_CONTRACT = "0xb0d2A7b1F1EC7D39409E1D671473020d20547B55";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [manualWallet, setManualWallet] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
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

  const { data: requests } = useQuery({
    queryKey: ['depositRequests'],
    queryFn: () => base44.entities.DepositRequest.list("-created_date"),
    initialData: [],
  });

  const { data: balances } = useQuery({
    queryKey: ['balances'],
    queryFn: () => base44.entities.TokenBalance.list(),
    initialData: [],
  });

  const { data: markets } = useQuery({
    queryKey: ['markets'],
    queryFn: () => base44.entities.BettingMarket.list("-created_date"),
    initialData: [],
  });

  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list("-created_date", 100),
    initialData: [],
  });

  const { data: highlights } = useQuery({
    queryKey: ['highlights'],
    queryFn: () => base44.entities.DailyHighlight.list("-date"),
    initialData: [],
  });

  const { data: platformStats } = useQuery({
    queryKey: ['platformStats'],
    queryFn: async () => {
      const stats = await base44.entities.PlatformStats.list();
      return stats.length > 0 ? stats[0] : {
        total_commission_earned: 0,
        total_bets_placed: 0,
        total_volume: 0
      };
    },
    initialData: {
      total_commission_earned: 0,
      total_bets_placed: 0,
      total_volume: 0
    }
  });

  const createDailyPoolMutation = useMutation({
    mutationFn: async () => {
      const now = new Date();
      const closesAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      await base44.entities.BettingMarket.create({
        title: "Chi sarà il protagonista del prossimo prompt?",
        description: "Scommetti se il prossimo prompt pubblicato riguarderà un grande player (Tesla, Unitree) o uno sviluppatore medio-piccolo della community",
        option_a: "Grande Player (Tesla, Unitree, Meta, ecc.)",
        option_b: "Sviluppatore Medio-Piccolo / Community",
        status: "active",
        opens_at: now.toISOString(),
        closes_at: closesAt.toISOString(),
        total_pool_a: 0,
        total_pool_b: 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      alert("✅ Pool giornaliero creato! Chiude automaticamente tra 24h.");
    }
  });

  const resolveAndPublishMutation = useMutation({
    mutationFn: async () => {
      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentConvos = conversations.filter(c => {
        const convoDate = new Date(c.created_date);
        return convoDate > last24h && (c.relevance_score >= 70 || c.practical_value >= 70);
      });

      if (recentConvos.length === 0) {
        throw new Error("Nessuna conversazione di qualità nelle ultime 24h");
      }

      // 🎲 RANDOM 50/50: Grande Player o Sviluppatore Piccolo
      const randomWinner = Math.random() < 0.5 ? "A" : "B";
      
      // Filtra conversazioni per categoria vincente
      const categoryFilter = randomWinner === "A" 
        ? ['tesla_optimus', 'unitree_robots', 'meta_ai', 'industry_news', 'breakthrough_tech']
        : ['diy_beginner', 'component_suppliers', 'cost_breakdown', 'diy_assembly', 'budget_builds', 'raspberry_pi_projects', '3d_printing'];
      
      const filteredConvos = recentConvos.filter(c => categoryFilter.includes(c.category));
      const conversationsToAnalyze = filteredConvos.length > 0 ? filteredConvos : recentConvos;

      const analysisPrompt = `Analizza queste conversazioni e seleziona la MIGLIORE per impact e utilità pratica.
      
Conversazioni:
${conversationsToAnalyze.map((c, i) => `
${i + 1}. [Score: ${c.relevance_score}, Practical: ${c.practical_value}]
User: ${c.user_message}
AI: ${c.ai_response?.substring(0, 500)}...
Category: ${c.category}
`).join('\n---\n')}

Seleziona la conversazione con MASSIMO impact score e practical value.

Rispondi JSON con:
- best_index: numero (0-based index della conversazione migliore)
- title: titolo accattivante per il prompt (max 100 char)
- summary: riassunto valore (max 200 char)`;

      const aiDecision = await base44.integrations.Core.InvokeLLM({
        prompt: analysisPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            best_index: { type: "number" },
            title: { type: "string" },
            summary: { type: "string" }
          }
        }
      });

      const bestConvo = conversationsToAnalyze[aiDecision.best_index];
      
      const today = new Date().toISOString().split('T')[0];
      const newHighlight = await base44.entities.DailyHighlight.create({
        date: today,
        conversation_id: bestConvo.id,
        category: bestConvo.category,
        difficulty_level: bestConvo.difficulty_level || "intermediate",
        title: aiDecision.title,
        summary: aiDecision.summary,
        impact_score: Math.max(bestConvo.relevance_score, bestConvo.practical_value),
        user_message: bestConvo.user_message,
        ai_response: bestConvo.ai_response,
        language: bestConvo.language || "it",
        acceleration_days: 1,
        practical_value: bestConvo.practical_value || 0,
        actionable_steps: bestConvo.key_insights || []
      });

      const activePool = markets.find(m => m.status === 'active' && m.title.includes("protagonista del prossimo prompt"));
      
      if (!activePool) {
        return { highlight: newHighlight, message: "Prompt pubblicato, ma nessun pool attivo da risolvere" };
      }

      const { data: bets } = await base44.entities.UserBet.filter({ market_id: activePool.id });
      const winningBets = bets.filter(b => b.option === randomWinner);

      const totalPool = activePool.total_pool_a + activePool.total_pool_b;
      const winningPool = randomWinner === 'A' ? activePool.total_pool_a : activePool.total_pool_b;
      const losingPool = randomWinner === 'A' ? activePool.total_pool_b : activePool.total_pool_a;

      for (const bet of winningBets) {
        const winShare = (bet.amount / winningPool) * losingPool;
        const totalPayout = bet.amount + winShare;

        await base44.entities.UserBet.update(bet.id, {
          status: "won",
          payout: totalPayout
        });

        const userBalance = balances.find(b => b.user_email === bet.user_email);
        if (userBalance) {
          await base44.entities.TokenBalance.update(userBalance.id, {
            balance: userBalance.balance + totalPayout,
            total_won: userBalance.total_won + winShare
          });
        }
      }

      const losingBets = bets.filter(b => b.option !== randomWinner);
      for (const bet of losingBets) {
        await base44.entities.UserBet.update(bet.id, {
          status: "lost"
        });

        const userBalance = balances.find(b => b.user_email === bet.user_email);
        if (userBalance) {
          await base44.entities.TokenBalance.update(userBalance.id, {
            total_lost: userBalance.total_lost + bet.amount
          });
        }
      }

      await base44.entities.BettingMarket.update(activePool.id, {
        status: "resolved",
        winning_option: randomWinner,
        resolved_at: new Date().toISOString(),
        linked_highlight_id: newHighlight.id
      });

      return {
        highlight: newHighlight,
        pool: activePool,
        winner: randomWinner,
        reasoning: `🎲 Random 50/50: ${randomWinner === 'A' ? 'Grande Player' : 'Sviluppatore Piccolo'} ha vinto!`,
        winners: winningBets.length,
        totalPaid: winningBets.reduce((sum, b) => sum + (b.amount / winningPool) * losingPool, 0)
      };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      queryClient.invalidateQueries({ queryKey: ['userBets'] });
      
      alert(`✅ SUCCESSO!
      
Prompt Pubblicato: ${result.highlight?.title}
Pool Risolto: Opzione ${result.winner} ha vinto! (Random 50/50)
Vincitori Pagati: ${result.winners}
Totale Distribuito: ${result.totalPaid?.toFixed(2)} $BOT

${result.reasoning}`);
    },
    onError: (error) => {
      alert(`❌ Errore: ${error.message}`);
    }
  });

  const approveRequestMutation = useMutation({
    mutationFn: async (request) => {
      const userBalance = balances.find(b => b.user_email === request.user_email);

      if (request.request_type === 'deposit') {
        if (userBalance) {
          await base44.entities.TokenBalance.update(userBalance.id, {
            balance: userBalance.balance + request.amount,
            total_deposited: userBalance.total_deposited + request.amount
          });
        } else {
          await base44.entities.TokenBalance.create({
            user_email: request.user_email,
            balance: request.amount,
            total_deposited: request.amount,
            total_won: 0,
            total_lost: 0,
            total_bets: 0
          });
        }
      } else if (request.request_type === 'withdrawal' && userBalance) {
        await base44.entities.TokenBalance.update(userBalance.id, {
          balance: Math.max(0, userBalance.balance - request.amount)
        });
      }

      await base44.entities.DepositRequest.update(request.id, {
        status: "approved"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depositRequests'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      setSelectedRequest(null);
    }
  });

  const approveSwapRequestMutation = useMutation({
    mutationFn: async (request) => {
      const userBalance = balances.find(b => b.user_email === request.user_email);
      const botAmount = parseFloat(request.bot_amount || request.amount);

      if (userBalance) {
        await base44.entities.TokenBalance.update(userBalance.id, {
          balance: userBalance.balance + botAmount,
          total_deposited: userBalance.total_deposited + botAmount
        });
      } else {
        await base44.entities.TokenBalance.create({
          user_email: request.user_email,
          balance: botAmount,
          total_deposited: botAmount,
          total_won: 0,
          total_lost: 0,
          total_bets: 0
        });
      }

      await base44.entities.DepositRequest.update(request.id, {
        status: "approved",
        processed: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depositRequests'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      setSelectedRequest(null);
    }
  });

  const rejectRequestMutation = useMutation({
    mutationFn: async (request) => {
      await base44.entities.DepositRequest.update(request.id, {
        status: "rejected"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depositRequests'] });
      setSelectedRequest(null);
    }
  });

  const manualDepositMutation = useMutation({
    mutationFn: async () => {
      const userBalance = balances.find(b => b.user_email === manualEmail);
      const amount = parseFloat(manualAmount);

      if (userBalance) {
        await base44.entities.TokenBalance.update(userBalance.id, {
          balance: userBalance.balance + amount,
          total_deposited: userBalance.total_deposited + amount
        });
      } else {
        await base44.entities.TokenBalance.create({
          user_email: manualEmail,
          balance: amount,
          total_deposited: amount,
          total_won: 0,
          total_lost: 0,
          total_bets: 0
        });
      }

      await base44.entities.DepositRequest.create({
        user_email: manualEmail,
        wallet_address: manualWallet,
        amount: amount,
        status: "approved",
        request_type: "deposit",
        admin_notes: "Deposito manuale approvato da admin"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depositRequests'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      setManualWallet("");
      setManualAmount("");
      setManualEmail("");
    }
  });

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Alert className="max-w-md bg-red-500/10 border-red-500/30">
          <Shield className="w-5 h-5 text-red-400" />
          <AlertDescription className="text-red-400 text-center">
            ⛔ Accesso Negato - Solo per amministratori
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const swapRequests = pendingRequests.filter(r => r.request_type === 'swap');
  const depositRequests = pendingRequests.filter(r => r.request_type === 'deposit');
  const withdrawalRequests = pendingRequests.filter(r => r.request_type === 'withdrawal');

  const totalUsers = balances.length;
  const totalDeposited = balances.reduce((sum, b) => sum + b.total_deposited, 0);
  const activeMarkets = markets.filter(m => m.status === 'active').length;
  const recentConvos = conversations.filter(c => {
    const convoDate = new Date(c.created_date);
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return convoDate > last24h && (c.relevance_score >= 70 || c.practical_value >= 70);
  }).length;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">
                Admin Panel
              </h1>
              <p className="text-slate-400">Gestione depositi, prelievi e sistema automatico</p>
            </div>
          </div>
        </div>

        {/* Platform Revenue Card */}
        <Card className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 backdrop-blur-xl border-green-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Coins className="w-6 h-6 text-green-400" />
              💰 Commissioni Piattaforma (5% per bet)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/30 border-green-500/30">
                <CardContent className="p-6 text-center">
                  <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Commissioni Totali</p>
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">
                    {platformStats.total_commission_earned.toFixed(2)}
                  </p>
                  <p className="text-xs text-green-400">$BOT Accumulati</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Volume Totale</p>
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                    {platformStats.total_volume.toFixed(0)}
                  </p>
                  <p className="text-xs text-purple-400">$BOT Scommessi</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/30 border-cyan-500/30">
                <CardContent className="p-6 text-center">
                  <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Scommesse Piazzate</p>
                  <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
                    {platformStats.total_bets_placed}
                  </p>
                  <p className="text-xs text-cyan-400">Bet Totali</p>
                </CardContent>
              </Card>
            </div>

            <Alert className="mt-6 bg-green-500/10 border-green-500/30">
              <AlertDescription className="text-green-300">
                <strong>💡 Sistema Fee 5%:</strong><br/>
                • Ogni scommessa paga 5% di commissione alla piattaforma<br/>
                • Importo netto (95%) va nel pool per le vincite<br/>
                • Commissioni accumulate automaticamente ad ogni bet
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {swapRequests.length > 0 && (
          <Card className="bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-cyan-500/10 backdrop-blur-xl border-2 border-green-500/50 mb-8 shadow-2xl shadow-green-500/20">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-400" />
                💰 Richieste Swap USDC → $BOT ({swapRequests.length} pending)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="bg-cyan-500/10 border-cyan-500/30 mb-6">
                <AlertDescription className="text-cyan-300">
                  <strong>🤖 Mini-Exchange:</strong> Utenti hanno inviato USDC al vault. Verifica su PolygonScan e approva per accreditare $BOT!
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {swapRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-6 bg-slate-800/30 rounded-xl border-2 border-green-500/30 hover:border-green-500/60 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30 text-base">
                            💱 SWAP USDC → $BOT
                          </Badge>
                          <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-slate-200 font-medium">
                            👤 {request.user_email}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                              <p className="text-xs text-slate-400 mb-1">Inviato USDC:</p>
                              <p className="text-2xl font-bold text-blue-300">{request.amount}</p>
                            </div>
                            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                              <p className="text-xs text-slate-400 mb-1">Da Accreditare $BOT:</p>
                              <p className="text-2xl font-bold text-purple-300">{request.bot_amount || 0}</p>
                            </div>
                          </div>

                          <div className="p-2 bg-slate-700/30 rounded text-xs">
                            <p className="text-slate-400">
                              Tasso: 1 USDC = {((request.bot_amount || 0) / (request.amount || 1)).toFixed(0)} $BOT
                            </p>
                          </div>
                        </div>

                        {request.wallet_address && (
                          <div className="mb-3">
                            <p className="text-xs text-slate-500 mb-1">Wallet:</p>
                            <code className="text-xs text-slate-300 font-mono">{request.wallet_address}</code>
                          </div>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`https://polygonscan.com/address/${request.wallet_address}`, '_blank')}
                          className="text-cyan-400 hover:text-cyan-300 text-xs"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Verifica USDC su PolygonScan
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approva Swap
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-900 border-green-500/30">
                            <DialogHeader>
                              <DialogTitle className="text-slate-200">Conferma Swap USDC → $BOT</DialogTitle>
                              <DialogDescription className="text-slate-400">
                                Stai per accreditare {request.bot_amount} $BOT a {request.user_email}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 pt-4">
                              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                                <p className="text-sm text-blue-300">
                                  <strong>Utente ha inviato:</strong><br/>
                                  {request.amount} USDC
                                </p>
                              </div>

                              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                                <p className="text-sm text-purple-300">
                                  <strong>Tu accrediterai:</strong><br/>
                                  {request.bot_amount} $BOT
                                </p>
                              </div>

                              <Alert className="bg-yellow-500/10 border-yellow-500/30">
                                <AlertDescription className="text-yellow-400 text-sm">
                                  ⚠️ Hai verificato su PolygonScan che {request.amount} USDC sono arrivati al vault?
                                </AlertDescription>
                              </Alert>

                              <div className="flex gap-3">
                                <Button
                                  onClick={() => approveSwapRequestMutation.mutate(request)}
                                  disabled={approveSwapRequestMutation.isPending}
                                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                                >
                                  ✅ Conferma Swap
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectRequestMutation.mutate(request)}
                          disabled={rejectRequestMutation.isPending}
                          className="border-red-500/30 hover:bg-red-500/10 text-red-400"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rifiuta
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Automation Section */}
        <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 backdrop-blur-xl border-purple-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Bot className="w-6 h-6 text-purple-400" />
              🤖 Sistema Automatico AI (Random 50/50)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert className="bg-cyan-500/10 border-cyan-500/30">
                <AlertDescription className="text-cyan-300">
                  💡 <strong>Come Funziona:</strong><br/>
                  1. Crea pool "Grande Player vs Sviluppatore Piccolo" (chiude in 24h)<br/>
                  2. AI analizza conversazioni ultime 24h<br/>
                  3. 🎲 <strong>Random 50/50:</strong> Decide casualmente chi vince (Grande Player o Sviluppatore)<br/>
                  4. Pubblica il prompt migliore della categoria vincente<br/>
                  5. Paga automaticamente i vincitori
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-slate-800/30 border-green-500/30">
                  <CardContent className="p-4">
                    <p className="text-xs text-slate-400 mb-2">📊 Conversazioni Qualità (24h)</p>
                    <p className="text-3xl font-bold text-green-400">{recentConvos}</p>
                    <p className="text-xs text-slate-500">Impact/Practical ≥ 70</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/30 border-purple-500/30">
                  <CardContent className="p-4">
                    <p className="text-xs text-slate-400 mb-2">🎯 Pool Attivi</p>
                    <p className="text-3xl font-bold text-purple-400">{activeMarkets}</p>
                    <p className="text-xs text-slate-500">In attesa di risoluzione</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={() => createDailyPoolMutation.mutate()}
                  disabled={createDailyPoolMutation.isPending}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-6"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  1️⃣ Crea Pool Giornaliero (24h)
                </Button>

                <Button
                  onClick={() => resolveAndPublishMutation.mutate()}
                  disabled={resolveAndPublishMutation.isPending || recentConvos === 0}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-6"
                >
                  <Bot className="w-5 h-5 mr-2" />
                  2️⃣ 🎲 AI Random + Pubblica
                </Button>
              </div>

              <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <p className="text-amber-300 text-sm">
                  <strong className="text-amber-400">🎲 Sistema Random 50/50:</strong><br/>
                  • 50% probabilità Grande Player (Tesla, Unitree, Meta)<br/>
                  • 50% probabilità Sviluppatore Piccolo (DIY, Community)<br/>
                  • AI seleziona prompt migliore della categoria vincente<br/>
                  • Sistema completamente casuale e imprevedibile!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-amber-400" />
                <div>
                  <p className="text-xs text-slate-400">Richieste Pending</p>
                  <p className="text-2xl font-bold text-amber-400">{pendingRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-xs text-slate-400">Utenti Totali</p>
                  <p className="text-2xl font-bold text-purple-400">{totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Coins className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-xs text-slate-400">Tot. Depositato</p>
                  <p className="text-2xl font-bold text-green-400">{totalDeposited}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-xl border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Pool Attivi</p>
                  <p className="text-2xl font-bold text-blue-400">{activeMarkets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900/50 backdrop-blur-xl border-green-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Coins className="w-6 h-6 text-green-400" />
              Deposito Manuale Veloce
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Input
                placeholder="Email utente"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                className="bg-slate-800/50 border-green-500/30 text-slate-200"
              />
              <Input
                placeholder="Wallet address"
                value={manualWallet}
                onChange={(e) => setManualWallet(e.target.value)}
                className="bg-slate-800/50 border-green-500/30 text-slate-200"
              />
              <Input
                type="number"
                placeholder="Importo $BOT"
                value={manualAmount}
                onChange={(e) => setManualAmount(e.target.value)}
                className="bg-slate-800/50 border-green-500/30 text-slate-200"
              />
              <Button
                onClick={() => manualDepositMutation.mutate()}
                disabled={!manualEmail || !manualAmount || manualDepositMutation.isPending}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
              >
                ✅ Approva Deposito
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              💡 Verifica sempre su PolygonScan prima di approvare!
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-slate-200">
              Richieste Depositi/Prelievi ({(depositRequests.length + withdrawalRequests.length)} pending)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(depositRequests.length + withdrawalRequests.length) === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-slate-400">Nessuna richiesta in attesa!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {[...depositRequests, ...withdrawalRequests].map((request) => (
                  <div
                    key={request.id}
                    className="p-4 bg-slate-800/30 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={
                            request.request_type === 'deposit'
                              ? 'bg-green-500/20 text-green-300 border-green-500/30'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }>
                            {request.request_type === 'deposit' ? '⬇️ Deposito' : '⬆️ Prelievo'}
                          </Badge>
                          <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                        
                        <p className="text-slate-200 font-medium mb-1">
                          {request.user_email}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>Importo: <strong className="text-cyan-400">{request.amount} $BOT</strong></span>
                          {request.wallet_address && (
                            <span className="text-xs font-mono">{request.wallet_address.slice(0, 10)}...</span>
                          )}
                        </div>

                        {request.wallet_address && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`https://polygonscan.com/address/${request.wallet_address}`, '_blank')}
                            className="mt-2 text-cyan-400 hover:text-cyan-300 text-xs"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Verifica su PolygonScan
                          </Button>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approva
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-900 border-green-500/30">
                            <DialogHeader>
                              <DialogTitle className="text-slate-200">Conferma Approvazione</DialogTitle>
                              <DialogDescription className="text-slate-400">
                                Stai per approvare un {request.request_type === 'deposit' ? 'deposito' : 'prelievo'} di {request.amount} $BOT per {request.user_email}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 pt-4">
                              {request.wallet_address && (
                                <div className="p-3 bg-slate-800/50 rounded-lg">
                                  <p className="text-xs text-slate-400 mb-1">Wallet Address:</p>
                                  <p className="text-xs text-slate-200 font-mono break-all">{request.wallet_address}</p>
                                </div>
                              )}

                              <Alert className="bg-yellow-500/10 border-yellow-500/30">
                                <AlertDescription className="text-yellow-400 text-sm">
                                  ⚠️ Hai verificato su PolygonScan che l'utente possiede {request.amount} $BOT?
                                </AlertDescription>
                              </Alert>

                              <div className="flex gap-3">
                                <Button
                                  onClick={() => approveRequestMutation.mutate(request)}
                                  disabled={approveRequestMutation.isPending}
                                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                                >
                                  ✅ Conferma Approvazione
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectRequestMutation.mutate(request)}
                          disabled={rejectRequestMutation.isPending}
                          className="border-red-500/30 hover:bg-red-500/10 text-red-400"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rifiuta
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20 mt-8">
          <CardHeader>
            <CardTitle className="text-slate-200">Storico Approvazioni</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {requests
                .filter(r => r.status !== 'pending')
                .slice(0, 20)
                .map((request) => (
                  <div
                    key={request.id}
                    className="p-3 bg-slate-800/20 rounded-lg border border-slate-700/30 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={
                          request.status === 'approved'
                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                            : 'bg-red-500/20 text-red-300 border-red-500/30'
                        }>
                          {request.status === 'approved' ? '✅ Approvato' : '❌ Rifiutato'}
                        </Badge>
                        <span className="text-slate-300">{request.user_email}</span>
                      </div>
                      <span className="text-cyan-400 font-bold">{request.amount} $BOT</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}