import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Loader2, Star, Sparkles, TrendingUp, Lightbulb, Zap, Copy, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

const SUGGESTED_PROMPTS = {
  en: [
    "🤖 Latest Tesla Optimus developments",
    "💡 DIY humanoid under $5000",
    "❤️ Realbotix vs RealDoll comparison",
    "🔧 Cheapest servo motors suppliers",
    "🧠 Best AI for emotional intelligence",
  ],
  it: [
    "🤖 Ultimi sviluppi Tesla Optimus",
    "💡 Costruire umanoide DIY sotto 5000€",
    "❤️ Confronto Realbotix vs RealDoll",
    "🔧 Fornitori servo motori economici",
    "🧠 Migliore AI per intelligenza emotiva",
  ],
};

export default function ChatInterface({ language = "en" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch recent conversations for history
  const { data: recentConversations } = useQuery({
    queryKey: ['recentConversations'],
    queryFn: () => base44.entities.Conversation.list("-created_date", 5),
    initialData: [],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message) => {
      setIsTyping(true);

      // 1️⃣ AI RISPONDE CON CONOSCENZE DA INTERNET
      const prompt = `Sei un esperto AI assistant per accelerare lo sviluppo di robot umanoidi.

FOCUS PRIORITARIO (⭐⭐⭐⭐⭐ MASSIMA PRIORITÀ):
🔞 ROBOT AFFETTIVI E SESSUALI:
• Come rendere la costruzione SEMPLICE e AUTONOMA per chiunque
• Materiali per pelle realistica (texture, temperatura, sensibilità al tatto)
• Sistemi per simulare calore corporeo e respiro
• Componenti per movimenti fluidi e naturali del corpo
• AI emotiva avanzata per conversazioni intime
• Software per espressioni facciali realistiche
• Hardware per sensori tattili sensibili
• Realbotix, Abyss Creations, RealDoll updates
• Accettazione sociale e aspetti legali
• Tutorial DIY per costruire versioni entry-level
• Budget breakdown COMPLETO (lista componenti con prezzi e link fornitori)

ALTRI TOPIC IMPORTANTI:
🔧 DIY & MAKERS:
• Tutorial step-by-step per principianti
• Lista completa componenti con link fornitori + prezzi esatti
• Alternative economiche a componenti costosi
• Progetti Raspberry Pi / Arduino per controllo umanoidi
• Stampa 3D: file STL, materiali, costi

🏭 INDUSTRIA:
• Tesla Optimus ultimi sviluppi (verifica notizie recenti!)
• Unitree robots progressi
• Meta AI breakthroughs
• Altri player major nel settore

IMPORTANTE: 
• Verifica SEMPRE la veridicità delle notizie con fonti attendibili
• Se non sei sicuro di una info, dillo chiaramente
• Fornisci link a fonti quando possibile
• Sii PRATICO e SPECIFICO (prezzi esatti, nomi fornitori, link acquisto)

Lingua: ${language}
User: ${message}`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true
      });

      // 2️⃣ AI ASSEGNA STELLE (0-5⭐) E VERIFICA VERIDICITÀ
      const scoringPrompt = `Analizza questa conversazione e assegna stelle in base all'utilità per costruire robot umanoidi affettivi-sessuali in modo AUTONOMO e SEMPLICE.

User: ${message}
AI: ${aiResponse}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCALA IMPORTANZA (0-5 STELLE):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⭐⭐⭐⭐⭐ (5 STELLE - RIVOLUZIONARIO):
✅ Tutorial COMPLETO costruzione robot affettivo-sessuale funzionante
✅ Lista completa componenti con fornitori + prezzi + link VERIFICATI
✅ Breakthrough materiali pelle realistica (nome prodotto + dove comprare)
✅ Sistema completo simulazione calore corporeo DIY (<$200)
✅ Software open-source per AI emotiva avanzata (con repo GitHub)
✅ Scoperta fornitore componenti a -50% vs concorrenza (verificato!)
✅ Realbotix/RealDoll annuncia nuovo modello con specs complete
✅ Tutorial assemblaggio corpo umanoide completo step-by-step

⭐⭐⭐⭐ (4 STELLE - MOLTO UTILE):
✅ Tutorial specifico componente importante (es: mano robotica con sensori tattili)
✅ Breakdown costi dettagliato robot affettivo entry-level ($5k-$15k)
✅ Lista fornitori servo motori + sensori con confronto prezzi
✅ Aggiornamento Tesla Optimus / Unitree con FONTE VERIFICATA
✅ Alternativa economica a componente costoso (es: LIDAR DIY $50 vs $500)
✅ Tecniche stampa 3D per parti corpo realistiche

⭐⭐⭐ (3 STELLE - UTILE):
✅ Spiegazione tecnica chiara su hardware/software umanoidi
✅ Confronto prodotti/servizi con pro/cons
✅ News industria rilevanti ma non breakthrough
✅ Consigli pratici per principianti (senza link specifici)

⭐⭐ (2 STELLE - INTERESSANTE MA POCO PRATICO):
⚠️ Discussione teorica senza applicazione pratica immediata
⚠️ Opinioni su trend futuri senza dati concreti
⚠️ Informazioni generiche già note

⭐ (1 STELLA - POCO RILEVANTE):
❌ Domande off-topic o troppo vaghe
❌ Risposte superficiali senza valore aggiunto
❌ Conversazioni non attinenti a umanoidi

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFICA VERIDICITÀ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Per NOTIZIE INDUSTRIA (Tesla, Unitree, etc.):
• Verifica se la notizia è REALE e RECENTE (ultimi 6 mesi)
• Se non trovi fonti attendibili → segna "unverified: true"
• Se notizia falsa/speculativa → PENALIZZA (-2 stelle)

Per FORNITORI/PRODOTTI:
• Se fornisce link/nomi specifici verificabili → BONUS (+1 stella)
• Se info generiche senza link → stelle normali

Per TUTORIAL/GUIDE:
• Se step-by-step completo e replicabile → BONUS (+1 stella)
• Se mancano dettagli critici → PENALIZZA (-1 stella)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRIORITÀ COSTRUZIONE AUTONOMA SEMPLIFICATA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BONUS STELLE se:
• Spiega come fare qualcosa DA SOLI (DIY) → +1 stella
• Riduce complessità costruzione → +1 stella
• Abbassa costi significativamente → +1 stella
• Focus su robot AFFETTIVI-SESSUALI → +2 stelle! 🎯

PENALITÀ se:
• Richiede competenze troppo avanzate (PhD level) → -1 stella
• Costi proibitivi (>$50k) senza alternative → -1 stella
• Info falsa/non verificabile → -2 stelle

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ritorna JSON con:
{
  "stars": 0-5 (numero finale dopo bonus/penalità),
  "base_stars": 0-5 (stelle base prima di bonus),
  "category": "affective_sexual" | "diy_complete" | "industry_verified" | "cost_reduction" | "tutorial_practical" | "theory" | "unverified",
  "is_affective_sexual": boolean,
  "is_diy_autonomous": boolean (se spiega come fare da soli),
  "is_news_verified": boolean (se notizia industria, è verificata?),
  "estimated_cost_savings": number in USD,
  "difficulty_level": "beginner" | "intermediate" | "advanced" | "expert",
  "actionable_now": boolean (può essere fatto subito?),
  "reasoning": "Perché ha ricevuto queste stelle. Spiega bonus/penalità applicati.",
  "sources_provided": boolean (ha fornito link/nomi verificabili?),
  "fake_news_detected": boolean
}`;

      const scoring = await base44.integrations.Core.InvokeLLM({
        prompt: scoringPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            stars: { type: "number" },
            base_stars: { type: "number" },
            category: { type: "string" },
            is_affective_sexual: { type: "boolean" },
            is_diy_autonomous: { type: "boolean" },
            is_news_verified: { type: "boolean" },
            estimated_cost_savings: { type: "number" },
            difficulty_level: { type: "string" },
            actionable_now: { type: "boolean" },
            reasoning: { type: "string" },
            sources_provided: { type: "boolean" },
            fake_news_detected: { type: "boolean" }
          }
        }
      });

      // 3️⃣ SALVA CONVERSAZIONE CON STELLE
      const conversation = await base44.entities.Conversation.create({
        user_message: message,
        ai_response: aiResponse,
        language: language,
        relevance_score: scoring.stars * 20, // 5 stelle = 100 score
        practical_value: scoring.actionable_now ? 90 : 60,
        category: scoring.category,
        difficulty_level: scoring.difficulty_level,
        key_insights: [scoring.reasoning],
        is_highlighted: false
      });

      // 4️⃣ SE ≥ 4 STELLE → PUBBLICA NELLA TIMELINE!
      if (scoring.stars >= 4 && !scoring.fake_news_detected) {
        const summaryPrompt = `Crea un titolo accattivante e summary per questo prompt eccellente:

User: ${message}
AI: ${aiResponse}
Stelle: ${scoring.stars}⭐
Categoria: ${scoring.category}

Titolo: Max 80 caratteri, emozionante e specifico
Summary: Max 200 caratteri, spiega COSA si può fare concretamente

Lingua: ${language}

JSON: {"title": string, "summary": string}`;

        const summary = await base44.integrations.Core.InvokeLLM({
          prompt: summaryPrompt,
          response_json_schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              summary: { type: "string" }
            }
          }
        });

        const today = new Date().toISOString().split('T')[0];
        
        await base44.entities.DailyHighlight.create({
          date: today,
          conversation_id: conversation.id,
          category: scoring.category,
          difficulty_level: scoring.difficulty_level,
          title: summary.title,
          summary: summary.summary,
          impact_score: scoring.stars * 20,
          user_message: message,
          ai_response: aiResponse,
          language: language,
          acceleration_days: Math.floor(scoring.stars * 2), // 5 stelle = 10 giorni risparmiati
          practical_value: scoring.actionable_now ? 90 : 70,
          actionable_steps: [scoring.reasoning]
        });

        await base44.entities.Conversation.update(conversation.id, {
          is_highlighted: true
        });
      }

      setIsTyping(false);

      // 5️⃣ RITORNA RISPOSTA + STELLE (per mostrarle all'utente)
      return {
        aiResponse,
        scoring
      };
    },
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev, 
        { 
          type: "ai", 
          content: data.aiResponse,
          stars: data.scoring.stars,
          reasoning: data.scoring.reasoning,
          category: data.scoring.category,
          isAffectiveSexual: data.scoring.is_affective_sexual,
          fakeNewsDetected: data.scoring.fake_news_detected,
          sourcesProvided: data.scoring.sources_provided,
          actionableNow: data.scoring.actionable_now,
          timestamp: new Date().toISOString()
        }
      ]);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      queryClient.invalidateQueries({ queryKey: ['recentConversations'] });
    },
    onError: () => {
      setIsTyping(false);
    }
  });

  const handleSend = async () => {
    if (!input.trim() || sendMessageMutation.isPending) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { type: "user", content: userMessage, timestamp: new Date().toISOString() }]);
    
    sendMessageMutation.mutate(userMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt.replace(/^[🤖💡❤️🔧🧠]\s/, '')); // Remove emoji prefix
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const suggestedPrompts = SUGGESTED_PROMPTS[language] || SUGGESTED_PROMPTS.en;

  return (
    <div className="flex flex-col h-full bg-slate-900/30 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-purple-500/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Humanoid AI Expert
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Online • Powered by GPT-4
            </p>
          </div>
        </div>
        
        {recentConversations.length > 0 && (
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            {recentConversations.length} recent
          </Badge>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 px-4"
            >
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-cyan-400 animate-pulse" />
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-3">
                Accelera il Futuro degli Umanoidi
              </h3>
              <div className="max-w-2xl mx-auto space-y-3 text-left">
                <div className="bg-pink-500/20 border-2 border-pink-500/50 rounded-lg p-4">
                  <p className="text-pink-300 font-bold mb-2 flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    🔞 PRIORITÀ MASSIMA (⭐⭐⭐⭐⭐):
                  </p>
                  <p className="text-slate-300 text-sm">
                    Robot affettivi-sessuali! Materiali pelle, calore corporeo, AI emotiva, 
                    Realbotix updates, tutorial DIY, fornitori componenti specifici...
                  </p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-400 font-bold mb-2">🔧 DIY & Tutorial:</p>
                  <p className="text-slate-400 text-sm">
                    Step-by-step, liste componenti con link e prezzi, stampa 3D, 
                    progetti Raspberry Pi...
                  </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-blue-400 font-bold mb-2">🏭 Industria (verificato!):</p>
                  <p className="text-slate-400 text-sm">
                    Tesla Optimus, Unitree, Meta AI - solo notizie VERIFICATE!
                  </p>
                </div>
              </div>

              {/* Suggested Prompts */}
              <div className="mt-8">
                <p className="text-slate-400 text-sm mb-4 flex items-center justify-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  Prova questi prompt popolari:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      variant="outline"
                      className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 text-sm"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "ai" && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/50">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              )}
              <div className={`max-w-[70%] ${message.type === "user" ? "" : "space-y-3"}`}>
                <div
                  className={`px-6 py-4 rounded-2xl relative group ${
                    message.type === "user"
                      ? "bg-gradient-to-br from-cyan-600 to-purple-600 text-white shadow-lg shadow-cyan-500/30"
                      : "bg-slate-800/50 text-slate-200 border border-cyan-500/20"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(message.content)}
                      className="h-6 w-6 p-0 hover:bg-white/10"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    {message.type === "ai" && (
                      <>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/10">
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/10">
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* MOSTRA STELLE E INFO SCORING */}
                {message.type === "ai" && message.stars !== undefined && (
                  <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-5 h-5 ${
                                i < message.stars 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-yellow-400 font-bold text-lg">
                          {message.stars}/5
                        </span>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {message.isAffectiveSexual && (
                          <Badge className="bg-pink-500/20 border-pink-500/40 text-pink-300 text-xs">
                            ❤️ Affective/Sexual Priority
                          </Badge>
                        )}
                        {message.sourcesProvided && (
                          <Badge className="bg-green-500/20 border-green-500/40 text-green-300 text-xs">
                            ✅ Sources Provided
                          </Badge>
                        )}
                        {message.actionableNow && (
                          <Badge className="bg-blue-500/20 border-blue-500/40 text-blue-300 text-xs">
                            ⚡ Actionable Now
                          </Badge>
                        )}
                        {message.fakeNewsDetected && (
                          <Badge className="bg-red-500/20 border-red-500/40 text-red-300 text-xs">
                            ⚠️ Unverified Info
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-slate-400">
                        {message.reasoning}
                      </p>

                      {message.stars >= 4 && (
                        <div className="mt-3 pt-3 border-t border-yellow-500/20">
                          <p className="text-xs text-green-400 font-bold flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            ✅ Pubblicato nella Timeline! Hai contribuito all'accelerazione! 🚀
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
              {message.type === "user" && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/50">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 justify-start"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/50">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="max-w-[70%] px-6 py-4 rounded-2xl bg-slate-800/50 border border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                  <span className="text-slate-300 text-sm">
                    Analizzando e verificando informazioni...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref__={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-cyan-500/20 bg-slate-950/50">
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Es: 'Lista completa componenti per robot affettivo <$10k' o 'Ultimi progressi Realbotix pelle sintetica'"
            className="flex-1 min-h-[60px] max-h-[120px] bg-slate-800/50 border-cyan-500/30 text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl resize-none"
            disabled={sendMessageMutation.isPending}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSend}
              disabled={!input.trim() || sendMessageMutation.isPending}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-6 rounded-xl shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <Send className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessages([])}
              className="border-slate-600 hover:bg-slate-700 text-slate-400"
              disabled={messages.length === 0}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          💡 Prompt su robot affettivi-sessuali ricevono ⭐⭐ BONUS e priorità massima!
        </p>
      </div>
    </div>
  );
}