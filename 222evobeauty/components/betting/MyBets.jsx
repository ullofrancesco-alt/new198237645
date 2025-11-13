import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Trophy, XCircle, Clock, ArrowUp, ArrowDown } from "lucide-react";

export default function MyBets({ bets, markets }) {
  if (!bets || bets.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/30 backdrop-blur-xl rounded-2xl border border-cyan-500/20">
        <Coins className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">
          Non hai ancora piazzato scommesse.
        </p>
        <p className="text-slate-500 text-sm mt-2">
          Visita la sezione Pool Attivi per iniziare!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bets.map((bet) => {
        const market = markets.find(m => m.id === bet.market_id);
        if (!market) return null;

        const statusColors = {
          pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          won: "bg-green-500/20 text-green-300 border-green-500/30",
          lost: "bg-red-500/20 text-red-300 border-red-500/30",
          refunded: "bg-blue-500/20 text-blue-300 border-blue-500/30"
        };

        const statusIcons = {
          pending: <Clock className="w-4 h-4" />,
          won: <Trophy className="w-4 h-4" />,
          lost: <XCircle className="w-4 h-4" />,
          refunded: <Coins className="w-4 h-4" />
        };

        return (
          <Card key={bet.id} className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-slate-200 mb-2">
                    {market.title}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={statusColors[bet.status]}>
                      {statusIcons[bet.status]}
                      <span className="ml-1">{bet.status}</span>
                    </Badge>
                    
                    <Badge variant="outline" className={
                      bet.option === 'A' 
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                        : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                    }>
                      Opzione {bet.option}
                    </Badge>

                    <Badge variant="outline" className={
                      bet.bet_type === 'back'
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : "bg-pink-500/20 text-pink-300 border-pink-500/30"
                    }>
                      {bet.bet_type === 'back' ? (
                        <>
                          <ArrowUp className="w-3 h-3 mr-1" />
                          BACK
                        </>
                      ) : (
                        <>
                          <ArrowDown className="w-3 h-3 mr-1" />
                          LAY
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400 mb-1">Puntata</p>
                  <p className="text-2xl font-bold text-cyan-300">
                    {bet.amount}
                  </p>
                  <p className="text-xs text-green-400">$BOT</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 text-xs mb-1">Quote</p>
                  <p className="text-slate-300 font-bold">{bet.odds}x</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Vincita Potenziale</p>
                  <p className="text-purple-300 font-bold">{bet.potential_return?.toFixed(2) || 0}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Payout</p>
                  <p className={`font-bold ${bet.status === 'won' ? 'text-green-400' : 'text-slate-500'}`}>
                    {bet.payout?.toFixed(2) || 0}
                  </p>
                </div>
              </div>

              {bet.status === 'won' && (
                <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                  <p className="text-green-300 text-sm text-center">
                    🎉 Hai vinto {bet.payout?.toFixed(2) || 0} $BOT!
                  </p>
                </div>
              )}

              {bet.status === 'lost' && (
                <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                  <p className="text-red-300 text-sm text-center">
                    Scommessa persa
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}