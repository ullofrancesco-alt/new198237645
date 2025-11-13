import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Coins, Trophy, ArrowUp, ArrowDown } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

const FIXED_ODDS = 1.99;
const PLATFORM_FEE = 0.05; // 5% commission

export default function BettingMarketCard({ market, user, userBalance, readonly = false }) {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedOption, setSelectedOption] = useState(null);
  const [betType, setBetType] = useState(null);
  const queryClient = useQueryClient();

  const totalBackA = market.total_back_a || 0;
  const totalLayA = market.total_lay_a || 0;
  const totalBackB = market.total_back_b || 0;
  const totalLayB = market.total_lay_b || 0;

  const timeLeft = new Date(market.closes_at) - new Date();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));
  const isExpired = timeLeft <= 0;

  // Calcola commissione e importo netto
  const platformFee = betAmount * PLATFORM_FEE;
  const netAmount = betAmount - platformFee;
  const potentialWin = betType === 'back' ? netAmount * FIXED_ODDS : netAmount * (FIXED_ODDS - 1);

  const placeBetMutation = useMutation({
    mutationFn: async ({ option, amount, type }) => {
      if (!user || !userBalance) throw new Error("User not logged in");
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) throw new Error("Amount must be a positive number");
      if (userBalance.balance < parsedAmount) throw new Error("Insufficient balance");
      if (!option || !type) throw new Error("Please select option and bet type");

      // Calcola commissione (5%)
      const commission = parsedAmount * PLATFORM_FEE;
      const netBetAmount = parsedAmount - commission;
      const potentialReturn = type === 'back' ? netBetAmount * FIXED_ODDS : netBetAmount * (FIXED_ODDS - 1);

      // Crea la scommessa
      await base44.entities.UserBet.create({
        market_id: market.id,
        user_email: user.email,
        option: option,
        bet_type: type,
        amount: netBetAmount, // Importo netto dopo commissione
        odds: FIXED_ODDS,
        potential_return: potentialReturn,
        status: "pending"
      });

      // Aggiorna saldo utente (detrai importo TOTALE comprensivo di fee)
      await base44.entities.TokenBalance.update(userBalance.id, {
        balance: userBalance.balance - parsedAmount,
        total_bets: userBalance.total_bets + 1
      });

      // Aggiorna totali del market (solo importo netto va nel pool)
      const updateData = {};
      if (option === 'A') {
        if (type === 'back') {
          updateData.total_back_a = totalBackA + netBetAmount;
        } else {
          updateData.total_lay_a = totalLayA + netBetAmount;
        }
      } else {
        if (type === 'back') {
          updateData.total_back_b = totalBackB + netBetAmount;
        } else {
          updateData.total_lay_b = totalLayB + netBetAmount;
        }
      }
      await base44.entities.BettingMarket.update(market.id, updateData);

      // Aggiorna stats piattaforma
      const stats = await base44.entities.PlatformStats.list();
      if (stats.length > 0) {
        const currentStats = stats[0];
        await base44.entities.PlatformStats.update(currentStats.id, {
          total_commission_earned: currentStats.total_commission_earned + commission,
          total_bets_placed: currentStats.total_bets_placed + 1,
          total_volume: currentStats.total_volume + parsedAmount,
          last_updated: new Date().toISOString()
        });
      } else {
        await base44.entities.PlatformStats.create({
          total_commission_earned: commission,
          total_bets_placed: 1,
          total_volume: parsedAmount,
          last_updated: new Date().toISOString()
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      queryClient.invalidateQueries({ queryKey: ['userBets'] });
      queryClient.invalidateQueries({ queryKey: ['platformStats'] });
      setSelectedOption(null);
      setBetType(null);
      setBetAmount(100);
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  const handleBet = () => {
    if (!user) {
      alert("Devi effettuare il login per scommettere!");
      return;
    }
    if (readonly) return;
    
    placeBetMutation.mutate({ option: selectedOption, amount: betAmount, type: betType });
  };

  const selectBet = (option, type) => {
    setSelectedOption(option);
    setBetType(type);
  };

  return (
    <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20 hover:border-cyan-500/40 transition-all">
      <CardContent className="p-8">
        <CardHeader className="p-0 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-200 mb-2">{market.title}</h3>
              <p className="text-slate-400 text-sm">{market.description}</p>
              
              {/* DYNAMIC PROMPT INFO */}
              {market.linked_highlight_id && market.status === 'resolved' && (
                <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <p className="text-blue-300 text-sm">
                    🎯 <strong>Prompt Vincente Pubblicato!</strong><br/>
                    Questo pool è stato risolto in base al prompt migliore delle ultime 24h.
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className={`${
                market.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                market.status === 'resolved' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                'bg-slate-700/50 text-slate-300'
              }`}>
                {market.status}
              </Badge>
              {market.status === 'active' && !isExpired && (
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{hoursLeft}h {minutesLeft}m</span>
                </div>
              )}
              {isExpired && market.status === 'active' && (
                <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30">
                  Scaduto - In attesa AI
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* OPTION A */}
          <div className={`p-6 rounded-xl border-2 transition-all ${
            selectedOption === 'A' && betType
              ? 'border-cyan-500 bg-cyan-500/10' 
              : 'border-cyan-500/30 bg-slate-800/30'
          } ${market.winning_option === 'A' ? 'ring-2 ring-green-500' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-200">🏭 Opzione A</h4>
              <Badge className="bg-cyan-500/20 text-cyan-300 text-lg font-bold">
                {FIXED_ODDS}x
              </Badge>
            </div>
            <p className="text-slate-400 text-sm mb-4">{market.option_a}</p>
            
            <div className="space-y-3">
              {/* BACK A */}
              <motion.button
                whileHover={{ scale: readonly || isExpired || market.status !== 'active' ? 1 : 1.05 }}
                whileTap={{ scale: readonly || isExpired || market.status !== 'active' ? 1 : 0.95 }}
                onClick={() => !readonly && !isExpired && market.status === 'active' && selectBet('A', 'back')}
                disabled={readonly || isExpired || market.status !== 'active'}
                className={`w-full p-3 rounded-lg transition-all ${
                  selectedOption === 'A' && betType === 'back'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                    : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ArrowUp className="w-4 h-4" />
                    <strong>BACK</strong>
                  </span>
                  <span className="text-xs">{totalBackA.toFixed(0)} $BOT</span>
                </div>
              </motion.button>

              {/* LAY A */}
              <motion.button
                whileHover={{ scale: readonly || isExpired || market.status !== 'active' ? 1 : 1.05 }}
                whileTap={{ scale: readonly || isExpired || market.status !== 'active' ? 1 : 0.95 }}
                onClick={() => !readonly && !isExpired && market.status === 'active' && selectBet('A', 'lay')}
                disabled={readonly || isExpired || market.status !== 'active'}
                className={`w-full p-3 rounded-lg transition-all ${
                  selectedOption === 'A' && betType === 'lay'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg'
                    : 'bg-pink-500/10 border border-pink-500/30 text-pink-300 hover:bg-pink-500/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ArrowDown className="w-4 h-4" />
                    <strong>LAY</strong>
                  </span>
                  <span className="text-xs">{totalLayA.toFixed(0)} $BOT</span>
                </div>
              </motion.button>
            </div>

            {market.winning_option === 'A' && (
              <Badge className="w-full justify-center bg-green-500/20 text-green-300 border-green-500/30 mt-3">
                <Trophy className="w-4 h-4 mr-2" />
                VINCENTE! 🎉
              </Badge>
            )}
          </div>

          {/* OPTION B */}
          <div className={`p-6 rounded-xl border-2 transition-all ${
            selectedOption === 'B' && betType
              ? 'border-purple-500 bg-purple-500/10' 
              : 'border-purple-500/30 bg-slate-800/30'
          } ${market.winning_option === 'B' ? 'ring-2 ring-green-500' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-200">🔧 Opzione B</h4>
              <Badge className="bg-purple-500/20 text-purple-300 text-lg font-bold">
                {FIXED_ODDS}x
              </Badge>
            </div>
            <p className="text-slate-400 text-sm mb-4">{market.option_b}</p>
            
            <div className="space-y-3">
              {/* BACK B */}
              <motion.button
                whileHover={{ scale: readonly || isExpired || market.status !== 'active' ? 1 : 1.05 }}
                whileTap={{ scale: readonly || isExpired || market.status !== 'active' ? 1 : 0.95 }}
                onClick={() => !readonly && !isExpired && market.status === 'active' && selectBet('B', 'back')}
                disabled={readonly || isExpired || market.status !== 'active'}
                className={`w-full p-3 rounded-lg transition-all ${
                  selectedOption === 'B' && betType === 'back'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ArrowUp className="w-4 h-4" />
                    <strong>BACK</strong>
                  </span>
                  <span className="text-xs">{totalBackB.toFixed(0)} $BOT</span>
                </div>
              </motion.button>

              {/* LAY B */}
              <motion.button
                whileHover={{ scale: readonly || isExpired || market.status !== 'active' ? 1 : 1.05 }}
                whileTap={{ scale: readonly || isExpired || market.status !== 'active' ? 1 : 0.95 }}
                onClick={() => !readonly && !isExpired && market.status === 'active' && selectBet('B', 'lay')}
                disabled={readonly || isExpired || market.status !== 'active'}
                className={`w-full p-3 rounded-lg transition-all ${
                  selectedOption === 'B' && betType === 'lay'
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ArrowDown className="w-4 h-4" />
                    <strong>LAY</strong>
                  </span>
                  <span className="text-xs">{totalLayB.toFixed(0)} $BOT</span>
                </div>
              </motion.button>
            </div>

            {market.winning_option === 'B' && (
              <Badge className="w-full justify-center bg-green-500/20 text-green-300 border-green-500/30 mt-3">
                <Trophy className="w-4 h-4 mr-2" />
                VINCENTE! 🎉
              </Badge>
            )}
          </div>
        </div>

        {!readonly && !isExpired && market.status === 'active' && user && selectedOption && betType && (
          <div className="mt-6 p-6 bg-slate-800/30 rounded-xl border border-cyan-500/20">
            <h4 className="text-slate-200 font-bold mb-4">
              💰 Conferma {betType === 'back' ? 'BACK' : 'LAY'} su Opzione {selectedOption}
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Input
                type="number"
                placeholder="Importo $BOT"
                min="1"
                max={userBalance?.balance || 0}
                value={betAmount}
                onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                className="bg-slate-800/50 border-cyan-500/30 text-slate-200"
              />

              <Button
                onClick={handleBet}
                disabled={!betAmount || parseFloat(betAmount) < 1 || placeBetMutation.isPending}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
              >
                <Coins className="w-4 h-4 mr-2" />
                Piazza Scommessa
              </Button>
            </div>

            <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Tipo:</p>
                  <p className="text-cyan-300 font-bold">
                    {betType === 'back' ? '📈 BACK (A Favore)' : '📉 LAY (Contro)'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Quote:</p>
                  <p className="text-purple-300 font-bold">{FIXED_ODDS}x</p>
                </div>
                <div>
                  <p className="text-slate-400">Puntata:</p>
                  <p className="text-green-300 font-bold">{betAmount} $BOT</p>
                </div>
                <div>
                  <p className="text-slate-400">Fee Piattaforma (5%):</p>
                  <p className="text-amber-400 font-bold">-{platformFee.toFixed(2)} $BOT</p>
                </div>
                <div>
                  <p className="text-slate-400">Importo Netto:</p>
                  <p className="text-blue-300 font-bold">{netAmount.toFixed(2)} $BOT</p>
                </div>
                <div>
                  <p className="text-slate-400">Vincita Pot.:</p>
                  <p className="text-pink-300 font-bold">{potentialWin.toFixed(2)} $BOT</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              Saldo disponibile: <span className="text-cyan-400">{userBalance?.balance || 0} $BOT</span>
            </p>
          </div>
        )}

        <div className="mt-4 p-3 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-lg border border-cyan-500/10">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Total BACK:</span>
              <span className="text-cyan-300 font-bold ml-2">
                {(totalBackA + totalBackB).toFixed(0)} $BOT
              </span>
            </div>
            <div>
              <span className="text-slate-400">Total LAY:</span>
              <span className="text-pink-300 font-bold ml-2">
                {(totalLayA + totalLayB).toFixed(0)} $BOT
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}