
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet as WalletIcon, ExternalLink, Coins, ShoppingCart, ArrowDownToLine, ArrowUpFromLine, Copy, CheckCircle2, Link as LinkIcon, Bot, Zap, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const ROBOT_CONTRACT = "0xb0d2A7b1F1EC7D39409E1D671473020d20547B55";
const VAULT_ADDRESS = "0x78cFdE6e71Cf5cED4afFce5578D2223b51907a49";
const USDC_CONTRACT = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // USDC su Polygon
const DEFAULT_EXCHANGE_RATE = 100; // 1 USDC = 100 $BOT
const PLATFORM_FEE = 0.05; // 5% fee su depositi USDC

// Funzione per creare data per transfer ERC20
function getTransferData(toAddress, amount) {
  // transfer(address,uint256)
  const methodId = '0xa9059cbb';
  // Indirizzo destinazione (32 bytes)
  const addressParam = toAddress.slice(2).padStart(64, '0');
  // Importo (32 bytes)
  const amountHex = amount.toString(16).padStart(64, '0');
  
  return methodId + addressParam + amountHex;
}

// Funzione per creare data per approve ERC20
function getApproveData(spenderAddress, amount) {
  // approve(address,uint256)
  const methodId = '0x095ea7b3';
  // Indirizzo spender (32 bytes)
  const spenderParam = spenderAddress.slice(2).padStart(64, '0');
  // Importo (32 bytes)
  const amountHex = amount.toString(16).padStart(64, '0');
  
  return methodId + spenderParam + amountHex;
}

// Funzione per controllare balance USDC
async function checkUsdcBalance(ownerAddress) {
  try {
    const methodId = '0x70a08231'; // balanceOf(address)
    const ownerParam = ownerAddress.slice(2).padStart(64, '0');
    const data = methodId + ownerParam;
    
    const result = await window.ethereum.request({
      method: 'eth_call',
      params: [{
        to: USDC_CONTRACT,
        data: data
      }, 'latest']
    });
    
    const balance = parseInt(result, 16) / 1000000;
    return balance;
  } catch (error) {
    console.error('Error checking USDC balance:', error);
    return 0;
  }
}

// Funzione per controllare allowance
async function checkAllowance(ownerAddress, spenderAddress) {
  try {
    // allowance(address,address)
    const methodId = '0xdd62ed3e';
    const ownerParam = ownerAddress.slice(2).padStart(64, '0');
    const spenderParam = spenderAddress.slice(2).padStart(64, '0');
    const data = methodId + ownerParam + spenderParam;
    
    const result = await window.ethereum.request({
      method: 'eth_call',
      params: [{
        to: USDC_CONTRACT,
        data: data
      }, 'latest']
    });
    
    // Converti hex in numero (6 decimali USDC)
    const allowance = parseInt(result, 16) / 1000000;
    return allowance;
  } catch (error) {
    console.error('Error checking allowance:', error);
    return 0;
  }
}

// Funzione per aspettare conferma transazione
async function waitForTransactionReceipt(txHash, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const receipt = await window.ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash]
      });
      
      if (receipt) {
        // Receipt trovato - verifica se TX riuscita o fallita
        const status = receipt.status;
        if (status === '0x1' || status === 1) {
          return { success: true, receipt };
        } else {
          return { success: false, receipt, error: 'Transaction failed on-chain' };
        }
      }
    } catch (error) {
      console.error('Error checking receipt:', error);
    }
    
    // Aspetta 2 secondi prima di riprovare
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Timeout dopo 2 minuti
  return { success: false, error: 'Transaction confirmation timeout' };
}

