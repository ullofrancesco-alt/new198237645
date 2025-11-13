import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, TrendingUp, Trophy, Wallet } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UserBalance({ balance }) {
  const winRate = balance.total_bets > 0 
    ? ((balance.total_won / balance.total_bets) * 100).toFixed(1)
    : 0;

  const netProfit = balance.total_won - balance.total_lost;

  return (
    <Card className="bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-cyan-500/30 mb-8">
      <CardContent className="p-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <Coins className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Saldo</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              {balance.balance}
            </p>
            <p className="text-xs text-green-400">$BOT</p>
          </div>

          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Vinte</p>
            <p className="text-2xl font-bold text-green-400">{balance.total_won}</p>
            <p className="text-xs text-slate-500">$BOT vinti</p>
          </div>

          <div className="text-center">
            <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Win Rate</p>
            <p className="text-2xl font-bold text-purple-400">
              {winRate}%
            </p>
            <p className="text-xs text-slate-500">{balance.total_bets} scommesse</p>
          </div>

          <div className="text-center">
            <Wallet className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Profitto Netto</p>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {netProfit >= 0 ? '+' : ''}{netProfit}
            </p>
            <p className="text-xs text-slate-500">$BOT</p>
          </div>
        </div>

        {balance.balance < 100 && (
          <Alert className="mt-6 bg-amber-500/10 border-amber-500/30">
            <AlertDescription className="text-amber-400 text-sm text-center">
              💰 Saldo basso! Deposita più $BOT per continuare a scommettere.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}