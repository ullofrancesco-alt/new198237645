import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Shield, Play, Pause, CheckCircle, AlertTriangle, Clock, Zap, Settings, RefreshCw, Activity } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ADMIN_EMAIL = "francescoullo1@gmail.com";
const AUTO_APPROVE_INTERVAL = 5 * 60 * 1000; // 5 minuti
const VAULT_ADDRESS = "0x78cFdE6e71Cf5cED4afFce5578D2223b51907a49";

export default function AutoApprove() {
  const [user, setUser] = useState(null);
  const [isAutoApproveEnabled, setIsAutoApproveEnabled] = useState(false);
  const [maxAutoApproveDeposit, setMaxAutoApproveDeposit] = useState(100); // USDC
  const [maxAutoApproveWithdraw, setMaxAutoApproveWithdraw] = useState(1000); // $BOT
  const [lastRunTime, setLastRunTime] = useState(null);
  const [nextRunTime, setNextRunTime] = useState(null);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalApproved: 0,
    totalRejected: 0,
    totalErrors: 0,
    lastError: null
  });
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

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('autoApproveSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setIsAutoApproveEnabled(settings.enabled || false);
      setMaxAutoApproveDeposit(settings.maxDeposit || 100);
      setMaxAutoApproveWithdraw(settings.maxWithdraw || 1000);
      setStats(settings.stats || stats);
      setLogs(settings.logs || []);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('autoApproveSettings', JSON.stringify({
      enabled: isAutoApproveEnabled,
      maxDeposit: maxAutoApproveDeposit,
      maxWithdraw: maxAutoApproveWithdraw,
      stats,
      logs: logs.slice(-50) // Keep last 50 logs
    }));
  }, [isAutoApproveEnabled, maxAutoApproveDeposit, maxAutoApproveWithdraw, stats, logs]);

  const { data: pendingRequests } = useQuery({
    queryKey: ['depositRequests'],
    queryFn: () => base44.entities.DepositRequest.list("-created_date"),
    initialData: [],
    refetchInterval: isAutoApproveEnabled ? 30000 : false, // Refresh ogni 30 sec se attivo
  });

  const { data: balances } = useQuery({
    queryKey: ['balances'],
    queryFn: () => base44.entities.TokenBalance.list(),
    initialData: [],
  });

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toISOString();
    setLogs(prev => [{
      timestamp,
      message,
      type
    }, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  const processRequestsMutation = useMutation({
    mutationFn: async () => {
      const pending = pendingRequests.filter(r => r.status === 'pending');
      let approved = 0;
      let rejected = 0;
      let errors = 0;
      let lastError = null;

      addLog(`🔄 Inizio processo: ${pending.length} richieste pending`, 'info');

      for (const request of pending) {
        try {
          // SWAP USDC → $BOT (deposito)
          if (request.request_type === 'swap') {
            if (request.amount <= maxAutoApproveDeposit) {
              addLog(`✅ Auto-approvazione SWAP: ${request.amount} USDC → ${request.bot_amount} $BOT per ${request.user_email}`, 'success');
              
              const userBalance = balances.find(b => b.user_email === request.user_email);
              
              if (userBalance) {
                await base44.entities.TokenBalance.update(userBalance.id, {
                  balance: userBalance.balance + request.bot_amount,
                  total_deposited: userBalance.total_deposited + request.bot_amount
                });
              } else {
                await base44.entities.TokenBalance.create({
                  user_email: request.user_email,
                  balance: 1000 + request.bot_amount,
                  total_deposited: request.bot_amount,
                  total_won: 0,
                  total_lost: 0,
                  total_bets: 0
                });
              }

              await base44.entities.DepositRequest.update(request.id, {
                status: "approved",
                processed: true,
                admin_notes: `Auto-approvato: ${new Date().toISOString()}`
              });

              approved++;
            } else {
              addLog(`⚠️ SWAP supera limite (${request.amount} > ${maxAutoApproveDeposit} USDC) - Richiede approvazione manuale`, 'warning');
              rejected++;
            }
          }

          // SWAP INVERSO $BOT → USDC (prelievo)
          else if (request.request_type === 'swap_reverse') {
            if (request.amount <= maxAutoApproveWithdraw) {
              addLog(`✅ Auto-approvazione PRELIEVO: ${request.amount} $BOT → ${request.usdc_amount} USDC per ${request.user_email}`, 'success');
              
              // Nota: Il balance è già stato sottratto quando l'utente ha fatto richiesta
              
              await base44.entities.DepositRequest.update(request.id, {
                status: "approved",
                processed: true,
                admin_notes: `Auto-approvato: ${new Date().toISOString()} - INVIA ${request.usdc_amount} USDC a ${request.wallet_address}`
              });

              // ⚠️ IMPORTANTE: Qui dovresti inviare USDC dal vault al wallet
              // Ma per ora segno solo come approved e l'admin invia manualmente
              addLog(`📤 AZIONE RICHIESTA: Invia ${request.usdc_amount.toFixed(2)} USDC a ${request.wallet_address}`, 'warning');

              approved++;
            } else {
              addLog(`⚠️ PRELIEVO supera limite (${request.amount} > ${maxAutoApproveWithdraw} $BOT) - Richiede approvazione manuale`, 'warning');
              rejected++;
            }
          }

          // WITHDRAWAL $BOT standard
          else if (request.request_type === 'withdrawal') {
            if (request.amount <= maxAutoApproveWithdraw) {
              addLog(`✅ Auto-approvazione WITHDRAWAL: ${request.amount} $BOT per ${request.user_email}`, 'success');
              
              const userBalance = balances.find(b => b.user_email === request.user_email);
              if (userBalance && userBalance.balance >= request.amount) {
                await base44.entities.TokenBalance.update(userBalance.id, {
                  balance: userBalance.balance - request.amount
                });

                await base44.entities.DepositRequest.update(request.id, {
                  status: "approved",
                  processed: true,
                  admin_notes: `Auto-approvato: ${new Date().toISOString()}`
                });

                approved++;
              } else {
                addLog(`❌ ERRORE: Saldo insufficiente per ${request.user_email}`, 'error');
                errors++;
              }
            } else {
              addLog(`⚠️ WITHDRAWAL supera limite (${request.amount} > ${maxAutoApproveWithdraw} $BOT) - Richiede approvazione manuale`, 'warning');
              rejected++;
            }
          }

        } catch (error) {
          addLog(`❌ ERRORE processando richiesta ${request.id}: ${error.message}`, 'error');
          errors++;
          lastError = error.message;
        }
      }

      setStats(prev => ({
        totalApproved: prev.totalApproved + approved,
        totalRejected: prev.totalRejected + rejected,
        totalErrors: prev.totalErrors + errors,
        lastError: lastError || prev.lastError
      }));

      setLastRunTime(new Date());
      setNextRunTime(new Date(Date.now() + AUTO_APPROVE_INTERVAL));

      addLog(`✅ Processo completato: ${approved} approvate, ${rejected} rifiutate, ${errors} errori`, approved > 0 ? 'success' : 'info');

      return { approved, rejected, errors };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['depositRequests'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
    },
    onError: (error) => {
      addLog(`❌ ERRORE CRITICO: ${error.message}`, 'error');
      setStats(prev => ({
        ...prev,
        totalErrors: prev.totalErrors + 1,
        lastError: error.message
      }));
    }
  });

  // Auto-run ogni 5 minuti se enabled
  useEffect(() => {
    if (!isAutoApproveEnabled || !user || user.email !== ADMIN_EMAIL) return;

    const interval = setInterval(() => {
      addLog('⏰ Timer scaduto - Esecuzione automatica', 'info');
      processRequestsMutation.mutate();
    }, AUTO_APPROVE_INTERVAL);

    // Run immediatamente al primo avvio
    if (!lastRunTime) {
      processRequestsMutation.mutate();
    }

    return () => clearInterval(interval);
  }, [isAutoApproveEnabled, user]);

  // Update next run time
  useEffect(() => {
    if (!isAutoApproveEnabled) {
      setNextRunTime(null);
      return;
    }

    const interval = setInterval(() => {
      if (lastRunTime) {
        setNextRunTime(new Date(lastRunTime.getTime() + AUTO_APPROVE_INTERVAL));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoApproveEnabled, lastRunTime]);

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

  const pendingCount = pendingRequests.filter(r => r.status === 'pending').length;
  const getTimeUntilNext = () => {
    if (!nextRunTime) return null;
    const diff = nextRunTime - new Date();
    if (diff < 0) return "In esecuzione...";
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400">
                Auto-Approve System
              </h1>
              <p className="text-slate-400">Sistema automatico depositi/prelievi notturni</p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <Card className={`mb-8 ${isAutoApproveEnabled ? 'bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-cyan-500/10 border-green-500/50' : 'bg-slate-900/50 border-slate-700/50'} backdrop-blur-xl transition-all duration-300`}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isAutoApproveEnabled ? 'bg-green-500/20 animate-pulse' : 'bg-slate-700/50'}`}>
                  {isAutoApproveEnabled ? (
                    <Activity className="w-8 h-8 text-green-400" />
                  ) : (
                    <Pause className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${isAutoApproveEnabled ? 'text-green-400' : 'text-slate-400'}`}>
                    {isAutoApproveEnabled ? '🟢 ATTIVO' : '🔴 INATTIVO'}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {isAutoApproveEnabled ? `Prossima esecuzione: ${getTimeUntilNext()}` : 'Sistema in pausa'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Abilita/Disabilita</p>
                  <Switch
                    checked={isAutoApproveEnabled}
                    onCheckedChange={setIsAutoApproveEnabled}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-800/30 rounded-xl border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-xs text-slate-400">Approvate</p>
                </div>
                <p className="text-3xl font-bold text-green-400">{stats.totalApproved}</p>
              </div>

              <div className="p-4 bg-slate-800/30 rounded-xl border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <p className="text-xs text-slate-400">Rifiutate</p>
                </div>
                <p className="text-3xl font-bold text-amber-400">{stats.totalRejected}</p>
              </div>

              <div className="p-4 bg-slate-800/30 rounded-xl border border-red-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <p className="text-xs text-slate-400">Errori</p>
                </div>
                <p className="text-3xl font-bold text-red-400">{stats.totalErrors}</p>
              </div>

              <div className="p-4 bg-slate-800/30 rounded-xl border border-cyan-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <p className="text-xs text-slate-400">Pending</p>
                </div>
                <p className="text-3xl font-bold text-cyan-400">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-slate-200 flex items-center gap-2">
              <Settings className="w-6 h-6 text-cyan-400" />
              Impostazioni Auto-Approve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  💰 Max Auto-Approve Deposito (USDC)
                </label>
                <Input
                  type="number"
                  value={maxAutoApproveDeposit}
                  onChange={(e) => setMaxAutoApproveDeposit(parseFloat(e.target.value) || 0)}
                  className="bg-slate-800/50 border-green-500/30 text-slate-200"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Depositi ≤ {maxAutoApproveDeposit} USDC verranno approvati automaticamente
                </p>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  🤖 Max Auto-Approve Prelievo ($BOT)
                </label>
                <Input
                  type="number"
                  value={maxAutoApproveWithdraw}
                  onChange={(e) => setMaxAutoApproveWithdraw(parseFloat(e.target.value) || 0)}
                  className="bg-slate-800/50 border-purple-500/30 text-slate-200"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Prelievi ≤ {maxAutoApproveWithdraw} $BOT verranno approvati automaticamente
                </p>
              </div>
            </div>

            <Alert className="mt-6 bg-cyan-500/10 border-cyan-500/30">
              <AlertDescription className="text-cyan-300 text-sm">
                <strong>🔒 Sicurezza:</strong> Richieste sopra questi limiti richiederanno approvazione manuale.
                Sistema gira ogni 5 minuti quando attivo.
              </AlertDescription>
            </Alert>

            <div className="mt-6 flex gap-4">
              <Button
                onClick={() => processRequestsMutation.mutate()}
                disabled={processRequestsMutation.isPending}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
              >
                {processRequestsMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Elaborazione...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Esegui Ora
                  </>
                )}
              </Button>

              <Button
                onClick={() => {
                  setLogs([]);
                  setStats({
                    totalApproved: 0,
                    totalRejected: 0,
                    totalErrors: 0,
                    lastError: null
                  });
                }}
                variant="outline"
                className="border-red-500/30 hover:bg-red-500/10 text-red-400"
              >
                🗑️ Reset Stats
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs Card */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-slate-200">📋 Log Attività</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Nessun log disponibile</p>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border text-sm ${
                      log.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-300' :
                      log.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' :
                      log.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                      'bg-slate-800/30 border-slate-700/30 text-slate-400'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs opacity-70 flex-shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="flex-1">{log.message}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Alert className="mt-8 bg-blue-500/10 border-blue-500/30">
          <AlertDescription className="text-blue-300">
            <strong>💡 Come Funziona:</strong><br/>
            1. Abilita il sistema con lo switch sopra<br/>
            2. Il sistema controlla richieste pending ogni 5 minuti<br/>
            3. Auto-approva depositi ≤ {maxAutoApproveDeposit} USDC e prelievi ≤ {maxAutoApproveWithdraw} $BOT<br/>
            4. Richieste sopra limite richiedono approvazione manuale su /Admin<br/>
            5. Log dettagliati per audit completo<br/>
            <br/>
            <strong>🌙 Modalità Notturna:</strong> Lascia questa pagina aperta in un tab e il sistema lavorerà automaticamente!
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}