export default function Wallet() {
  const [user, setUser] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawWallet, setWithdrawWallet] = useState("");
  const [usdcAmount, setUsdcAmount] = useState("");
  const [botToSellAmount, setBotToSellAmount] = useState("");
  const [usdcDestinationWallet, setUsdcDestinationWallet] = useState("");
  const [copiedVault, setCopiedVault] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);
  const [copiedUsdc, setCopiedUsdc] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapTxHash, setSwapTxHash] = useState("");
  const [swapStatus, setSwapStatus] = useState("");
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

  const { data: balances } = useQuery({
    queryKey: ['balances'],
    queryFn: () => base44.entities.TokenBalance.list(),
    initialData: [],
  });

  const userBalance = user ? balances.find(b => b.user_email === user.email) : null;

  // Auto-fill USDC destination with connected wallet
  useEffect(() => {
    if (userBalance?.wallet_address && !usdcDestinationWallet) {
      setUsdcDestinationWallet(userBalance.wallet_address);
    }
  }, [userBalance?.wallet_address, usdcDestinationWallet]);

  const connectWalletMutation = useMutation({
    mutationFn: async () => {
      if (!window.ethereum) {
        throw new Error('MetaMask non installato! Scaricalo da metamask.io');
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const address = accounts[0];

      // Verifica network Polygon
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

      // Salva wallet address in TokenBalance
      if (userBalance) {
        await base44.entities.TokenBalance.update(userBalance.id, {
          wallet_address: address
        });
      } else {
        await base44.entities.TokenBalance.create({
          user_email: user.email,
          wallet_address: address,
          balance: 0, // Changed from 1000 to 0 as per requirements
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

  const buyWithUsdcMutation = useMutation({
    mutationFn: async () => {
      if (!window.ethereum) {
        throw new Error('❌ MetaMask non installato!');
      }

      if (!userBalance?.wallet_address) {
        throw new Error('❌ Collega prima il wallet MetaMask!');
      }

      const usdcValue = parseFloat(usdcAmount);
      if (isNaN(usdcValue) || usdcValue <= 0) {
        throw new Error('❌ Inserisci un importo valido!');
      }

      setSwapLoading(true);
      setSwapTxHash("");
      setSwapStatus("🔍 Verifica network Polygon...");

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

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const fromAddress = accounts[0];

      // ✅ VERIFICA BALANCE USDC
      setSwapStatus("💰 Controllo saldo USDC...");
      const usdcBalance = await checkUsdcBalance(fromAddress);
      console.log('💰 USDC Balance:', usdcBalance, 'Need:', usdcValue);
      
      if (usdcBalance < usdcValue) {
        throw new Error(`❌ USDC insufficienti!\n\nHai: ${usdcBalance.toFixed(2)} USDC\nServe: ${usdcValue} USDC\n\nCompra USDC su un exchange e trasferiscili al tuo wallet Polygon.`);
      }

      // CALCOLA FEE 5% ALLA FONTE
      const platformFee = usdcValue * PLATFORM_FEE; // 5% in USDC
      const netUsdcAmount = usdcValue - platformFee; // 95% da convertire in $BOT
      const botAmount = netUsdcAmount * DEFAULT_EXCHANGE_RATE;

      console.log('💰 Breakdown:');
      console.log('  Total USDC:', usdcValue);
      console.log('  Platform Fee (5%):', platformFee, 'USDC');
      console.log('  Net USDC:', netUsdcAmount);
      console.log('  $BOT to receive:', botAmount);

      const amountInSmallestUnit = Math.floor(usdcValue * 1000000);

      // ✅ STEP 1: Controlla se c'è già allowance
      setSwapStatus("🔍 Controllo approvazione USDC...");
      const currentAllowance = await checkAllowance(fromAddress, VAULT_ADDRESS);
      
      console.log('🔐 Current allowance:', currentAllowance, 'Need:', usdcValue);

      // Se allowance insufficiente, richiedi approval
      if (currentAllowance < usdcValue) {
        setSwapStatus("🔐 Richiesta approvazione USDC (1/2)...");
        
        // Approva importo molto alto per evitare approval future (tipo Uniswap)
        const largeAmount = 1000000000000; // 1 trilione USDC
        const largeAmountSmallest = Math.floor(largeAmount * 1000000);
        
        const approveData = getApproveData(VAULT_ADDRESS, largeAmountSmallest);

        console.log('📝 Sending approval TX...');
        console.log('From:', fromAddress);
        console.log('To (USDC):', USDC_CONTRACT);
        console.log('Spender (Vault):', VAULT_ADDRESS);
        console.log('Amount:', largeAmount, 'USDC');

        try {
          const approveTxHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: fromAddress,
              to: USDC_CONTRACT,
              data: approveData,
              value: '0x0'
            }]
          });

          console.log('✅ Approval TX sent:', approveTxHash);
          setSwapStatus("⏳ Attendi conferma approval (30-60 sec)...");
          
          const approveResult = await waitForTransactionReceipt(approveTxHash, 60);

          if (!approveResult.success) {
            console.error('❌ Approval failed:', approveResult);
            throw new Error('Approval fallito on-chain. Possibili cause:\n\n1. Gas insufficiente\n2. Network congestionato\n3. TX rimpiazzata/cancellata\n\nProva di nuovo!');
          }

          console.log('✅ Approval confirmed!');
          setSwapStatus("✅ Approval confermato!");
          
          // Aspetta 2 secondi per sicurezza
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (approveError) {
          console.error('❌ Approval error:', approveError);
          if (approveError.code === 4001) {
            throw new Error('❌ Approval rifiutato. Devi approvare USDC per procedere.');
          }
          throw new Error('❌ Errore approval: ' + approveError.message);
        }
      } else {
        console.log('✅ USDC already approved!');
        setSwapStatus("✅ USDC già approvato!");
      }

      // ✅ STEP 2: Invia USDC al vault
      setSwapStatus("💸 Invio USDC al vault (2/2)...");
      
      const transferData = getTransferData(VAULT_ADDRESS, amountInSmallestUnit);

      console.log('📝 Sending transfer TX...');
      console.log('From:', fromAddress);
      console.log('To (USDC):', USDC_CONTRACT);
      console.log('Recipient (Vault):', VAULT_ADDRESS);
      console.log('Amount:', usdcValue, 'USDC');

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: fromAddress,
          to: USDC_CONTRACT,
          data: transferData,
          value: '0x0'
        }]
      });
      
      console.log('✅ Transfer TX sent:', txHash);
      setSwapTxHash(txHash);
      setSwapStatus("⏳ Attendi conferma transfer (30-60 sec)...");

      // ✅ ASPETTA CONFERMA TRANSAZIONE (MAX 2 MINUTI)
      const result = await waitForTransactionReceipt(txHash, 60);

      if (!result.success) {
        console.error('❌ Transfer failed:', result);
        throw new Error('Transfer fallito on-chain. Possibili cause:\n\n1. Approval non sufficiente (riprova)\n2. Gas insufficiente\n3. Network congestionato\n\nControlla PolygonScan per dettagli.');
      }

      console.log('✅ Transfer confirmed!');
      setSwapStatus("✅ Transfer confermato! Creazione richiesta...");

      // ✅ ORA CREA DepositRequest SOLO SE TX RIUSCITA
      await base44.entities.DepositRequest.create({
        user_email: user.email,
        wallet_address: userBalance.wallet_address,
        amount: usdcValue, // USDC totali inviati
        token_type: "USDC",
        bot_amount: botAmount, // $BOT netti da accreditare (già scontati del 5%)
        exchange_rate: DEFAULT_EXCHANGE_RATE,
        status: "pending",
        request_type: "swap",
        tx_hash: txHash,
        processed: false
      });

      // TRACCIA FEE IN USDC NELLE PLATFORMSTATS
      const platformStats = await base44.entities.PlatformStats.list();
      if (platformStats.length > 0) {
        await base44.entities.PlatformStats.update(platformStats[0].id, {
          total_commission_earned: platformStats[0].total_commission_earned + (platformFee * DEFAULT_EXCHANGE_RATE), // Converti fee USDC in equivalente $BOT per tracking
          total_volume: platformStats[0].total_volume + usdcValue * DEFAULT_EXCHANGE_RATE,
          last_updated: new Date().toISOString()
        });
      } else {
        await base44.entities.PlatformStats.create({
          total_commission_earned: platformFee * DEFAULT_EXCHANGE_RATE,
          total_bets_placed: 0,
          total_volume: usdcValue * DEFAULT_EXCHANGE_RATE,
          last_updated: new Date().toISOString()
        });
      }

      console.log('✅ DepositRequest created!');
      console.log(`💰 Fee trattenuta: ${platformFee} USDC (${platformFee * DEFAULT_EXCHANGE_RATE} $BOT equivalenti)`);

      return { txHash, botAmount, platformFee, usdcValue, netUsdcAmount };
    },
    onSuccess: (data) => {
      setSwapLoading(false);
      setSwapStatus("");
      queryClient.invalidateQueries({ queryKey: ['depositRequests'] });
      queryClient.invalidateQueries({ queryKey: ['platformStats'] });
      alert(`✅ USDC inviati con successo!\n\n💰 Breakdown:\n• USDC inviati: ${data.usdcValue}\n• Fee piattaforma (5%): ${data.platformFee.toFixed(2)} USDC\n• USDC netti: ${data.netUsdcAmount.toFixed(2)}\n\n🤖 Riceverai: ${data.botAmount.toFixed(0)} $BOT\n\nIl bot Telegram ha notificato l'admin.\n\nTX: ${data.txHash.slice(0, 10)}...`);
      setUsdcAmount("");
      setSwapTxHash("");
    },
    onError: (error) => {
      setSwapLoading(false);
      setSwapTxHash("");
      setSwapStatus("");
      
      console.error('❌ Full error:', error);
      
      let errorMessage = error.message;
      
      // Errori comuni MetaMask
      if (error.code === 4001) {
        errorMessage = '❌ Transazione rifiutata dall\'utente.';
      } else if (error.message && error.message.includes('insufficient funds')) {
        errorMessage = '❌ Fondi insufficienti!\n\nVerifica:\n• Hai abbastanza USDC?\n• Hai almeno 0.1 MATIC per gas?';
      } else if (error.message && error.message.includes('network')) {
        errorMessage = '❌ Errore network. Verifica di essere su Polygon!';
      }
      
      alert(errorMessage);
    }
  });

  // NUOVO: Converti $BOT → USDC
  const sellBotForUsdcMutation = useMutation({
    mutationFn: async () => {
      const botAmount = parseFloat(botToSellAmount);
      if (isNaN(botAmount) || botAmount <= 0) {
        throw new Error('❌ Inserisci un importo valido!');
      }

      if (!userBalance || userBalance.balance < botAmount) {
        throw new Error(`❌ Saldo insufficiente!\n\nHai: ${userBalance?.balance || 0} $BOT\nServe: ${botAmount} $BOT`);
      }

      if (botAmount < 100) {
        throw new Error('❌ Importo minimo: 100 $BOT');
      }

      // Validazione indirizzo wallet
      if (!usdcDestinationWallet || !usdcDestinationWallet.startsWith('0x') || usdcDestinationWallet.length !== 42) {
        throw new Error('❌ Indirizzo wallet non valido!\n\nDeve iniziare con 0x e avere 42 caratteri.');
      }

      const usdcAmount = botAmount / DEFAULT_EXCHANGE_RATE;

      // Sottrai balance
      await base44.entities.TokenBalance.update(userBalance.id, {
        balance: userBalance.balance - botAmount
      });

      // Crea richiesta swap inverso con indirizzo scelto dall'utente
      await base44.entities.DepositRequest.create({
        user_email: user.email,
        wallet_address: usdcDestinationWallet, // ⬅️ USA L'INDIRIZZO SCELTO DALL'UTENTE
        amount: botAmount,
        token_type: "BOT",
        usdc_amount: usdcAmount,
        exchange_rate: DEFAULT_EXCHANGE_RATE,
        status: "pending",
        request_type: "swap_reverse",
        processed: false
      });

      return { botAmount, usdcAmount, destinationWallet: usdcDestinationWallet };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      alert(`✅ Richiesta inviata!\n\n💰 Converti: ${data.botAmount} $BOT → ${data.usdcAmount.toFixed(2)} USDC\n\nRiceverai ${data.usdcAmount.toFixed(2)} USDC a:\n${data.destinationWallet}\n\nIl bot Telegram ha notificato l'admin!`);
      setBotToSellAmount("");
      // Non resettare usdcDestinationWallet per comodità
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  const createWithdrawRequestMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.DepositRequest.create({
        user_email: user.email,
        wallet_address: withdrawWallet,
        amount: parseFloat(withdrawAmount),
        token_type: "BOT",
        status: "pending",
        request_type: "withdrawal",
        processed: false
      });
    },
    onSuccess: () => {
      alert("✅ Richiesta inviata! I token saranno inviati automaticamente dopo approvazione admin.");
      setWithdrawAmount("");
      setWithdrawWallet("");
    }
  });

  const copyVaultAddress = () => {
    navigator.clipboard.writeText(VAULT_ADDRESS);
    setCopiedVault(true);
    setTimeout(() => setCopiedVault(false), 2000);
  };

  const copyContractAddress = () => {
    navigator.clipboard.writeText(ROBOT_CONTRACT);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const copyUsdcAddress = () => {
    navigator.clipboard.writeText(USDC_CONTRACT);
    setCopiedUsdc(true);
    setTimeout(() => setCopiedUsdc(false), 2000);
  };

  const estimatedBotAmount = parseFloat(usdcAmount) > 0 
    ? (parseFloat(usdcAmount) * (1 - PLATFORM_FEE) * DEFAULT_EXCHANGE_RATE) 
    : 0;
  const platformFeeDisplay = parseFloat(usdcAmount) * PLATFORM_FEE || 0;
  const netUsdcDisplay = parseFloat(usdcAmount) * (1 - PLATFORM_FEE) || 0;
  const estimatedUsdcAmount = parseFloat(botToSellAmount) / DEFAULT_EXCHANGE_RATE || 0;

  // 🆕 Determina se mostrare il CTA MetaMask
  const needsWalletConnection = user && (!userBalance || !userBalance.wallet_address);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <WalletIcon className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              Wallet $BOT
            </h1>
          </div>
          <p className="text-slate-400">
            Gestisci i tuoi token sulla blockchain Polygon
          </p>
        </div>

        {/* NEW: CTA COLLEGA METAMASK (if user logged in but no wallet) */}
        {needsWalletConnection && (
          <Card className="bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-yellow-500/10 backdrop-blur-xl border-2 border-orange-500/50 mb-8 shadow-2xl shadow-orange-500/20">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/50">
                <LinkIcon className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mb-4">
                🦊 Collega MetaMask
              </h3>
              
              <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
                Per comprare $BOT con USDC o vendere $BOT per USDC, devi prima collegare il tuo wallet MetaMask al tuo account.
              </p>

              <Alert className="bg-cyan-500/10 border-cyan-500/30 mb-6 max-w-2xl mx-auto">
                <AlertDescription className="text-cyan-300 text-left">
                  <strong>💡 Perché collegare MetaMask?</strong><br/>
                  <div className="mt-2 space-y-1 text-sm">
                    ✅ Compra $BOT direttamente con USDC<br/>
                    ✅ Vendi $BOT e ricevi USDC<br/>
                    ✅ Transazioni sicure sulla blockchain Polygon<br/>
                    ✅ Zero commissioni per collegare il wallet
                  </div>
                </AlertDescription>
              </Alert>

              <Button
                onClick={() => connectWalletMutation.mutate()}
                disabled={connectWalletMutation.isPending}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xl px-12 py-6 rounded-xl shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {connectWalletMutation.isPending ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Collegamento in corso...
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-6 h-6 mr-3" />
                    🦊 Collega MetaMask Ora
                  </>
                )}
              </Button>

              <p className="text-slate-500 text-sm mt-4">
                Non hai MetaMask? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">Scaricalo qui →</a>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Not logged in alert */}
        {!user && (
          <Alert className="mb-8 bg-yellow-500/10 border-yellow-500/30">
            <AlertDescription className="text-yellow-400 text-center">
              ⚠️ Effettua il login per gestire il tuo wallet
            </AlertDescription>
          </Alert>
        )}

        {/* Existing: User balance card (renders if user and balance record exist) */}
        {user && userBalance && (
          <Card className="bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-cyan-500/30 mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-slate-400 mb-3 text-sm uppercase tracking-wider">Saldo Disponibile</p>
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
                    {userBalance.balance}
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-base px-4 py-1">
                    $BOT
                  </Badge>
                </div>

                <div className="text-center border-l border-cyan-500/20 pl-6">
                  <p className="text-slate-400 mb-3 text-sm uppercase tracking-wider">Wallet Collegato</p>
                  {userBalance.wallet_address ? (
                    <>
                      <p className="text-lg font-mono text-cyan-300 mb-4">
                        {userBalance.wallet_address.slice(0, 8)}...{userBalance.wallet_address.slice(-6)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://polygonscan.com/address/${userBalance.wallet_address}`, '_blank')}
                        className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Vedi su PolygonScan
                      </Button>
                    </>
                  ) : (
                    // Display connect button if no wallet_address
                    <>
                      <p className="text-slate-500 mb-4">Nessun wallet collegato</p>
                      <Button
                        onClick={() => connectWalletMutation.mutate()}
                        disabled={connectWalletMutation.isPending}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                      >
                        {connectWalletMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Collegamento...
                          </>
                        ) : (
                          <>
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Collega MetaMask
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All other interactive features ONLY render if user is logged in AND wallet IS connected */}
        {user && userBalance?.wallet_address && (
          <>
            {/* MINI-EXCHANGE CARD - HIGHLIGHTED */}
            <Card className="bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-cyan-500/10 backdrop-blur-xl border-2 border-green-500/50 mb-8 shadow-2xl shadow-green-500/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                      💰 Compra $BOT con USDC
                    </h3>
                    <p className="text-green-300 text-sm">🔐 Approval automatico + Fee 5% trattenuta!</p>
                  </div>
                </div>

                <Alert className="bg-amber-500/10 border-amber-500/40 mb-6">
                  <AlertDescription className="text-amber-300">
                    <strong className="flex items-center gap-2 mb-2">
                      💰 Fee Piattaforma 5% (trattenuta alla fonte)
                    </strong>
                    <div className="text-sm space-y-1">
                      ✅ Se invii 10 USDC → Fee: 0.5 USDC → Ricevi: 950 $BOT<br/>
                      ✅ Se invii 100 USDC → Fee: 5 USDC → Ricevi: 9,500 $BOT<br/>
                      ✅ Fee trattenuta automaticamente, tu ricevi solo i $BOT netti!
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* LEFT: SEND USDC */}
                  <div className="bg-slate-800/30 rounded-xl p-6 border border-green-500/30">
                    <p className="text-slate-400 mb-2 text-sm">Tu Invii</p>
                    <div className="flex items-center gap-3 mb-4">
                      <Input
                        type="number"
                        placeholder="10"
                        value={usdcAmount}
                        onChange={(e) => setUsdcAmount(e.target.value)}
                        className="bg-slate-900/50 border-green-500/30 text-3xl font-bold text-green-300 text-center"
                        disabled={swapLoading}
                      />
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-lg px-4 py-2">
                        USDC
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 text-center">
                      Stablecoin su Polygon (≈ $1 USD)
                    </p>
                  </div>

                  {/* RIGHT: RECEIVE BOT */}
                  <div className="bg-slate-800/30 rounded-xl p-6 border border-cyan-500/30">
                    <p className="text-slate-400 mb-2 text-sm">Tu Ricevi</p>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 bg-slate-900/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-center">
                        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                          {estimatedBotAmount.toFixed(0)}
                        </p>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-lg px-4 py-2">
                        $BOT
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 text-center">
                      Token piattaforma per betting
                    </p>
                  </div>
                </div>

                {/* FEE BREAKDOWN CARD */}
                {parseFloat(usdcAmount) > 0 && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/30">
                    <p className="text-xs text-amber-400 font-bold mb-3 text-center">💰 BREAKDOWN DETTAGLIATO:</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-slate-400 text-xs mb-1">USDC Totali</p>
                        <p className="text-blue-300 font-bold">{parseFloat(usdcAmount).toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400 text-xs mb-1">Fee 5% Piattaforma</p>
                        <p className="text-amber-400 font-bold">-{platformFeeDisplay.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400 text-xs mb-1">USDC Netti</p>
                        <p className="text-green-400 font-bold">{netUsdcDisplay.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-amber-500/20 text-center">
                      <p className="text-xs text-slate-400 mb-1">$BOT che ricevi:</p>
                      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                        {estimatedBotAmount.toFixed(0)} $BOT
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        ({netUsdcDisplay.toFixed(2)} USDC × {DEFAULT_EXCHANGE_RATE})
                      </p>
                    </div>
                  </div>
                )}

                {/* EXCHANGE RATE INFO */}
                <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-center justify-center gap-2 text-green-300">
                    <TrendingUp className="w-5 h-5" />
                    <p className="font-bold">
                      Tasso: 1 USDC = {DEFAULT_EXCHANGE_RATE} $BOT (dopo fee 5%)
                    </p>
                  </div>
                  <p className="text-xs text-center text-slate-400 mt-2">
                    Fee trattenuta alla fonte • Accredito dopo approvazione • Sicuro al 100%
                  </p>
                </div>

                {/* CTA BUTTON */}
                <Button 
                  onClick={() => buyWithUsdcMutation.mutate()}
                  disabled={!user || !userBalance?.wallet_address || !usdcAmount || parseFloat(usdcAmount) <= 0 || swapLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-lg py-6 shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {swapLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {swapStatus || 'Elaborazione...'}
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-5 h-5 mr-2" />
                      🦊 Compra con MetaMask
                    </>
                  )}
                </Button>

                {swapTxHash && (
                  <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <p className="text-blue-300 text-sm text-center">
                      {swapStatus || '⏳ Transazione in corso...'}<br/>
                      <a 
                        href={`https://polygonscan.com/tx/${swapTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-200"
                      >
                        Vedi su PolygonScan →
                      </a>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* VENDI $BOT PER USDC - CON CAMPO INDIRIZZO */}
            <Card className="bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-teal-500/10 backdrop-blur-xl border-2 border-blue-500/50 mb-8 shadow-2xl shadow-blue-500/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <ArrowUpFromLine className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                      💸 Vendi $BOT per USDC
                    </h3>
                    <p className="text-blue-300 text-sm">Converti i tuoi $BOT in USDC prelevabili!</p>
                  </div>
                </div>

                <Alert className="bg-blue-500/10 border-blue-500/30 mb-6">
                  <AlertDescription className="text-blue-300">
                    <strong className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      Perché vendere $BOT?
                    </strong>
                    <div className="text-sm space-y-1">
                      💡 $BOT non è ancora quotato su exchange<br/>
                      💰 Converti in USDC per prelevare facilmente<br/>
                      🔒 Tasso fisso: <strong className="text-blue-400">100 $BOT = 1 USDC</strong><br/>
                      ✅ Admin approva → USDC inviati al tuo wallet!
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="space-y-6 mb-6">
                  {/* NUOVO: Campo indirizzo destinazione USDC */}
                  <div className="bg-slate-800/30 rounded-xl p-6 border border-amber-500/30">
                    <label className="text-slate-300 mb-3 text-sm font-bold flex items-center gap-2">
                      📍 Indirizzo Destinazione USDC
                      <span className="text-amber-400 text-xs">(puoi modificarlo)</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="0x..."
                      value={usdcDestinationWallet}
                      onChange={(e) => setUsdcDestinationWallet(e.target.value)}
                      className="bg-slate-900/50 border-amber-500/30 text-slate-200 font-mono text-sm"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Gli USDC verranno inviati a questo indirizzo dopo approvazione admin
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* LEFT: VENDI BOT */}
                    <div className="bg-slate-800/30 rounded-xl p-6 border border-blue-500/30">
                      <p className="text-slate-400 mb-2 text-sm">Tu Vendi</p>
                      <div className="flex items-center gap-3 mb-4">
                        <Input
                          type="number"
                          placeholder="1000"
                          value={botToSellAmount}
                          onChange={(e) => setBotToSellAmount(e.target.value)}
                          className="bg-slate-900/50 border-blue-500/30 text-3xl font-bold text-blue-300 text-center"
                        />
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-lg px-4 py-2">
                          $BOT
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 text-center">
                        Disponibile: {userBalance?.balance || 0} $BOT
                      </p>
                    </div>

                    {/* RIGHT: RICEVI USDC */}
                    <div className="bg-slate-800/30 rounded-xl p-6 border border-green-500/30">
                      <p className="text-slate-400 mb-2 text-sm">Tu Ricevi</p>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 bg-slate-900/50 border border-green-500/30 rounded-lg px-4 py-3 text-center">
                          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                            {estimatedUsdcAmount.toFixed(2)}
                          </p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-lg px-4 py-2">
                          USDC
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 text-center">
                        Stablecoin (≈ ${estimatedUsdcAmount.toFixed(2)} USD)
                      </p>
                    </div>
                  </div>
                </div>

                {/* EXCHANGE RATE INFO */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/30">
                  <div className="flex items-center justify-center gap-2 text-blue-300">
                    <TrendingUp className="w-5 h-5" />
                    <p className="font-bold">
                      Tasso Fisso: 100 $BOT = 1 USDC
                    </p>
                  </div>
                  <p className="text-xs text-center text-slate-400 mt-2">
                    Zero commissioni • Ricezione dopo approvazione • Min 100 $BOT
                  </p>
                </div>

                {/* CTA BUTTON */}
                <Button 
                  onClick={() => sellBotForUsdcMutation.mutate()}
                  disabled={!user || !userBalance?.wallet_address || !botToSellAmount || parseFloat(botToSellAmount) < 100 || !usdcDestinationWallet || sellBotForUsdcMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-lg py-6 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sellBotForUsdcMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Invio richiesta...
                    </>
                  ) : (
                    <>
                      <ArrowUpFromLine className="w-5 h-5 mr-2" />
                      💸 Vendi $BOT per USDC
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* HOW IT WORKS */}
            <Card className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl border-cyan-500/30 mb-8">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Bot className="w-8 h-8 text-cyan-400" />
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    🤖 Come Funziona (100% Automatico!)
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="p-6 bg-slate-800/30 rounded-xl border border-green-500/30">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-green-400 font-bold text-xl">1</span>
                      </div>
                      <h4 className="text-green-400 font-bold text-center mb-2">Collega Wallet</h4>
                      <p className="text-slate-400 text-sm text-center">
                        Clicca "Collega MetaMask" una sola volta
                      </p>
                    </div>

                    <div className="p-6 bg-slate-800/30 rounded-xl border border-purple-500/30">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-purple-400 font-bold text-xl">2</span>
                      </div>
                      <h4 className="text-purple-400 font-bold text-center mb-2">Inserisci Importo</h4>
                      <p className="text-slate-400 text-sm text-center">
                        Quanto USDC vuoi spendere
                      </p>
                    </div>

                    <div className="p-6 bg-slate-800/30 rounded-xl border border-cyan-500/30">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-cyan-400 font-bold text-xl">3</span>
                      </div>
                      <h4 className="text-cyan-400 font-bold text-center mb-2">Approval Auto</h4>
                      <p className="text-slate-400 text-sm text-center">
                        Prima volta: 2 conferme MetaMask
                      </p>
                    </div>

                    <div className="p-6 bg-slate-800/30 rounded-xl border border-pink-500/30">
                      <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-pink-400 font-bold text-xl">4</span>
                      </div>
                      <h4 className="text-pink-400 font-bold text-center mb-2">Ricevi $BOT</h4>
                      <p className="text-slate-400 text-sm text-center">
                        Dopo approvazione admin
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                    <p className="text-blue-300 text-sm">
                      <strong>⚡ Zero Sforzo per l'Utente:</strong><br/>
                      • Prima volta: conferma approval + transfer (2 TX)<br/>
                      • Volte successive: solo transfer (1 TX)<br/>
                      • Sistema aspetta conferma blockchain automaticamente<br/>
                      • Bot Telegram rileva e notifica admin automaticamente<br/>
                      • Admin approva → $BOT accreditati istantaneamente!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* PRELEVA CARD */}
              <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/30 hover:border-cyan-500/60 transition-all">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/50">
                    <ArrowUpFromLine className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">Preleva</h3>
                  <p className="text-slate-400 text-sm mb-6">
                    Ricevi al tuo wallet (automatico)
                  </p>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-lg py-6"
                        disabled={!user || !userBalance || userBalance.balance < 100}
                      >
                        Preleva $BOT
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-cyan-500/30">
                      <DialogHeader>
                        <DialogTitle className="text-slate-200">Richiedi Prelievo</DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Bot invierà i token dopo approvazione admin
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 pt-4">
                        <div>
                          <label className="text-sm text-slate-300 mb-2 block">Wallet Destinazione</label>
                          <Input
                            type="text"
                            placeholder="0x..."
                            value={withdrawWallet}
                            onChange={(e) => setWithdrawWallet(e.target.value)}
                            className="bg-slate-800/50 border-cyan-500/30 text-slate-200 font-mono text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-slate-300 mb-2 block">Importo $BOT</label>
                          <Input
                            type="number"
                            placeholder="es: 500"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="bg-slate-800/50 border-cyan-500/30 text-slate-200 text-lg"
                          />
                          <p className="text-xs text-slate-500 mt-2">
                            Disponibile: {userBalance?.balance || 0} $BOT (min 100)
                          </p>
                        </div>

                        <Button
                          onClick={() => createWithdrawRequestMutation.mutate()}
                          disabled={!withdrawWallet || !withdrawAmount || parseFloat(withdrawAmount) < 100 || createWithdrawRequestMutation.isPending}
                          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-6"
                        >
                          {createWithdrawRequestMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Invio...
                            </>
                          ) : (
                            <>
                              📤 Invia Richiesta
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* DEPOSITA BOT (Manual fallback) */}
              <Card className="bg-slate-900/50 backdrop-blur-xl border-purple-500/30 hover:border-purple-500/60 transition-all">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50">
                    <ArrowDownToLine className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">Deposita $BOT</h3>
                  <p className="text-slate-400 text-sm mb-6">
                    Hai già $BOT? Depositali qui
                  </p>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-lg py-6"
                        disabled={!user || !userBalance?.wallet_address}
                      >
                        Deposita $BOT
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-purple-500/30">
                      <DialogHeader>
                        <DialogTitle className="text-slate-200">Deposito $BOT</DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Invia $BOT manualmente al vault
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 pt-4">
                        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/30">
                          <p className="text-purple-300 font-bold mb-4 text-center">
                            📍 Indirizzo Vault
                          </p>
                          
                          <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                            <code className="text-sm text-slate-200 break-all font-mono">
                              {VAULT_ADDRESS}
                            </code>
                          </div>

                          <Button
                            onClick={copyVaultAddress}
                            variant="outline"
                            className="w-full border-purple-500/30 hover:bg-purple-500/10 text-purple-300"
                          >
                            {copiedVault ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Copiato!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copia Indirizzo
                              </>
                            )}
                          </Button>
                        </div>

                        <p className="text-xs text-slate-500 text-center">
                          Invia $BOT da MetaMask a questo indirizzo.<br/>
                          Bot rileverà automaticamente il deposito!
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/50 backdrop-blur-xl border-cyan-500/20">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-slate-200 font-bold mb-3 flex items-center gap-2">
                      <Coins className="w-5 h-5 text-cyan-400" />
                      Info Token
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Network:</span>
                        <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          Polygon
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tipo:</span>
                        <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          ERC-20
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Fee Gas:</span>
                        <span className="text-green-400">~$0.01</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-slate-200 font-bold mb-3">Links Utili</h4>
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`https://polygonscan.com/token/${ROBOT_CONTRACT}`, '_blank')}
                        className="w-full justify-start text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        PolygonScan ($BOT)
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`https://polygonscan.com/address/${VAULT_ADDRESS}`, '_blank')}
                        className="w-full justify-start text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        PolygonScan (Vault)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
