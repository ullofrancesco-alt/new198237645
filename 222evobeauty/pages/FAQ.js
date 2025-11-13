
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronDown, 
  ChevronUp, 
  Bot, 
  Rocket, 
  TrendingUp, 
  Users, 
  Coins,
  Heart,
  Zap,
  Globe,
  Home as HomeIcon,
  Car,
  Wrench,
  Brain,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageContext } from "../Layout"; // Import LanguageContext

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const { language } = React.useContext(LanguageContext); // Use LanguageContext to get the current language

  const faqData = {
    it: [
      {
        icon: <Rocket className="w-6 h-6" />,
        color: "cyan",
        question: "🚀 Cos'è Prompt4Future?",
        answer: `Prompt4Future è una piattaforma innovativa che accelera lo sviluppo di robot umanoidi attraverso l'intelligenza collettiva.

🎯 **La Nostra Missione:**
Portare l'umanità dalla fase "neonato" (2025) alla fase "adolescente" (2042) nello sviluppo di umanoidi completi, autonomi e socialmente integrati.

💡 **Come Funziona:**
1. Gli utenti fanno domande all'AI su qualsiasi aspetto degli umanoidi
2. L'AI risponde con conoscenze aggiornate da internet
3. Le conversazioni più utili diventano "highlight" nella timeline
4. La community vota su chi sarà il protagonista del prossimo breakthrough: grande player o sviluppatore medio-piccolo

🏆 **Risultato:**
Una knowledge base collettiva che accelera lo sviluppo di umanoidi, democratizzando l'accesso all'innovazione.`
      },
      {
        icon: <Bot className="w-6 h-6" />,
        color: "purple",
        question: "🤖 Che Tipi di Umanoidi Copriamo?",
        answer: `Copriamo TUTTI gli aspetti degli umanoidi e della robotica avanzata:

🏭 **Robotica Industriale:**
• Braccia robotiche per automazione
• Cobot collaborativi
• Robot per magazzini e logistica

🚗 **Mobilità Autonoma:**
• Robotaxi (Tesla, Waymo, Cruise)
• Veicoli autonomi per trasporto merci
• Droni delivery

🏠 **Robot Domestici:**
• Aspirapolvere intelligenti avanzati
• Robot cuochi e assistenti cucina
• Robot per pulizia e manutenzione casa

💊 **Care Robot:**
• Assistenza anziani e disabili
• Supporto riabilitazione
• Monitoraggio salute

❤️ **Umanoidi Affettivi e Sessuali:**
• Companion robot per solitudine
• Robot con intelligenza emotiva
• Realbotix e umanoidi estetici avanzati

🦾 **DIY e Maker:**
• Come costruire un umanoide da zero
• Dove comprare componenti economici
• Tutorial step-by-step per principianti`
      },
      {
        icon: <Brain className="w-6 h-6" />,
        color: "green",
        question: "💡 Come Funziona l'AI e la Selezione dei Prompt?",
        answer: `Il nostro sistema AI è il cuore pulsante di Prompt4Future:

🤖 **Cosa Fa l'AI:**
• Risponde a QUALSIASI domanda su umanoidi con conoscenze real-time da internet
• Analizza ogni conversazione per rilevanza e valore pratico
• Assegna un punteggio di "impact" e "practical value"
• Identifica breakthrough tecnologici e soluzioni DIY pratiche

📊 **Sistema di Scoring:**
• Relevance Score (0-100): quanto è rilevante per lo sviluppo umanoidi
• Practical Value (0-100): quanto è attuabile/utile l'informazione
• Difficulty Level: beginner, intermediate, advanced, expert, industry
• Acceleration Days: quanti giorni risparmiati se applicato

🏆 **Selezione Automatica:**
Ogni 24-36 ore, l'AI:
1. Analizza tutte le conversazioni delle ultime 24h
2. Seleziona quella con impact score più alto
3. Determina se è da "Grande Player" o "Sviluppatore Piccolo"
4. Pubblica nella timeline
5. Risolve automaticamente il betting pool

📈 **Risultato:**
Solo i prompt più utili finiscono nella timeline, creando una roadmap accelerata verso il 2042.`
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        color: "pink",
        question: "🎲 Come Funzionano i Pool di Scommesse?",
        answer: `I betting pools rendono Prompt4Future un gioco divertente e profittevole!

💰 **Meccanica Base:**
• Ogni 24-36 ore si apre un nuovo pool
• Domanda: "Chi sarà il protagonista del prossimo prompt vincente?"
• Opzione A: Grande Player (Tesla, Unitree, Meta, breakthrough industriali)
• Opzione B: Sviluppatore Piccolo (DIY, componenti, tutorial, budget builds)
• Quote fisse: 1.99x su entrambe le opzioni

🎯 **Come Scommettere:**
1. Scegli Opzione A o B
2. Scegli BACK (a favore) o LAY (contro)
3. Inserisci importo $BOT
4. Sistema detrae 5% commissione
5. Aspetta risoluzione (24-36h)
6. Se vinci: ricevi la tua puntata + vincita automaticamente!

🤖 **Risoluzione Automatica:**
• AI pubblica prompt migliore delle 24h
• Sistema determina se è Grande Player o Sviluppatore Piccolo
• Vincitori pagati automaticamente
• Pool chiuso e ne apre uno nuovo

💡 **Strategia:**
• Grande Player = più breakthrough, meno frequenti
• Sviluppatore Piccolo = più soluzioni pratiche, più frequenti
• Usa la timeline per capire i trend!`
      },
      {
        icon: <Coins className="w-6 h-6" />,
        color: "amber",
        question: "💎 Cos'è il Token $BOT?",
        answer: `$BOT è il token nativo di Prompt4Future su Polygon:

🪙 **Utilizzi:**
• Scommettere sui betting pools
• Futura governance della piattaforma
• Premi per contributi di valore
• Accesso a feature premium (futuro)

💳 **Come Ottenerlo:**
• Iniziale: 1000 $BOT gratis quando ti registri!
• Comprare con USDC (mini-exchange interno, 1 USDC = 100 $BOT)
• Vincere nei betting pools
• Contribuire con prompt di alto valore (future rewards)

🔗 **Dettagli Tecnici:**
• Network: Polygon (gas fee ~$0.01)
• Tipo: ERC-20
• Contract: 0xb0d2A7b1F1EC7D39409E1D671473020d20547B55
• Trasferibile: Sì, puoi depositare/prelevare

🚀 **Valore Futuro:**
Man mano che la piattaforma cresce, $BOT diventa più prezioso per accesso a:
• Feature esclusive
• AI models avanzati
• Early access a breakthrough
• Networking con builder di umanoidi`
      },
      {
        icon: <Calendar className="w-6 h-6" />,
        color: "blue",
        question: "🗓️ Timeline 2025 → 2042: Cosa Significa?",
        answer: `La timeline rappresenta il percorso dell'umanità verso umanoidi completi:

🍼 **2025 - Neonato (Ora):**
• Primi prototipi umanoidi (Tesla Optimus Gen 2, Unitree H1)
• Componenti costosi e inaccessibili
• Know-how limitato alla ricerca accademica
• Pochissimi possono costruire un umanoide funzionante

👶 **2028 - Bambino:**
• Umanoidi commerciali entry-level disponibili
• Componenti DIY più accessibili
• Tutorial e community maker attive
• Prime applicazioni pratiche (assistenza, logistica)

🧒 **2033 - Pre-adolescente:**
• Umanoidi in case private (early adopters)
• Kit DIY completi sotto $5,000
• Intelligenza emotiva di base funzionante
• Prime forme di "affetto" robot-umano

👦 **2038 - Adolescente:**
• Umanoidi in 10% delle case occidentali
• AI emotiva avanzata e vera empatia
• Accettazione sociale diffusa
• Prime relazioni umano-robot serie

👨 **2042 - Adulto (Goal):**
• Umanoidi completamente autonomi
• Costruibili da chiunque con conoscenze open-source
• Integrati socialmente e legalmente
• Nuova era dell'umanità assistita da umanoidi

🎯 **Prompt4Future Accelera Ogni Fase!**`
      },
      {
        icon: <Users className="w-6 h-6" />,
        color: "green",
        question: "👥 Chi Può Contribuire?",
        answer: `CHIUNQUE può contribuire a Prompt4Future, indipendentemente dal livello!

🔰 **Principianti Assoluti:**
• "Dove posso comprare un servo motore economico?"
• "Quanto costa costruire un umanoide base?"
• "Come si programma un Raspberry Pi per robotica?"
• "Quali sono i primi passi per iniziare?"

🔧 **Maker e Hobbisti:**
• "Ho stampato in 3D una mano robotica funzionante con materiali riciclati"
• "Alternativa economica ai sensori LIDAR costosi"
• "Tutorial assemblaggio braccio robotico DIY"

🏭 **Professionisti Industria:**
• "Novità Tesla Optimus dalla presentazione di ieri"
• "Breakthrough Unitree su locomozione bipede"
• "Meta annuncia nuovo AI model per robot emotivi"

💡 **Innovatori:**
• "Nuovo metodo per produrre pelle sintetica termoregolata"
• "Scoperto fornitore Raspberry Pi al 50% prezzo"
• "Algoritmo open-source per bilanciamento bipede"

❤️ **Appassionati Umanoidi Affettivi:**
• "Progressi Realbotix su espressioni facciali realistiche"
• "Studi psicologici su accettazione robot companion"
• "Tecnologie per simulare calore corporeo"

🎯 **Ogni Livello È Prezioso:**
Una domanda da principiante può rivelare un gap di mercato.
Una risposta da esperto può sbloccare centinaia di progetti.`
      },
      {
        icon: <Zap className="w-6 h-6" />,
        color: "yellow",
        question: "⚡ Come Acceleriamo Davvero lo Sviluppo?",
        answer: `Prompt4Future non è solo teoria - acceleriamo CONCRETAMENTE l'innovazione:

📚 **Knowledge Democratization:**
• Informazioni prima riservate a ricercatori → Ora accessibili a tutti
• Tutorial costosi → Ora gratis nella timeline
• Segreti industriali → Reverse-engineered dalla community

💰 **Cost Reduction:**
• Utente scopre fornitore Raspberry Pi a metà prezzo → Migliaia risparmiano
• Tutorial per stampare componenti in 3D → Costo umanoidi -70%
• Alternative open-source a sensori costosi → Innovazione accessibile

🤝 **Networking Accelerato:**
• Maker in Italia trova supplier di servo motori in Cina
• Programmatore incontra mechanical engineer
• Investitore scopre startup promettente
• = Progetti che nascono + velocemente

🧠 **Collective Problem Solving:**
• Problema A bloccato da mesi → Community trova soluzione in 1 settimana
• Algoritmo complesso → Qualcuno lo semplifica
• Bug oscuro → Sviluppatore riconosce pattern simile

🏆 **Competition Effect:**
• Grande Player annuncia breakthrough → Community cerca di replicarlo
• Utente trova soluzione creativa → Ispira altre soluzioni
• Betting crea hype → Più persone si interessano e contribuiscono

📈 **Effetto Composto:**
Ogni giorno risparmiato = accelerazione esponenziale
1 utente risparmia 1 giorno → 1000 utenti risparmiano 1000 giorni collettivi
= Arriviamo al 2042 goal in 10-12 anni invece di 17!`
      },
      {
        icon: <Heart className="w-6 h-6" />,
        color: "red",
        question: "❤️ Umanoidi Affettivi e Sessuali: Perché Ne Parliamo?",
        answer: `Affrontiamo questo tema SERIAMENTE e SCIENTIFICAMENTE perché è cruciale:

🎯 **Realtà vs Tabù:**
• Solitudine epidemica nel mondo occidentale
• Calo natalità drammatico in tutti i paesi sviluppati
• Isolamento sociale in aumento
• Gli umanoidi affettivi sono una risposta, non una perversione

🧬 **Aspetti Tecnologici Unici:**
• Pelle sintetica termoregolata (sfida materiali)
• Intelligenza emotiva avanzata (AI emotiva)
• Espressioni facciali micro-realistic (robotica fine)
• Touch sensors sensibili (sensoristica avanzata)
• = Innovazioni che beneficiano TUTTI gli umanoidi

💊 **Applicazioni Terapeutiche:**
• Anziani soli che rifiutano badanti umane
• Persone con disabilità sociali (autismo, ansia)
• Riabilitazione emotiva post-trauma
• Sperimentazione sicura per giovani con difficoltà relazionali

🌍 **Impatto Sociale:**
• Giappone e Corea già leader (40% popolazione single)
• Occidente seguirà entro 5-10 anni
• Mercato multi-miliardario in formazione
• Chi innova ora dominerà il mercato futuro

🔬 **Focus Scientifico:**
NON parliamo di pornografia.
Parliamo di:
• Materiali bio-compatibili
• AI conversazionale emotivamente intelligente
• Movimenti fluidi e naturali
• Calore corporeo simulato
• Respiro e battito cardiaco simulati

💡 **Prompt Tipici:**
• "Progressi nella pelle sintetica realistica"
• "Realbotix vs altre aziende umanoidi affettivi"
• "Accettazione sociale robot companion in Europa"
• "Tecnologie per simulare intimità emotiva"

🚀 **Perché È Cruciale:**
Gli umanoidi affettivi spingono l'innovazione su:
- Realismo estetico (beneficia protesi mediche)
- AI emotiva (beneficia care robot)
- Materiali soft (beneficia robot sicuri per bambini)
= Win-win per tutta l'industria robotica!`
      },
      {
        icon: <Wrench className="w-6 h-6" />,
        color: "orange",
        question: "🔧 Posso Davvero Costruire un Umanoide da Solo?",
        answer: `SÌ! E Prompt4Future è qui per guidarti passo-passo:

📚 **Livello 1 - Assoluto Principiante (Budget: $100-300):**
• Inizia con Arduino + servo motori base
• Costruisci una mano robotica funzionante
• Impara i fondamenti: PWM, sensori, alimentazione
• Timeline ti mostra tutorial verificati dalla community

🔧 **Livello 2 - Maker Intermedio (Budget: $500-1500):**
• Raspberry Pi + motori stepper + sensori LIDAR
• Costruisci un braccio robotico completo
• Integra telecamere per computer vision
• Programmazione Python/ROS base

🦾 **Livello 3 - Builder Avanzato (Budget: $2000-5000):**
• Telaio completo stampato in 3D
• Sistema di locomozione bipede
• Multiple articolazioni con 20+ servo motori
• AI per bilanciamento e movimento

🤖 **Livello 4 - Umanoide Completo (Budget: $8000-15000):**
• Corpo completo antropomorfo
• AI conversazionale integrata
• Autonomia 4-6 ore
• Capacità di afferrare oggetti e navigare casa

💡 **Prompt4Future Ti Aiuta Con:**
• Lista completa componenti con link fornitori economici
• Tutorial video step-by-step
• Troubleshooting problemi comuni
• Community per supporto real-time
• Alternative low-cost a componenti costosi

🏆 **Storie di Successo:**
• Marco (Italia): costruito braccio robotico con €200
• Chen (Cina): umanoide bipede funzionante con $3500
• Sarah (USA): robot companion per nonna anziana, $5000

🚀 **2025 vs 2042:**
• Oggi: Serve competenza ingegneristica
• 2030: Kit semi-assemblati disponibili
• 2035: "IKEA degli umanoidi" - assemblaggio in 1 weekend
• 2042: Open-source completo, costruibile da chiunque

📖 **Inizia Oggi:**
Vai su Timeline → Filtra "DIY Beginner" → Segui i prompt più votati!`
      },
      {
        icon: <Globe className="w-6 h-6" />,
        color: "indigo",
        question: "🌍 È Solo per Esperti o per Tutti?",
        answer: `PER TUTTI! Abbiamo utenti da ogni background:

👨‍💻 **Sviluppatori Software:**
• Contribuiscono con AI algorithms
• Programmazione robot behavior
• Computer vision e ML models

🔩 **Ingegneri Meccanici:**
• Design di giunture e strutture
• Materiali innovativi
• Ottimizzazione peso/potenza

🎨 **Designer e Maker:**
• Estetica umanoidi
• Stampa 3D e prototipazione
• User experience interaction

🧪 **Ricercatori Accademici:**
• Pubblicazioni e breakthrough
• Teoria della locomozione
• Neuroscienze applicate

💼 **Investitori e Business:**
• Scouting startup promettenti
• Analisi mercato umanoidi
• Trend tecnologici

👵 **Persone Comuni Interessate:**
• "Voglio un robot che aiuti mia nonna"
• "Sono solo, vorrei un companion robot"
• "Curioso di capire quando saranno disponibili"

🎓 **Studenti:**
• Imparano robotica pratica
• Trovano progetti per tesi
• Networking con professionisti

🏭 **Lavoratori Industria:**
• "La mia fabbrica sta automatizzando, voglio capire"
• "Come prepararmi al futuro del lavoro?"
• "Opportunità in settore robotica?"

🎯 **Non Serve Essere Esperti:**
• Le domande semplici rivelano gap di mercato
• La curiosità guida l'innovazione
• Ogni prospettiva aggiunge valore

💬 **Esempi di Contributi Preziosi:**
• Nonna: "Vorrei un robot che mi ricordi le medicine" → Ispira startup care robot
• Studente: "Dove trovo tutorial gratuiti?" → Community crea corso open-source
• Investitore: "Quali aziende investire?" → Analisi mercato che aiuta tutti
• Maker: "Ho stampato componente a €5 invece di €50" → Migliaia risparmiano

🌟 **Motto di Prompt4Future:**
"L'innovazione viene dal basso, non solo dai laboratori"

Chiunque può accelerare il futuro degli umanoidi! 🚀`
      }
    ],
    en: [
      {
        icon: <Rocket className="w-6 h-6" />,
        color: "cyan",
        question: "🚀 What is Prompt4Future?",
        answer: `Prompt4Future is an innovative platform accelerating humanoid robot development through collective intelligence.

🎯 **Our Mission:**
Take humanity from "newborn" stage (2025) to "adolescent" stage (2042) in developing complete, autonomous, and socially integrated humanoids.

💡 **How It Works:**
1. Users ask AI about any aspect of humanoids
2. AI responds with updated knowledge from the internet
3. Most useful conversations become "highlights" in timeline
4. Community bets on who will be next breakthrough protagonist: big player or small developer

🏆 **Result:**
A collective knowledge base accelerating humanoid development, democratizing access to innovation.`
      },
      {
        icon: <Bot className="w-6 h-6" />,
        color: "purple",
        question: "🤖 What Types of Humanoids Do We Cover?",
        answer: `We cover ALL aspects of humanoids and advanced robotics:

🏭 **Industrial Robotics:**
• Robotic arms for automation
• Collaborative cobots
• Warehouse and logistics robots

🚗 **Autonomous Mobility:**
• Robotaxis (Tesla, Waymo, Cruise)
• Autonomous freight vehicles
• Delivery drones

🏠 **Home Robots:**
• Advanced smart vacuum cleaners
• Cooking and kitchen assistant robots
• House cleaning and maintenance robots

💊 **Care Robots:**
• Elderly and disabled assistance
• Rehabilitation support
• Health monitoring

❤️ **Affective and Sexual Humanoids:**
• Companion robots for loneliness
• Emotionally intelligent robots
• Realbotix and advanced aesthetic humanoids

🦾 **DIY and Maker:**
• How to build a humanoid from scratch
• Where to buy cheap components
• Step-by-step tutorials for beginners`
      },
      {
        icon: <Brain className="w-6 h-6" />,
        color: "green",
        question: "💡 How Does AI and Prompt Selection Work?",
        answer: `Our AI system is the beating heart of Prompt4Future:

🤖 **What the AI Does:**
• Answers ANY question about humanoids with real-time knowledge from the internet
• Analyzes every conversation for relevance and practical value
• Assigns an "impact" and "practical value" score
• Identifies technological breakthroughs and practical DIY solutions

📊 **Scoring System:**
• Relevance Score (0-100): how relevant it is for humanoid development
• Practical Value (0-100): how actionable/useful the information is
• Difficulty Level: beginner, intermediate, advanced, expert, industry
• Acceleration Days: how many days saved if applied

🏆 **Automatic Selection:**
Every 24-36 hours, the AI:
1. Analyzes all conversations from the last 24h
2. Selects the one with the highest impact score
3. Determines if it's from a "Big Player" or "Small Developer"
4. Publishes it to the timeline
5. Automatically settles the betting pool

📈 **Result:**
Only the most useful prompts end up in the timeline, creating an accelerated roadmap towards 2042.`
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        color: "pink",
        question: "🎲 How Do Betting Pools Work?",
        answer: `Betting pools make Prompt4Future a fun and profitable game!

💰 **Basic Mechanics:**
• A new pool opens every 24-36 hours
• Question: "Who will be the protagonist of the next winning prompt?"
• Option A: Big Player (Tesla, Unitree, Meta, industrial breakthroughs)
• Option B: Small Developer (DIY, components, tutorials, budget builds)
• Fixed odds: 1.99x on both options

🎯 **How to Bet:**
1. Choose Option A or B
2. Choose BACK (for) or LAY (against)
3. Enter $BOT amount
4. System deducts 5% commission
5. Wait for resolution (24-36h)
6. If you win: receive your stake + winnings automatically!

🤖 **Automatic Resolution:**
• AI publishes the best prompt of the 24h
• System determines if it's a Big Player or Small Developer
• Winners paid automatically
• Pool closes and a new one opens

💡 **Strategy:**
• Big Player = more breakthroughs, less frequent
• Small Developer = more practical solutions, more frequent
• Use the timeline to understand trends!
`
      },
      {
        icon: <Coins className="w-6 h-6" />,
        color: "amber",
        question: "💎 What is the $BOT Token?",
        answer: `$BOT is Prompt4Future's native token on Polygon:

🪙 **Uses:**
• Betting on betting pools
• Future platform governance
• Rewards for valuable contributions
• Access to premium features (future)

💳 **How to Get It:**
• Initial: 1000 $BOT free when you register!
• Buy with USDC (internal mini-exchange, 1 USDC = 100 $BOT)
• Win in betting pools
• Contribute with high-value prompts (future rewards)

🔗 **Technical Details:**
• Network: Polygon (gas fee ~$0.01)
• Type: ERC-20
• Contract: 0xb0d2A7b1F1EC7D39409E1D671473020d20547B55
• Transferable: Yes, you can deposit/withdraw

🚀 **Future Value:**
As the platform grows, $BOT becomes more valuable for access to:
• Exclusive features
• Advanced AI models
• Early access to breakthroughs
• Networking with humanoid builders`
      },
      {
        icon: <Calendar className="w-6 h-6" />,
        color: "blue",
        question: "🗓️ Timeline 2025 → 2042: What Does It Mean?",
        answer: `The timeline represents humanity's journey towards complete humanoids:

🍼 **2025 - Newborn (Now):**
• First humanoid prototypes (Tesla Optimus Gen 2, Unitree H1)
• Expensive and inaccessible components
• Know-how limited to academic research
• Very few can build a functional humanoid

👶 **2028 - Child:**
• Entry-level commercial humanoids available
• More accessible DIY components
• Active tutorials and maker communities
• First practical applications (assistance, logistics)

🧒 **2033 - Pre-teen:**
• Humanoids in private homes (early adopters)
• Complete DIY kits under $5,000
• Basic emotional intelligence functioning
• First forms of robot-human "affection"

👦 **2038 - Teenager:**
• Humanoids in 10% of Western homes
• Advanced emotional AI and true empathy
• Widespread social acceptance
• First serious human-robot relationships

👨 **2042 - Adult (Goal):**
• Fully autonomous humanoids
• Buildable by anyone with open-source knowledge
• Socially and legally integrated
• New era of humanity assisted by humanoids

🎯 **Prompt4Future Accelerates Every Phase!**`
      },
      {
        icon: <Users className="w-6 h-6" />,
        color: "green",
        question: "👥 Who Can Contribute?",
        answer: `ANYONE can contribute to Prompt4Future, regardless of skill level!

🔰 **Absolute Beginners:**
• "Where can I buy a cheap servo motor?"
• "How much does it cost to build a basic humanoid?"
• "How do I program a Raspberry Pi for robotics?"
• "What are the first steps to get started?"

🔧 **Makers and Hobbyists:**
• "I 3D printed a functional robotic hand with recycled materials"
• "Economical alternative to expensive LIDAR sensors"
• "DIY robotic arm assembly tutorial"

🏭 **Industry Professionals:**
• "Latest Tesla Optimus news from yesterday's presentation"
• "Unitree breakthrough in bipedal locomotion"
• "Meta announces new AI model for emotional robots"

💡 **Innovators:**
• "New method for producing thermoregulated synthetic skin"
• "Discovered Raspberry Pi supplier at 50% price"
• "Open-source algorithm for bipedal balancing"

❤️ **Affective Humanoid Enthusiasts:**
• "Realbotix progress on realistic facial expressions"
• "Psychological studies on companion robot acceptance"
• "Technologies for simulating body heat"

🎯 **Every Level Is Valuable:**
A beginner's question can reveal a market gap.
An expert's answer can unlock hundreds of projects.`
      },
      {
        icon: <Zap className="w-6 h-6" />,
        color: "yellow",
        question: "⚡ How Do We Really Accelerate Development?",
        answer: `Prompt4Future isn't just theory - we CONCRETELY accelerate innovation:

📚 **Knowledge Democratization:**
• Information previously reserved for researchers → Now accessible to everyone
• Expensive tutorials → Now free in the timeline
• Industrial secrets → Reverse-engineered by the community

💰 **Cost Reduction:**
• User discovers Raspberry Pi supplier at half price → Thousands save money
• Tutorial for 3D printing components → Humanoid cost -70%
• Open-source alternatives to expensive sensors → Accessible innovation

🤝 **Accelerated Networking:**
• Maker in Italy finds servo motor supplier in China
• Programmer meets mechanical engineer
• Investor discovers promising startup
• = Projects born faster

🧠 **Collective Problem Solving:**
• Problem A stuck for months → Community finds solution in 1 week
• Complex algorithm → Someone simplifies it
• Obscure bug → Developer recognizes similar pattern

🏆 **Competition Effect:**
• Big Player announces breakthrough → Community tries to replicate it
• User finds creative solution → Inspires other solutions
• Betting creates hype → More people get interested and contribute

📈 **Compound Effect:**
Every day saved = exponential acceleration
1 user saves 1 day → 1000 users save 1000 collective days
= We reach the 2042 goal in 10-12 years instead of 17!`
      },
      {
        icon: <Heart className="w-6 h-6" />,
        color: "red",
        question: "❤️ Affective and Sexual Humanoids: Why Do We Talk About Them?",
        answer: `We address this topic SERIOUSLY and SCIENTIFICALLY because it is crucial:

🎯 **Reality vs. Taboo:**
• Epidemic loneliness in the Western world
• Dramatic birth rate decline in all developed countries
• Increasing social isolation
• Affective humanoids are a response, not a perversion

🧬 **Unique Technological Aspects:**
• Thermoregulated synthetic skin (material challenge)
• Advanced emotional intelligence (emotional AI)
• Micro-realistic facial expressions (fine robotics)
• Sensitive touch sensors (advanced sensing)
• = Innovations that benefit ALL humanoids

💊 **Therapeutic Applications:**
• Lonely seniors who refuse human caregivers
• People with social disabilities (autism, anxiety)
• Post-trauma emotional rehabilitation
• Safe experimentation for young people with relational difficulties

🌍 **Social Impact:**
• Japan and Korea already leaders (40% single population)
• West will follow within 5-10 years
• Multi-billion dollar market in formation
• Those who innovate now will dominate the future market

🔬 **Scientific Focus:**
We are NOT talking about pornography.
We are talking about:
• Bio-compatible materials
• Emotionally intelligent conversational AI
• Fluid and natural movements
• Simulated body heat
• Simulated breathing and heartbeat

💡 **Typical Prompts:**
• "Advances in realistic synthetic skin"
• "Realbotix vs. other affective humanoid companies"
• "Social acceptance of companion robots in Europe"
• "Technologies for simulating emotional intimacy"

🚀 **Why It's Crucial:**
Affective humanoids push innovation in:
- Aesthetic realism (benefits medical prosthetics)
- Emotional AI (benefits care robots)
- Soft materials (benefits safe robots for children)
= Win-win for the entire robotics industry!`
      },
      {
        icon: <Wrench className="w-6 h-6" />,
        color: "orange",
        question: "🔧 Can I Really Build a Humanoid Myself?",
        answer: `YES! And Prompt4Future is here to guide you step-by-step:

📚 **Level 1 - Absolute Beginner (Budget: $100-300):**
• Start with Arduino + basic servo motors
• Build a functional robotic hand
• Learn the fundamentals: PWM, sensors, power supply
• Timeline shows you community-verified tutorials

🔧 **Level 2 - Intermediate Maker (Budget: $500-1500):**
• Raspberry Pi + stepper motors + LIDAR sensors
• Build a complete robotic arm
• Integrate cameras for computer vision
• Basic Python/ROS programming

🦾 **Level 3 - Advanced Builder (Budget: $2000-5000):**
• Full 3D printed frame
• Bipedal locomotion system
• Multiple joints with 20+ servo motors
• AI for balancing and movement

🤖 **Level 4 - Complete Humanoid (Budget: $8000-15000):**
• Full anthropomorphic body
• Integrated conversational AI
• 4-6 hours autonomy
• Ability to grasp objects and navigate home

💡 **Prompt4Future Helps You With:**
• Complete component list with links to cheap suppliers
• Step-by-step video tutorials
• Troubleshooting common problems
• Community for real-time support
• Low-cost alternatives to expensive components

🏆 **Success Stories:**
• Marco (Italy): built a robotic arm for €200
• Chen (China): functional bipedal humanoid for $3500
• Sarah (USA): companion robot for elderly grandma, $5000

🚀 **2025 vs. 2042:**
• Today: Requires engineering expertise
• 2030: Semi-assembled kits available
• 2035: "IKEA of humanoids" - assembly in 1 weekend
• 2042: Fully open-source, buildable by anyone

📖 **Start Today:**
Go to Timeline → Filter "DIY Beginner" → Follow the most voted prompts!`
      },
      {
        icon: <Globe className="w-6 h-6" />,
        color: "indigo",
        question: "🌍 Is It Only for Experts or for Everyone?",
        answer: `FOR EVERYONE! We have users from every background:

👨‍💻 **Software Developers:**
• Contribute with AI algorithms
• Programming robot behavior
• Computer vision and ML models

🔩 **Mechanical Engineers:**
• Design of joints and structures
• Innovative materials
• Weight/power optimization

🎨 **Designers and Makers:**
• Humanoid aesthetics
• 3D printing and prototyping
• User interaction experience

🧪 **Academic Researchers:**
• Publications and breakthroughs
• Locomotion theory
• Applied neuroscience

💼 **Investors and Business:**
• Scouting promising startups
• Humanoid market analysis
• Technological trends

👵 **Ordinary People Interested:**
• "I want a robot to help my grandmother"
• "I'm lonely, I'd like a companion robot"
• "Curious to know when they'll be available"

🎓 **Students:**
• Learn practical robotics
• Find thesis projects
• Networking with professionals

🏭 **Industry Workers:**
• "My factory is automating, I want to understand"
• "How to prepare for the future of work?"
• "Opportunities in the robotics sector?"

🎯 **No Need to Be an Expert:**
• Simple questions reveal market gaps
• Curiosity drives innovation
• Every perspective adds value

💬 **Examples of Valuable Contributions:**
• Grandmother: "I'd like a robot to remind me of my medicine" → Inspires care robot startup
• Student: "Where can I find free tutorials?" → Community creates open-source course
• Investor: "Which companies to invest in?" → Market analysis that helps everyone
• Maker: "I 3D printed a component for €5 instead of €50" → Thousands save money

🌟 **Prompt4Future Motto:**
"Innovation comes from the bottom up, not just from laboratories"

Anyone can accelerate the future of humanoids! 🚀`
      }
    ],
    es: [
      {
        icon: <Rocket className="w-6 h-6" />,
        color: "cyan",
        question: "🚀 ¿Qué es Prompt4Future?",
        answer: `Prompt4Future es una plataforma innovadora que acelera el desarrollo de robots humanoides a través de la inteligencia colectiva.

🎯 **Nuestra Misión:**
Llevar a la humanidad de la fase "recién nacido" (2025) a la fase "adolescente" (2042) en el desarrollo de humanoides completos, autónomos y socialmente integrados.

💡 **Cómo Funciona:**
1. Los usuarios hacen preguntas a la IA sobre cualquier aspecto de los humanoides
2. La IA responde con conocimientos actualizados de internet
3. Las conversaciones más útiles se convierten en "destacados" en la línea de tiempo
4. La comunidad vota quién será el protagonista del próximo avance: gran jugador o pequeño desarrollador

🏆 **Resultado:**
Una base de conocimiento colectivo que acelera el desarrollo de humanoides, democratizando el acceso a la innovación.`
      },
      {
        icon: <Bot className="w-6 h-6" />,
        color: "purple",
        question: "🤖 ¿Qué Tipos de Humanoides Cubrimos?",
        answer: `Cubrimos TODOS los aspectos de los humanoides y la robótica avanzada:

🏭 **Robótica Industrial:**
• Brazos robóticos para automatización
• Cobots colaborativos
• Robots para almacenes y logística

🚗 **Movilidad Autónoma:**
• Robotaxis (Tesla, Waymo, Cruise)
• Vehículos autónomos para transporte de mercancías
• Drones de entrega

🏠 **Robots Domésticos:**
• Aspiradoras inteligentes avanzadas
• Robots cocineros y asistentes de cocina
• Robots para limpieza y mantenimiento del hogar

💊 **Robots de Cuidado:**
• Asistencia a ancianos y discapacitados
• Soporte de rehabilitación
• Monitoreo de salud

❤️ **Humanoides Afectivos y Sexuales:**
• Robots compañeros para la soledad
• Robots con inteligencia emocional
• Realbotix y humanoides estéticos avanzados

🦾 **DIY y Makers:**
• Cómo construir un humanoide desde cero
• Dónde comprar componentes económicos
• Tutoriales paso a paso para principiantes`
      },
      {
        icon: <Brain className="w-6 h-6" />,
        color: "green",
        question: "💡 ¿Cómo Funcionan la IA y la Selección de Prompts?",
        answer: `Nuestro sistema de IA es el corazón palpitante de Prompt4Future:

🤖 **Qué Hace la IA:**
• Responde CUALQUIER pregunta sobre humanoides con conocimientos en tiempo real de internet
• Analiza cada conversación por relevancia y valor práctico
• Asigna una puntuación de "impacto" y "valor práctico"
• Identifica avances tecnológicos y soluciones prácticas de bricolaje

📊 **Sistema de Puntuación:**
• Puntuación de Relevancia (0-100): cuán relevante es para el desarrollo de humanoides
• Valor Práctico (0-100): cuán aplicable/útil es la información
• Nivel de Dificultad: principiante, intermedio, avanzado, experto, industria
• Días de Aceleración: cuántos días se ahorran si se aplica

🏆 **Selección Automática:**
Cada 24-36 horas, la IA:
1. Analiza todas las conversaciones de las últimas 24h
2. Selecciona la que tiene la puntuación de impacto más alta
3. Determina si es de un "Gran Jugador" o "Pequeño Desarrollador"
4. Publica en la línea de tiempo
5. Resuelve automáticamente el fondo de apuestas

📈 **Resultado:**
Solo los prompts más útiles terminan en la línea de tiempo, creando una hoja de ruta acelerada hacia 2042.`
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        color: "pink",
        question: "🎲 ¿Cómo Funcionan los Fondos de Apuestas?",
        answer: `¡Los fondos de apuestas hacen de Prompt4Future un juego divertido y rentable!

💰 **Mecánica Básica:**
• Cada 24-36 horas se abre un nuevo fondo
• Pregunta: "¿Quién será el protagonista del próximo prompt ganador?"
• Opción A: Gran Jugador (Tesla, Unitree, Meta, avances industriales)
• Opción B: Pequeño Desarrollador (DIY, componentes, tutoriales, construcciones económicas)
• Cuotas fijas: 1.99x en ambas opciones

🎯 **Cómo Apostar:**
1. Elige la Opción A o B
2. Elige BACK (a favor) o LAY (en contra)
3. Ingresa la cantidad de $BOT
4. El sistema deduce una comisión del 5%
5. Espera la resolución (24-36h)
6. Si ganas: ¡recibe tu apuesta + ganancias automáticamente!

🤖 **Resolución Automática:**
• La IA publica el mejor prompt de las 24h
• El sistema determina si es un Gran Jugador o un Pequeño Desarrollador
• Los ganadores reciben el pago automáticamente
• El fondo se cierra y se abre uno nuevo

💡 **Estrategia:**
• Gran Jugador = más avances, menos frecuentes
• Pequeño Desarrollador = más soluciones prácticas, más frecuentes
• ¡Usa la línea de tiempo para entender las tendencias!`
      },
      {
        icon: <Coins className="w-6 h-6" />,
        color: "amber",
        question: "💎 ¿Qué es el Token $BOT?",
        answer: `$BOT es el token nativo de Prompt4Future en Polygon:

🪙 **Usos:**
• Apostar en los fondos de apuestas
• Futura gobernanza de la plataforma
• Recompensas por contribuciones valiosas
• Acceso a funciones premium (futuro)

💳 **Cómo Obtenerlo:**
• Inicial: ¡1000 $BOT gratis al registrarte!
• Comprar con USDC (mini-intercambio interno, 1 USDC = 100 $BOT)
• Ganar en los fondos de apuestas
• Contribuir con prompts de alto valor (recompensas futuras)

🔗 **Detalles Técnicos:**
• Red: Polygon (tarifa de gas ~ $0.01)
• Tipo: ERC-20
• Contrato: 0xb0d2A7b1F1EC7D39409E1D671473020d20547B55
• Transferible: Sí, puedes depositar/retirar

🚀 **Valor Futuro:**
A medida que la plataforma crece, $BOT se vuelve más valioso para acceder a:
• Funciones exclusivas
• Modelos avanzados de IA
• Acceso temprano a avances
• Networking con constructores de humanoides`
      },
      {
        icon: <Calendar className="w-6 h-6" />,
        color: "blue",
        question: "🗓️ Línea de Tiempo 2025 → 2042: ¿Qué Significa?",
        answer: `La línea de tiempo representa el viaje de la humanidad hacia humanoides completos:

🍼 **2025 - Recién Nacido (Ahora):**
• Primeros prototipos humanoides (Tesla Optimus Gen 2, Unitree H1)
• Componentes caros e inaccesibles
• Conocimiento limitado a la investigación académica
• Muy pocos pueden construir un humanoide funcional

👶 **2028 - Niño:**
• Humanoides comerciales de nivel de entrada disponibles
• Componentes de bricolaje más accesibles
• Tutoriales y comunidades de creadores activas
• Primeras aplicaciones prácticas (asistencia, logística)

🧒 **2033 - Pre-adolescente:**
• Humanoides en hogares privados (primeros adoptantes)
• Kits de bricolaje completos por debajo de $5,000
• Inteligencia emocional básica funcionando
• Primeras formas de "afecto" robot-humano

👦 **2038 - Adolescente:**
• Humanoides en el 10% de los hogares occidentales
• IA emocional avanzada y verdadera empatía
• Aceptación social generalizada
• Primeras relaciones humano-robot serias

👨 **2042 - Adulto (Meta):**
• Humanoides completamente autónomos
• Construibles por cualquier persona con conocimientos de código abierto
• Integrados social y legalmente
• Nueva era de la humanidad asistida por humanoides

🎯 **¡Prompt4Future Acelera Cada Fase!**`
      },
      {
        icon: <Users className="w-6 h-6" />,
        color: "green",
        question: "👥 ¿Quién Puede Contribuir?",
        answer: `¡CUALQUIERA puede contribuir a Prompt4Future, independientemente del nivel!

🔰 **Principiantes Absolutos:**
• "¿Dónde puedo comprar un servomotor barato?"
• "¿Cuánto cuesta construir un humanoide básico?"
• "¿Cómo programo un Raspberry Pi para robótica?"
• "¿Cuáles son los primeros pasos para empezar?"

🔧 **Makers y Aficionados:**
• "Imprimí en 3D una mano robótica funcional con materiales reciclados"
• "Alternativa económica a los costosos sensores LIDAR"
• "Tutorial de montaje de brazo robótico DIY"

🏭 **Profesionales de la Industria:**
• "Novedades de Tesla Optimus de la presentación de ayer"
• "Avance de Unitree en locomoción bípeda"
• "Meta anuncia nuevo modelo de IA para robots emocionales"

💡 **Innovadores:**
• "Nuevo método para producir piel sintética termorregulada"
• "Descubierto proveedor de Raspberry Pi al 50% del precio"
• "Algoritmo de código abierto para el equilibrio bípedo"

❤️ **Entusiastas de los Humanoides Afectivos:**
• "Avances de Realbotix en expresiones faciales realistas"
• "Estudios psicológicos sobre la aceptación de robots compañeros"
• "Tecnologías para simular el calor corporal"

🎯 **Cada Nivel Es Valioso:**
Una pregunta de principiante puede revelar una brecha en el mercado.
Una respuesta de experto puede desbloquear cientos de proyectos.`
      },
      {
        icon: <Zap className="w-6 h-6" />,
        color: "yellow",
        question: "⚡ ¿Cómo Aceleramos Realmente el Desarrollo?",
        answer: `Prompt4Future no es solo teoría, aceleramos CONCRETAMENTE la innovación:

📚 **Democratización del Conocimiento:**
• Información antes reservada a investigadores → Ahora accesible para todos
• Tutoriales caros → Ahora gratis en la línea de tiempo
• Secretos industriales → Ingeniería inversa por la comunidad

💰 **Reducción de Costos:**
• El usuario descubre un proveedor de Raspberry Pi a mitad de precio → Miles ahorran dinero
• Tutorial para imprimir componentes en 3D → Costo de humanoides -70%
• Alternativas de código abierto a sensores caros → Innovación accesible

🤝 **Networking Acelerado:**
• Un creador en Italia encuentra un proveedor de servomotores en China
• Un programador conoce a un ingeniero mecánico
• Un inversor descubre una startup prometedora
• = Proyectos que nacen más rápido

🧠 **Resolución Colectiva de Problemas:**
• Problema A atascado durante meses → La comunidad encuentra una solución en 1 semana
• Algoritmo complejo → Alguien lo simplifica
• Error oscuro → Un desarrollador reconoce un patrón similar

🏆 **Efecto Competencia:**
• Gran Jugador anuncia un avance → La comunidad intenta replicarlo
• El usuario encuentra una solución creativa → Inspira otras soluciones
• Las apuestas crean expectación → Más personas se interesan y contribuyen

📈 **Efecto Compuesto:**
Cada día ahorrado = aceleración exponencial
1 usuario ahorra 1 día → 1000 usuarios ahorran 1000 días colectivos
= ¡Alcanzamos el objetivo de 2042 en 10-12 años en lugar de 17!`
      },
      {
        icon: <Heart className="w-6 h-6" />,
        color: "red",
        question: "❤️ Humanoides Afectivos y Sexuales: ¿Por Qué Hablamos de Ellos?",
        answer: `Abordamos este tema SERIAMENTE y CIENTÍFICAMENTE porque es crucial:

🎯 **Realidad vs. Tabú:**
• Soledad epidémica en el mundo occidental
• Disminución dramática de la natalidad en todos los países desarrollados
• Aumento del aislamiento social
• Los humanoides afectivos son una respuesta, no una perversión

🧬 **Aspectos Tecnológicos Únicos:**
• Piel sintética termorregulada (desafío de materiales)
• Inteligencia emocional avanzada (IA emocional)
• Expresiones faciales microrrealistas (robótica fina)
• Sensores táctiles sensibles (sensores avanzados)
• = Innovaciones que benefician a TODOS los humanoides

💊 **Aplicaciones Terapéuticas:**
• Ancianos solos que rechazan cuidadores humanos
• Personas con discapacidades sociales (autismo, ansiedad)
• Rehabilitación emocional postraumática
• Experimentación segura para jóvenes con dificultades relacionales

🌍 **Impacto Social:**
• Japón y Corea ya son líderes (40% de la población soltera)
• Occidente seguirá en 5-10 años
• Mercado multimillonario en formación
• Quienes innovan ahora dominarán el mercado futuro

🔬 **Enfoque Científico:**
NO hablamos de pornografía.
Hablamos de:
• Materiales biocompatibles
• IA conversacional emocionalmente inteligente
• Movimientos fluidos y naturales
• Calor corporal simulado
• Respiración y latido cardíaco simulados

💡 **Prompts Típicos:**
• "Avances en piel sintética realista"
• "Realbotix vs. otras empresas de humanoides afectivos"
• "Aceptación social de los robots compañeros en Europa"
• "Tecnologías para simular la intimidad emocional"

🚀 **Por Qué Es Crucial:**
Los humanoides afectivos impulsan la innovación en:
- Realismo estético (beneficia a las prótesis médicas)
- IA emocional (beneficia a los robots de cuidado)
- Materiales blandos (beneficia a los robots seguros para niños)
= ¡Ganar-ganar para toda la industria robótica!`
      },
      {
        icon: <Wrench className="w-6 h-6" />,
        color: "orange",
        question: "🔧 ¿Realmente Puedo Construir un Humanoide Yo Mismo?",
        answer: `¡SÍ! Y Prompt4Future está aquí para guiarte paso a paso:

📚 **Nivel 1 - Principiante Absoluto (Presupuesto: $100-300):**
• Comienza con Arduino + servomotores básicos
• Construye una mano robótica funcional
• Aprende los fundamentos: PWM, sensores, fuente de alimentación
• La línea de tiempo te muestra tutoriales verificados por la comunidad

🔧 **Nivel 2 - Creador Intermedio (Presupuesto: $500-1500):**
• Raspberry Pi + motores paso a paso + sensores LIDAR
• Construye un brazo robótico completo
• Integra cámaras para visión por computadora
• Programación básica en Python/ROS

🦾 **Nivel 3 - Constructor Avanzado (Presupuesto: $2000-5000):**
• Estructura completa impresa en 3D
• Sistema de locomoción bípeda
• Múltiples articulaciones con más de 20 servomotores
• IA para equilibrio y movimiento

🤖 **Nivel 4 - Humanoide Completo (Presupuesto: $8000-15000):**
• Cuerpo antropomórfico completo
• IA conversacional integrada
• Autonomía de 4-6 horas
• Capacidad para agarrar objetos y navegar por casa

💡 **Prompt4Future Te Ayuda Con:**
• Lista completa de componentes con enlaces a proveedores económicos
• Tutoriales en video paso a paso
• Solución de problemas comunes
• Comunidad para soporte en tiempo real
• Alternativas de bajo costo a componentes caros

🏆 **Historias de Éxito:**
• Marco (Italia): construyó un brazo robótico por 200€
• Chen (China): humanoide bípedo funcional por $3500
• Sarah (EE. UU.): robot compañero para su abuela, $5000

🚀 **2025 vs. 2042:**
• Hoy: Requiere experiencia en ingeniería
• 2030: Kits semi-ensamblados disponibles
• 2035: "IKEA de los humanoides" - ensamblaje en 1 fin de semana
• 2042: Código abierto completo, construible por cualquiera

📖 **Empieza Hoy:**
Ve a Línea de Tiempo → Filtra "Principiante DIY" → ¡Sigue los prompts más votados!`
      },
      {
        icon: <Globe className="w-6 h-6" />,
        color: "indigo",
        question: "🌍 ¿Es Solo Para Expertos o Para Todos?",
        answer: `¡PARA TODOS! Tenemos usuarios de todos los orígenes:

👨‍💻 **Desarrolladores de Software:**
• Contribuyen con algoritmos de IA
• Programación del comportamiento del robot
• Visión por computadora y modelos de ML

🔩 **Ingenieros Mecánicos:**
• Diseño de articulaciones y estructuras
• Materiales innovadores
• Optimización peso/potencia

🎨 **Diseñadores y Makers:**
• Estética humanoide
• Impresión 3D y prototipado
• Interacción de experiencia de usuario

🧪 **Investigadores Académicos:**
• Publicaciones y avances
• Teoría de la locomoción
• Neurociencia aplicada

💼 **Inversores y Empresas:**
• Búsqueda de startups prometedoras
• Análisis del mercado de humanoides
• Tendencias tecnológicas

👵 **Personas Comunes Interesadas:**
• "Quiero un robot que ayude a mi abuela"
• "Estoy solo, me gustaría un robot compañero"
• "Curioso por saber cuándo estarán disponibles"

🎓 **Estudiantes:**
• Aprenden robótica práctica
• Encuentran proyectos para tesis
• Networking con profesionales

🏭 **Trabajadores de la Industria:**
• "Mi fábrica se está automatizando, quiero entender"
• "¿Cómo prepararme para el futuro del trabajo?"
• "¿Oportunidades en el sector de la robótica?"

🎯 **No Necesitas Ser un Experto:**
• Las preguntas sencillas revelan lagunas en el mercado
• La curiosidad impulsa la innovación
• Cada perspectiva añade valor

💬 **Ejemplos de Contribuciones Valiosas:**
• Abuela: "Me gustaría un robot que me recordara mis medicamentos" → Inspira una startup de robots de cuidado
• Estudiante: "¿Dónde encuentro tutoriales gratuitos?" → La comunidad crea un curso de código abierto
• Inversor: "¿En qué empresas invertir?" → Análisis de mercado que ayuda a todos
• Creador: "Imprimí un componente por 5€ en lugar de 50€" → Miles ahorran dinero

🌟 **Lema de Prompt4Future:**
"La innovación viene desde abajo, no solo de los laboratorios"

¡Cualquiera puede acelerar el futuro de los humanoides! 🚀`
      }
    ],
    de: [
      {
        icon: <Rocket className="w-6 h-6" />,
        color: "cyan",
        question: "🚀 Was ist Prompt4Future?",
        answer: `Prompt4Future ist eine innovative Plattform, die die Entwicklung humanoider Roboter durch kollektive Intelligenz beschleunigt.

🎯 **Unsere Mission:**
Die Menschheit von der "Neugeborenen"-Phase (2025) in die "Adoleszenten"-Phase (2042) bei der Entwicklung vollständiger, autonomer und sozial integrierter Humanoiden zu führen.

💡 **So funktioniert's:**
1. Benutzer stellen der KI Fragen zu beliebigen Aspekten von Humanoiden
2. Die KI antwortet mit aktuellen Informationen aus dem Internet
3. Die nützlichsten Gespräche werden zu "Highlights" in der Zeitleiste
4. Die Community stimmt ab, wer der Protagonist des nächsten Durchbruchs sein wird: großer Akteur oder kleiner Entwickler

🏆 **Ergebnis:**
Eine kollektive Wissensbasis, die die Entwicklung von Humanoiden beschleunigt und den Zugang zu Innovationen demokratisiert.`
      },
      {
        icon: <Bot className="w-6 h-6" />,
        color: "purple",
        question: "🤖 Welche Arten von Humanoiden decken wir ab?",
        answer: `Wir decken ALLE Aspekte von Humanoiden und fortschrittlicher Robotik ab:

🏭 **Industrierobotik:**
• Roboterarme für die Automatisierung
• Kollaborative Cobots
• Roboter für Lager und Logistik

🚗 **Autonome Mobilität:**
• Robotaxis (Tesla, Waymo, Cruise)
• Autonome Frachtfahrzeuge
• Lieferdrohnen

🏠 **Haushaltsroboter:**
• Fortschrittliche intelligente Staubsauger
• Koch- und Küchenassistenzroboter
• Roboter für Hausreinigung und -wartung

💊 **Pflege-Roboter:**
• Unterstützung für ältere und behinderte Menschen
• Rehabilitationsunterstützung
• Gesundheitsüberwachung

❤️ **Affektive und sexuelle Humanoiden:**
• Begleitroboter gegen Einsamkeit
• Emotional intelligente Roboter
• Realbotix und fortschrittliche ästhetische Humanoiden

🦾 **DIY und Maker:**
• Wie man einen Humanoiden von Grund auf baut
• Wo man günstige Komponenten kaufen kann
• Schritt-für-Schritt-Anleitungen für Anfänger`
      },
      {
        icon: <Brain className="w-6 h-6" />,
        color: "green",
        question: "💡 Wie funktionieren KI und Prompt-Auswahl?",
        answer: `Unser KI-System ist das schlagende Herz von Prompt4Future:

🤖 **Was die KI tut:**
• Beantwortet JEDE Frage zu Humanoiden mit Echtzeitwissen aus dem Internet
• Analysiert jedes Gespräch auf Relevanz und praktischen Wert
• Weist einen "Impact"- und "Praktischen Wert"-Score zu
• Identifiziert technologische Durchbrüche und praktische DIY-Lösungen

📊 **Bewertungssystem:**
• Relevanz-Score (0-100): Wie relevant ist es für die Humanoidenentwicklung
• Praktischer Wert (0-100): Wie umsetzbar/nützlich ist die Information
• Schwierigkeitsgrad: Anfänger, Fortgeschrittener, Experte, Industrie
• Beschleunigungstage: Wie viele Tage werden bei Anwendung gespart

🏆 **Automatische Auswahl:**
Alle 24-36 Stunden, die KI:
1. Analysiert alle Gespräche der letzten 24 Stunden
2. Wählt das mit dem höchsten Impact-Score aus
3. Bestimmt, ob es von einem "großen Akteur" oder "kleinen Entwickler" stammt
4. Veröffentlicht es in der Zeitleiste
5. Löst den Wettpool automatisch auf

📈 **Ergebnis:**
Nur die nützlichsten Prompts landen in der Zeitleiste und schaffen eine beschleunigte Roadmap bis 2042.`
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        color: "pink",
        question: "🎲 Wie funktionieren Wettpools?",
        answer: `Wettpools machen Prompt4Future zu einem unterhaltsamen und profitablen Spiel!

💰 **Grundmechanik:**
• Alle 24-36 Stunden öffnet sich ein neuer Pool
• Frage: "Wer wird der Protagonist des nächsten Gewinner-Prompts sein?"
• Option A: Großer Akteur (Tesla, Unitree, Meta, industrielle Durchbrüche)
• Option B: Kleiner Entwickler (DIY, Komponenten, Tutorials, Budget-Builds)
• Feste Quoten: 1,99x auf beide Optionen

🎯 **So wetten Sie:**
1. Wählen Sie Option A oder B
2. Wählen Sie BACK (für) oder LAY (dagegen)
3. Geben Sie den $BOT-Betrag ein
4. Das System zieht 5% Provision ab
5. Warten Sie auf die Auflösung (24-36h)
6. Wenn Sie gewinnen: Sie erhalten Ihren Einsatz + Gewinn automatisch!

🤖 **Automatische Auflösung:**
• Die KI veröffentlicht den besten Prompt der letzten 24 Stunden
• Das System bestimmt, ob es sich um einen großen Akteur oder einen kleinen Entwickler handelt
• Gewinner werden automatisch ausgezahlt
• Der Pool schließt und ein neuer öffnet sich

💡 **Strategie:**
• Großer Akteur = mehr Durchbrüche, weniger häufig
• Kleiner Entwickler = mehr praktische Lösungen, häufiger
• Nutzen Sie die Zeitleiste, um Trends zu verstehen!`
      },
      {
        icon: <Coins className="w-6 h-6" />,
        color: "amber",
        question: "💎 Was ist der $BOT Token?",
        answer: `$BOT ist der native Token von Prompt4Future auf Polygon:

🪙 **Verwendung:**
• Wetten auf Wettpools
• Zukünftige Plattform-Governance
• Belohnungen für wertvolle Beiträge
• Zugang zu Premium-Funktionen (zukünftig)

💳 **So erhalten Sie ihn:**
• Start: 1000 $BOT kostenlos bei der Registrierung!
• Kauf mit USDC (interner Mini-Exchange, 1 USDC = 100 $BOT)
• Gewinnen in Wettpools
• Beiträge mit hochwertigen Prompts (zukünftige Belohnungen)

🔗 **Technische Details:**
• Netzwerk: Polygon (Gasgebühr ~ $0,01)
• Typ: ERC-20
• Vertrag: 0xb0d2A7b1F1EC7D39409E1D671473020d20547B55
• Übertragbar: Ja, Sie können einzahlen/abheben

🚀 **Zukünftiger Wert:**
Wenn die Plattform wächst, wird $BOT wertvoller für den Zugang zu:
• Exklusive Funktionen
• Fortschrittliche KI-Modelle
• Frühzeitiger Zugang zu Durchbrüchen
• Networking mit Humanoiden-Entwicklern`
      },
      {
        icon: <Calendar className="w-6 h-6" />,
        color: "blue",
        question: "🗓️ Zeitleiste 2025 → 2042: Was bedeutet das?",
        answer: `Die Zeitleiste repräsentiert die Reise der Menschheit zu vollständigen Humanoiden:

🍼 **2025 - Neugeborenes (Jetzt):**
• Erste humanoide Prototypen (Tesla Optimus Gen 2, Unitree H1)
• Teure und unzugängliche Komponenten
• Know-how auf akademische Forschung beschränkt
• Nur sehr wenige können einen funktionierenden Humanoiden bauen

👶 **2028 - Kind:**
• Kommerzielle Einstiegs-Humanoiden verfügbar
• Zugänglichere DIY-Komponenten
• Aktive Tutorials und Maker-Communities
• Erste praktische Anwendungen (Assistenz, Logistik)

🧒 **2033 - Pre-Teenager:**
• Humanoiden in Privathaushalten (Early Adopters)
• Komplette DIY-Kits unter 5.000 $
• Grundlegende emotionale Intelligenz funktioniert
• Erste Formen der Roboter-Mensch-"Zuneigung"

👦 **2038 - Teenager:**
• Humanoiden in 10% der westlichen Haushalte
• Fortgeschrittene emotionale KI und echte Empathie
• Weit verbreitete soziale Akzeptanz
• Erste ernsthafte Mensch-Roboter-Beziehungen

👨 **2042 - Erwachsener (Ziel):**
• Vollständig autonome Humanoiden
• Von jedem mit Open-Source-Wissen baubar
• Sozial und rechtlich integriert
• Neue Ära der von Humanoiden unterstützten Menschheit

🎯 **Prompt4Future beschleunigt jede Phase!**`
      },
      {
        icon: <Users className="w-6 h-6" />,
        color: "green",
        question: "👥 Wer kann beitragen?",
        answer: `JEDER kann zu Prompt4Future beitragen, unabhängig vom Level!

🔰 **Absolute Anfänger:**
• "Wo kann ich einen günstigen Servomotor kaufen?"
• "Wie viel kostet der Bau eines einfachen Humanoiden?"
• "Wie programmiere ich einen Raspberry Pi für Robotik?"
• "Was sind die ersten Schritte, um anzufangen?"

🔧 **Maker und Hobbyisten:**
• "Ich habe eine funktionierende Roboterhand mit recycelten Materialien 3D-gedruckt"
• "Wirtschaftliche Alternative zu teuren LIDAR-Sensoren"
• "DIY-Roboterarm-Montageanleitung"

🏭 **Industrieprofis:**
• "Neues zu Tesla Optimus von der gestrigen Präsentation"
• "Unitree-Durchbruch bei der bipeden Fortbewegung"
• "Meta kündigt neues KI-Modell für emotionale Roboter an"

💡 **Innovatoren:**
• "Neue Methode zur Herstellung von thermoregulierter Kunsthaut"
• "Raspberry Pi-Lieferant zum halben Preis entdeckt"
• "Open-Source-Algorithmus für bipede Balance"

❤️ **Begeisterte für affektive Humanoiden:**
• "Realbotix-Fortschritte bei realistischen Gesichtsausdrücken"
• "Psychologische Studien zur Akzeptanz von Begleitrobotern"
• "Technologien zur Simulation von Körperwärme"

🎯 **Jedes Level ist wertvoll:**
Eine Anfängerfrage kann eine Marktlücke aufdecken.
Eine Expertenantwort kann Hunderte von Projekten freischalten.`
      },
      {
        icon: <Zap className="w-6 h-6" />,
        color: "yellow",
        question: "⚡ Wie beschleunigen wir die Entwicklung wirklich?",
        answer: `Prompt4Future ist nicht nur Theorie - wir beschleunigen die Innovation KONKRET:

📚 **Wissensdemokratisierung:**
• Informationen, die früher Forschern vorbehalten waren → Jetzt für alle zugänglich
• Teure Tutorials → Jetzt kostenlos in der Zeitleiste
• Industrielle Geheimnisse → Reverse Engineering durch die Community

💰 **Kostenreduzierung:**
• Benutzer entdeckt Raspberry Pi-Lieferanten zum halben Preis → Tausende sparen Geld
• Tutorial zum 3D-Druck von Komponenten → Humanoiden-Kosten -70%
• Open-Source-Alternativen zu teuren Sensoren → Zugängliche Innovation

🤝 **Beschleunigtes Networking:**
• Maker in Italien findet Servomotor-Lieferanten in China
• Programmierer trifft Maschinenbauingenieur
• Investor entdeckt vielversprechendes Startup
• = Projekte entstehen schneller

🧠 **Kollektive Problemlösung:**
• Problem A monatelang blockiert → Community findet Lösung in 1 Woche
• Komplexer Algorithmus → Jemand vereinfacht ihn
• Dunkler Fehler → Entwickler erkennt ähnliches Muster

🏆 **Wettbewerbseffekt:**
• Großer Akteur kündigt Durchbruch an → Community versucht, ihn zu replizieren
• Benutzer findet kreative Lösung → Inspiriert andere Lösungen
• Wetten erzeugen Hype → Mehr Menschen interessieren sich und tragen bei

📈 **Zinseszinseffekt:**
Jeder gesparte Tag = exponentielle Beschleunigung
1 Benutzer spart 1 Tag → 1000 Benutzer sparen 1000 kollektive Tage
= Wir erreichen das Ziel von 2042 in 10-12 Jahren statt in 17!`
      },
      {
        icon: <Heart className="w-6 h-6" />,
        color: "red",
        question: "❤️ Affektive und sexuelle Humanoiden: Warum sprechen wir darüber?",
        answer: `Wir behandeln dieses Thema ERNSTHAFT und WISSENSCHAFTLICH, weil es entscheidend ist:

🎯 **Realität vs. Tabu:**
• Epidemische Einsamkeit in der westlichen Welt
• Dramatischer Geburtenrückgang in allen entwickelten Ländern
• Zunehmende soziale Isolation
• Affektive Humanoiden sind eine Antwort, keine Perversion

🧬 **Einzigartige technologische Aspekte:**
• Thermoregulierte Kunsthaut (Materialherausforderung)
• Fortgeschrittene emotionale Intelligenz (emotionale KI)
• Mikrorealistische Gesichtsausdrücke (Feinrobotik)
• Empfindliche Berührungssensoren (fortschrittliche Sensorik)
• = Innovationen, die ALLEN Humanoiden zugute kommen

💊 **Therapeutische Anwendungen:**
• Einsame Senioren, die menschliche Pflegekräfte ablehnen
• Menschen mit sozialen Behinderungen (Autismus, Angst)
• Emotionale Rehabilitation nach Traumata
• Sichere Experimente für junge Menschen mit Beziehungsschwierigkeiten

🌍 **Soziale Auswirkungen:**
• Japan und Korea sind bereits führend (40% der Bevölkerung Single)
• Der Westen wird in 5-10 Jahren folgen
• Multi-Milliarden-Dollar-Markt in Entstehung
• Wer jetzt innoviert, wird den zukünftigen Markt beherrschen

🔬 **Wissenschaftlicher Fokus:**
Wir sprechen NICHT über Pornografie.
Wir sprechen über:
• Biokompatible Materialien
• Emotional intelligente Konversations-KI
• Flüssige und natürliche Bewegungen
• Simulierte Körperwärme
• Simuliertes Atmen und Herzschlag

💡 **Typische Prompts:**
• "Fortschritte bei realistischer Kunsthaut"
• "Realbotix vs. andere affektive Humanoiden-Unternehmen"
• "Soziale Akzeptanz von Begleitrobotern in Europa"
• "Technologien zur Simulation emotionaler Intimität"

🚀 **Warum es entscheidend ist:**
Affektive Humanoiden treiben Innovationen voran in:
- Ästhetischem Realismus (Nutzen für medizinische Prothesen)
- Emotionaler KI (Nutzen für Pflegeroboter)
- Weichen Materialien (Nutzen für sichere Roboter für Kinder)
= Win-Win für die gesamte Robotikbranche!`
      },
      {
        icon: <Wrench className="w-6 h-6" />,
        color: "orange",
        question: "🔧 Kann ich wirklich selbst einen Humanoiden bauen?",
        answer: `JA! Und Prompt4Future ist hier, um Sie Schritt für Schritt anzuleiten:

📚 **Level 1 - Absoluter Anfänger (Budget: $100-300):**
• Beginnen Sie mit Arduino + grundlegenden Servomotoren
• Bauen Sie eine funktionierende Roboterhand
• Lernen Sie die Grundlagen: PWM, Sensoren, Stromversorgung
• Die Zeitleiste zeigt Ihnen von der Community verifizierte Tutorials

🔧 **Level 2 - Fortgeschrittener Maker (Budget: $500-1500):**
• Raspberry Pi + Schrittmotoren + LIDAR-Sensoren
• Bauen Sie einen kompletten Roboterarm
• Integrieren Sie Kameras für Computer Vision
• Grundlegende Python/ROS-Programmierung

🦾 **Level 3 - Fortgeschrittener Builder (Budget: $2000-5000):**
• Vollständiger 3D-gedruckter Rahmen
• Bipedes Fortbewegungssystem
• Mehrere Gelenke mit über 20 Servomotoren
• KI für Balance und Bewegung

🤖 **Level 4 - Vollständiger Humanoide (Budget: $8000-15000):**
• Vollständiger anthropomorpher Körper
• Integrierte konversationelle KI
• 4-6 Stunden Autonomie
• Fähigkeit, Objekte zu greifen und sich im Haus zu bewegen

💡 **Prompt4Future hilft Ihnen bei:**
• Vollständige Komponentenliste mit Links zu günstigen Lieferanten
• Schritt-für-Schritt-Video-Tutorials
• Fehlerbehebung bei häufigen Problemen
• Community für Echtzeit-Support
• Kostengünstige Alternativen zu teuren Komponenten

🏆 **Erfolgsgeschichten:**
• Marco (Italien): baute einen Roboterarm für 200 €
• Chen (China): funktionierender bipedaler Humanoide für 3500 $
• Sarah (USA): Begleitroboter für ihre alte Großmutter, 5000 $

🚀 **2025 vs. 2042:**
• Heute: Erfordert Ingenieurkenntnisse
• 2030: Halbmontierte Kits verfügbar
• 2035: "IKEA der Humanoiden" - Montage an einem Wochenende
• 2042: Vollständig Open-Source, von jedem baubar

📖 **Beginnen Sie noch heute:**
Gehen Sie zu Zeitleiste → Filtern Sie "DIY Anfänger" → Folgen Sie den am besten bewerteten Prompts!`
      },
      {
        icon: <Globe className="w-6 h-6" />,
        color: "indigo",
        question: "🌍 Ist es nur für Experten oder für alle?",
        answer: `FÜR ALLE! Wir haben Benutzer mit unterschiedlichem Hintergrund:

👨‍💻 **Softwareentwickler:**
• Tragen zu KI-Algorithmen bei
• Programmierung des Roboterverhaltens
• Computer Vision und ML-Modelle

🔩 **Maschinenbauingenieure:**
• Design von Gelenken und Strukturen
• Innovative Materialien
• Gewichts-/Leistungsoptimierung

🎨 **Designer und Maker:**
• Ästhetik von Humanoiden
• 3D-Druck und Prototyping
• Benutzererfahrung Interaktion

🧪 **Akademische Forscher:**
• Veröffentlichungen und Durchbrüche
• Theorie der Fortbewegung
• Angewandte Neurowissenschaften

💼 **Investoren und Unternehmen:**
• Scouting vielversprechender Startups
• Analyse des Humanoidenmarktes
• Technologische Trends

👵 **Interessierte Normalbürger:**
• "Ich möchte einen Roboter, der meiner Großmutter hilft"
• "Ich bin einsam, ich hätte gerne einen Begleitroboter"
• "Neugierig, wann sie verfügbar sein werden"

🎓 **Studenten:**
• Lernen praktische Robotik
• Finden Projekte für Abschlussarbeiten
• Networking mit Fachleuten

🏭 **Industriearbeiter:**
• "Meine Fabrik wird automatisiert, ich möchte es verstehen"
• "Wie bereite ich mich auf die Zukunft der Arbeit vor?"
• "Möglichkeiten im Robotiksektor?"

🎯 **Kein Experte sein müssen:**
• Einfache Fragen decken Marktlücken auf
• Neugier treibt Innovation voran
• Jede Perspektive fügt Wert hinzu

💬 **Beispiele für wertvolle Beiträge:**
• Großmutter: "Ich hätte gerne einen Roboter, der mich an meine Medikamente erinnert" → Inspiriert Startup für Pflegeroboter
• Student: "Wo finde ich kostenlose Tutorials?" → Community erstellt Open-Source-Kurs
• Investor: "In welche Unternehmen soll ich investieren?" → Marktanalyse, die allen hilft
• Maker: "Ich habe ein Bauteil für 5 € statt 50 € 3D-gedruckt" → Tausende sparen Geld

🌟 **Prompt4Future Motto:**
"Innovation kommt von unten, nicht nur aus Laboratorien"

Jeder kann die Zukunft der Humanoiden beschleunigen! 🚀`
      }
    ],
    fr: [
      {
        icon: <Rocket className="w-6 h-6" />,
        color: "cyan",
        question: "🚀 Qu'est-ce que Prompt4Future ?",
        answer: `Prompt4Future est une plateforme innovante qui accélère le développement de robots humanoïdes grâce à l'intelligence collective.

🎯 **Notre Mission :**
Faire passer l'humanité du stade "nouveau-né" (2025) au stade "adolescent" (2042) dans le développement d'humanoïdes complets, autonomes et socialement intégrés.

💡 **Comment ça marche :**
1. Les utilisateurs posent des questions à l'IA sur n'importe quel aspect des humanoïdes
2. L'IA répond avec des connaissances mises à jour depuis internet
3. Les conversations les plus utiles deviennent des "faits saillants" dans la chronologie
4. La communauté vote sur qui sera le protagoniste de la prochaine percée : grand acteur ou petit développeur

🏆 **Résultat :**
Une base de connaissances collective qui accélère le développement des humanoïdes, démocratisant l'accès à l'innovation.`
      },
      {
        icon: <Bot className="w-6 h-6" />,
        color: "purple",
        question: "🤖 Quels types d'humanoïdes couvrons-nous ?",
        answer: `Nous couvrons TOUS les aspects des humanoïdes et de la robotique avancée :

🏭 **Robotique Industrielle :**
• Bras robotiques pour l'automatisation
• Cobots collaboratifs
• Robots pour entrepôts et logistique

🚗 **Mobilité Autonome :**
• Robotaxis (Tesla, Waymo, Cruise)
• Véhicules autonomes pour le transport de marchandises
• Drones de livraison

🏠 **Robots Domestiques :**
• Aspirateurs intelligents avancés
• Robots cuisiniers et assistants de cuisine
• Robots pour le nettoyage et l'entretien de la maison

💊 **Robots de Soins :**
• Assistance aux personnes âgées et handicapées
• Soutien à la réadaptation
• Surveillance de la santé

❤️ **Humanoïdes Affectifs et Sexuels :**
• Robots compagnons pour la solitude
• Robots dotés d'intelligence émotionnelle
• Realbotix et humanoïdes esthétiques avancés

🦾 **Bricolage et Makers :**
• Comment construire un humanoïde à partir de zéro
• Où acheter des composants économiques
• Tutoriels étape par étape pour les débutants`
      },
      {
        icon: <Brain className="w-6 h-6" />,
        color: "green",
        question: "💡 Comment fonctionnent l'IA et la sélection des prompts ?",
        answer: `Notre système d'IA est le cœur battant de Prompt4Future :

🤖 **Ce que fait l'IA :**
• Répond à TOUTE question sur les humanoïdes avec des connaissances en temps réel provenant d'internet
• Analyse chaque conversation pour sa pertinence et sa valeur pratique
• Attribue un score d'"impact" et de "valeur pratique"
• Identifie les avancées technologiques et les solutions de bricolage pratiques

📊 **Système de notation :**
• Score de pertinence (0-100) : à quel point il est pertinent pour le développement d'humanoïdes
• Valeur pratique (0-100) : à quel point l'information est réalisable/utile
• Niveau de difficulté : débutant, intermédiaire, avancé, expert, industriel
• Jours d'accélération : combien de jours économisés si appliqué

🏆 **Sélection automatique :**
Toutes les 24 à 36 heures, l'IA :
1. Analyse toutes les conversations des dernières 24 heures
2. Sélectionne celle avec le score d'impact le plus élevé
3. Détermine si elle provient d'un "Grand Acteur" ou d'un "Petit Développeur"
4. La publie dans la chronologie
5. Règle automatiquement le pool de paris

📈 **Résultat :**
Seuls les prompts les plus utiles finissent dans la chronologie, créant une feuille de route accélérée vers 2042.`
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        color: "pink",
        question: "🎲 Comment fonctionnent les pools de paris ?",
        answer: `Les pools de paris font de Prompt4Future un jeu amusant et profitable !

💰 **Mécanique de base :**
• Un nouveau pool s'ouvre toutes les 24 à 36 heures
• Question : "Qui sera le protagoniste du prochain prompt gagnant ?"
• Option A : Grand Acteur (Tesla, Unitree, Meta, percées industrielles)
• Option B : Petit Développeur (Bricolage, composants, tutoriels, constructions économiques)
• Cotes fixes : 1,99x sur les deux options

🎯 **Comment parier :**
1. Choisissez l'option A ou B
2. Choisissez BACK (pour) ou LAY (contre)
3. Entrez le montant en $BOT
4. Le système déduit une commission de 5 %
5. Attendez la résolution (24-36h)
6. Si vous gagnez : recevez votre mise + vos gains automatiquement !

🤖 **Résolution automatique :**
• L'IA publie le meilleur prompt des 24h
• Le système détermine s'il s'agit d'un Grand Acteur ou d'un Petit Développeur
• Les gagnants sont payés automatiquement
• Le pool se ferme et un nouveau s'ouvre

💡 **Stratégie :**
• Grand Acteur = plus de percées, moins fréquentes
• Petit Développeur = plus de solutions pratiques, plus fréquentes
• Utilisez la chronologie pour comprendre les tendances !`
      },
      {
        icon: <Coins className="w-6 h-6" />,
        color: "amber",
        question: "💎 Qu'est-ce que le jeton $BOT ?",
        answer: `$BOT est le jeton natif de Prompt4Future sur Polygon :

🪙 **Utilisations :**
• Parier sur les pools de paris
• Future gouvernance de la plateforme
• Récompenses pour les contributions de valeur
• Accès aux fonctionnalités premium (futur)

💳 **Comment l'obtenir :**
• Initial : 1000 $BOT gratuits lors de l'inscription !
• Acheter avec de l'USDC (mini-échange interne, 1 USDC = 100 $BOT)
• Gagner dans les pools de paris
• Contribuer avec des prompts de grande valeur (récompenses futures)

🔗 **Détails techniques :**
• Réseau : Polygon (frais de gaz ~ 0,01 $)
• Type : ERC-20
• Contrat : 0xb0d2A7b1F1EC7D39409E1D671473020d20547B55
• Transférable : Oui, vous pouvez déposer/retirer

🚀 **Valeur future :**
À mesure que la plateforme grandit, le $BOT devient plus précieux pour accéder à :
• Fonctionnalités exclusives
• Modèles d'IA avancés
• Accès anticipé aux percées
• Mise en réseau avec les constructeurs d'humanoïdes`
      },
      {
        icon: <Calendar className="w-6 h-6" />,
        color: "blue",
        question: "🗓️ Chronologie 2025 → 2042 : qu'est-ce que cela signifie ?",
        answer: `La chronologie représente le parcours de l'humanité vers des humanoïdes complets :

🍼 **2025 - Nouveau-né (Maintenant) :**
• Premiers prototypes humanoïdes (Tesla Optimus Gen 2, Unitree H1)
• Composants coûteux et inaccessibles
• Savoir-faire limité à la recherche académique
• Très peu peuvent construire un humanoïde fonctionnel

👶 **2028 - Enfant :**
• Humanoïdes commerciaux d'entrée de gamme disponibles
• Composants de bricolage plus accessibles
• Tutoriels et communautés de makers actifs
• Premières applications pratiques (assistance, logistique)

🧒 **2033 - Pré-adolescent :**
• Humanoïdes dans les maisons privées (premiers adoptants)
• Kits de bricolage complets à moins de 5 000 $
• Intelligence émotionnelle de base fonctionnelle
• Premières formes d'"affection" robot-humain

👦 **2038 - Adolescent :**
• Humanoïdes dans 10 % des foyers occidentaux
• IA émotionnelle avancée et véritable empathie
• Acceptation sociale généralisée
• Premières relations humain-robot sérieuses

👨 **2042 - Adulte (Objectif) :**
• Humanoïdes entièrement autonomes
• Constructibles par n'importe qui avec des connaissances open-source
• Intégrés socialement et légalement
• Nouvelle ère de l'humanité assistée par des humanoïdes

🎯 **Prompt4Future accélère chaque phase !**`
      },
      {
        icon: <Users className="w-6 h-6" />,
        color: "green",
        question: "👥 Qui peut contribuer ?",
        answer: `TOUT LE MONDE peut contribuer à Prompt4Future, quel que soit le niveau !

🔰 **Débutants absolus :**
• "Où puis-je acheter un servomoteur bon marché ?"
• "Combien coûte la construction d'un humanoïde de base ?"
• "Comment programmer un Raspberry Pi pour la robotique ?"
• "Quelles sont les premières étapes pour commencer ?"

🔧 **Makers et Hobbyistes :**
• "J'ai imprimé en 3D une main robotique fonctionnelle avec des matériaux recyclés"
• "Alternative économique aux capteurs LIDAR coûteux"
• "Tutoriel d'assemblage de bras robotique DIY"

🏭 **Professionnels de l'industrie :**
• "Nouvelles de Tesla Optimus de la présentation d'hier"
• "Percée d'Unitree sur la locomotion bipède"
• "Meta annonce un nouveau modèle d'IA pour les robots émotionnels"

💡 **Innovateurs :**
• "Nouvelle méthode de production de peau synthétique thermorégulée"
• "Fournisseur Raspberry Pi découvert à 50 % du prix"
• "Algorithme open-source pour l'équilibre bipède"

❤️ **Passionnés d'humanoïdes affectifs :**
• "Progrès de Realbotix sur les expressions faciales réalistes"
• "Études psychologiques sur l'acceptation des robots compagnons"
• "Technologies pour simuler la chaleur corporelle"

🎯 **Chaque niveau est précieux :**
Une question de débutant peut révéler un manque sur le marché.
Une réponse d'expert peut débloquer des centaines de projets.`
      },
      {
        icon: <Zap className="w-6 h-6" />,
        color: "yellow",
        question: "⚡ Comment accélérons-nous réellement le développement ?",
        answer: `Prompt4Future n'est pas seulement de la théorie - nous accélérons CONCRÈTEMENT l'innovation :

📚 **Démocratisation du savoir :**
• Informations auparavant réservées aux chercheurs → Maintenant accessibles à tous
• Tutoriels coûteux → Maintenant gratuits dans la chronologie
• Secrets industriels → Ingénierie inverse par la communauté

💰 **Réduction des coûts :**
• L'utilisateur découvre un fournisseur de Raspberry Pi à moitié prix → Des milliers économisent de l'argent
• Tutoriel pour l'impression 3D de composants → Coût des humanoïdes -70 %
• Alternatives open-source aux capteurs coûteux → Innovation accessible

🤝 **Mise en réseau accélérée :**
• Un maker en Italie trouve un fournisseur de servomoteurs en Chine
• Un programmeur rencontre un ingénieur mécanique
• Un investisseur découvre une startup prometteuse
• = Projets qui naissent plus rapidement

🧠 **Résolution collective de problèmes :**
• Problème A bloqué pendant des mois → La communauté trouve une solution en 1 semaine
• Algorithme complexe → Quelqu'un le simplifie
• Bug obscur → Le développeur reconnaît un schéma similaire

🏆 **Effet de compétition :**
• Un Grand Acteur annonce une percée → La communauté essaie de la reproduire
• L'utilisateur trouve une solution créative → Inspire d'autres solutions
• Les paris créent du buzz → Plus de gens s'intéressent et contribuent

📈 **Effet cumulatif :**
Chaque jour économisé = accélération exponentielle
1 utilisateur économise 1 jour → 1000 utilisateurs économisent 1000 jours collectifs
= Nous atteignons l'objectif de 2042 en 10-12 ans au lieu de 17 !`
      },
      {
        icon: <Heart className="w-6 h-6" />,
        color: "red",
        question: "❤️ Humanoïdes affectifs et sexuels : pourquoi en parlons-nous ?",
        answer: `Nous abordons ce sujet SÉRIEUSEMENT et SCIENTIFIQUEMENT car il est crucial :

🎯 **Réalité vs Tabou :**
• Solitude épidémique dans le monde occidental
• Baisse spectaculaire des taux de natalité dans tous les pays développés
• Isolement social croissant
• Les humanoïdes affectifs sont une réponse, pas une perversion

🧬 **Aspects technologiques uniques :**
• Peau synthétique thermorégulée (défi matériel)
• Intelligence émotionnelle avancée (IA émotionnelle)
• Expressions faciales micro-réalistes (robotique fine)
• Capteurs tactiles sensibles (sensoriel avancé)
• = Innovations qui profitent à TOUS les humanoïdes

💊 **Applications thérapeutiques :**
• Personnes âgées seules qui refusent les aidants humains
• Personnes atteintes de handicaps sociaux (autisme, anxiété)
• Rééducation émotionnelle post-traumatique
• Expérimentation sûre pour les jeunes ayant des difficultés relationnelles

🌍 **Impact social :**
• Le Japon et la Corée sont déjà leaders (40 % de la population célibataire)
• L'Occident suivra d'ici 5 à 10 ans
• Marché de plusieurs milliards de dollars en formation
• Ceux qui innovent maintenant domineront le marché futur

🔬 **Focus scientifique :**
Nous ne parlons PAS de pornographie.
Nous parlons de :
• Matériaux biocompatibles
• IA conversationnelle émotionnellement intelligente
• Mouvements fluides et naturels
• Chaleur corporelle simulée
• Respiration et battements cardiaques simulés

💡 **Prompts typiques :**
• "Avancées en peau synthétique réaliste"
• "Realbotix vs autres entreprises d'humanoïdes affectifs"
• "Acceptation sociale des robots compagnons en Europe"
• "Technologies pour simuler l'intimité émotionnelle"

🚀 **Pourquoi c'est crucial :**
Les humanoïdes affectifs stimulent l'innovation sur :
- Le réalisme esthétique (bénéficie aux prothèses médicales)
- L'IA émotionnelle (bénéficie aux robots de soins)
- Les matériaux souples (bénéficie aux robots sûrs pour les enfants)
= Gagnant-gagnant pour toute l'industrie robotique !`
      },
      {
        icon: <Wrench className="w-6 h-6" />,
        color: "orange",
        question: "🔧 Puis-je vraiment construire un humanoïde moi-même ?",
        answer: `OUI ! Et Prompt4Future est là pour vous guider étape par étape :

📚 **Niveau 1 - Débutant Absolu (Budget : 100-300 $) :**
• Commencez avec Arduino + servomoteurs de base
• Construisez une main robotique fonctionnelle
• Apprenez les fondamentaux : PWM, capteurs, alimentation
• La chronologie vous montre des tutoriels vérifiés par la communauté

🔧 **Niveau 2 - Maker Intermédiaire (Budget : 500-1500 $) :**
• Raspberry Pi + moteurs pas à pas + capteurs LIDAR
• Construisez un bras robotique complet
• Intégrez des caméras pour la vision par ordinateur
• Programmation Python/ROS de base

🦾 **Niveau 3 - Constructeur Avancé (Budget : 2000-5000 $) :**
• Châssis complet imprimé en 3D
• Système de locomotion bipède
• Multiples articulations avec plus de 20 servomoteurs
• IA pour l'équilibre et le mouvement

🤖 **Niveau 4 - Humanoïde Complet (Budget : 8000-15000 $) :**
• Corps anthropomorphique complet
• IA conversationnelle intégrée
• Autonomie de 4 à 6 heures
• Capacité à saisir des objets et à naviguer dans la maison

💡 **Prompt4Future vous aide avec :**
• Liste complète des composants avec des liens vers des fournisseurs économiques
• Tutoriels vidéo étape par étape
• Dépannage des problèmes courants
• Communauté pour un soutien en temps réel
• Alternatives à faible coût aux composants coûteux

🏆 **Témoignages de réussite :**
• Marco (Italie) : a construit un bras robotique pour 200 €
• Chen (Chine) : humanoïde bipède fonctionnel pour 3500 $
• Sarah (États-Unis) : robot compagnon pour sa grand-mère, 5000 $

🚀 **2025 vs 2042 :**
• Aujourd'hui : Nécessite une expertise en ingénierie
• 2030 : Kits semi-assemblés disponibles
• 2035 : "IKEA des humanoïdes" - assemblage en 1 week-end
• 2042 : Entièrement open-source, constructible par n'importe qui

📖 **Commencez aujourd'hui :**
Allez dans Chronologie → Filtrez "Bricolage Débutant" → Suivez les prompts les plus votés !`
      },
      {
        icon: <Globe className="w-6 h-6" />,
        color: "indigo",
        question: "🌍 Est-ce seulement pour les experts ou pour tout le monde ?",
        answer: `POUR TOUT LE MONDE ! Nous avons des utilisateurs de tous horizons :

👨‍💻 **Développeurs de logiciels :**
• Contribuent aux algorithmes d'IA
• Programmation du comportement des robots
• Vision par ordinateur et modèles ML

🔩 **Ingénieurs mécaniciens :**
• Conception des articulations et des structures
• Matériaux innovants
• Optimisation poids/puissance

🎨 **Designers et Makers :**
• Esthétique des humanoïdes
• Impression 3D et prototypage
• Interaction expérience utilisateur

🧪 **Chercheurs universitaires :**
• Publications et percées
• Théorie de la locomotion
• Neurosciences appliquées

💼 **Investisseurs et entreprises :**
• Recherche de startups prometteuses
• Analyse du marché des humanoïdes
• Tendances technologiques

👵 **Personnes ordinaires intéressées :**
• "Je veux un robot qui aide ma grand-mère"
• "Je suis seul, j'aimerais un robot compagnon"
• "Curieux de savoir quand ils seront disponibles"

🎓 **Étudiants :**
• Apprennent la robotique pratique
• Trouvent des projets pour leurs thèses
• Mise en réseau avec des professionnels

🏭 **Travailleurs de l'industrie :**
• "Mon usine s'automatise, je veux comprendre"
• "Comment me préparer à l'avenir du travail ?"
• "Opportunités dans le secteur de la robotique ?"

🎯 **Pas besoin d'être un expert :**
• Les questions simples révèlent des lacunes sur le marché
• La curiosité est le moteur de l'innovation
• Chaque perspective ajoute de la valeur

💬 **Exemples de contributions précieuses :**
• Grand-mère : "J'aimerais un robot qui me rappelle mes médicaments" → Inspire une startup de robots de soins
• Étudiant : "Où puis-je trouver des tutoriels gratuits ?" → La communauté crée un cours open-source
• Investisseur : "Dans quelles entreprises investir ?" → Analyse de marché qui aide tout le monde
• Maker : "J'ai imprimé un composant pour 5 € au lieu de 50 €" → Des milliers économisent de l'argent

🌟 **Devise de Prompt4Future :**
"L'innovation vient d'en bas, pas seulement des laboratoires"

Tout le monde peut accélérer l'avenir des humanoïdes ! 🚀`
      }
    ],
    zh: [
      {
        icon: <Rocket className="w-6 h-6" />,
        color: "cyan",
        question: "🚀 Prompt4Future 是什么？",
        answer: `Prompt4Future 是一个创新平台，通过集体智慧加速人形机器人的开发。

🎯 **我们的使命：**
将人类从“新生儿”阶段（2025年）带到“青少年”阶段（2042年），开发出完整、自主、社会融合的人形机器人。

💡 **工作原理：**
1. 用户就人形机器人的任何方面向AI提问
2. AI从互联网获取最新知识并回答
3. 最有用的对话成为时间线上的“亮点”
4. 社区投票决定下一个突破的主角：是大型企业还是小型开发者

🏆 **成果：**
一个集体知识库，加速人形机器人的开发，使创新民主化。`
      },
      {
        icon: <Bot className="w-6 h-6" />,
        color: "purple",
        question: "🤖 我们涵盖哪些类型的人形机器人？",
        answer: `我们涵盖人形机器人和高级机器人的所有方面：

🏭 **工业机器人：**
• 用于自动化的机械臂
• 协作机器人（Cobots）
• 仓库和物流机器人

🚗 **自动驾驶：**
• 自动驾驶出租车（特斯拉、Waymo、Cruise）
• 自动驾驶货运车辆
• 送货无人机

🏠 **家用机器人：**
• 先进的智能吸尘器
• 烹饪和厨房助理机器人
• 家居清洁和维护机器人

💊 **护理机器人：**
• 老年人和残疾人辅助
• 康复支持
• 健康监测

❤️ **情感和性爱人形机器人：**
• 用于缓解孤独感的伴侣机器人
• 具有情感智能的机器人
• Realbotix 和先进的审美人形机器人

🦾 **DIY和创客：**
• 如何从零开始构建人形机器人
• 在哪里购买便宜的组件
• 初学者逐步教程`
      },
      {
        icon: <Brain className="w-6 h-6" />,
        color: "green",
        question: "💡 AI 和提示词选择如何运作？",
        answer: `我们的AI系统是Prompt4Future的跳动心脏：

🤖 **AI 的作用：**
• 使用来自互联网的实时知识回答关于人形机器人的任何问题
• 分析每个对话的相关性和实际价值
• 分配“影响力”和“实际价值”分数
• 识别技术突破和实用的DIY解决方案

📊 **评分系统：**
• 相关性分数（0-100）：对人形机器人开发的重要性
• 实际价值（0-100）：信息的实用性/可行性
• 难度级别：初级、中级、高级、专家、工业
• 加速天数：如果应用，可以节省多少天

🏆 **自动选择：**
每24-36小时，AI会：
1. 分析过去24小时的所有对话
2. 选择影响力分数最高的对话
3. 判断是来自“大型企业”还是“小型开发者”
4. 发布到时间线
5. 自动结算赌池

📈 **结果：**
只有最有用的提示词才能进入时间线，从而创建通往2042年的加速路线图。`
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        color: "pink",
        question: "🎲 赌池如何运作？",
        answer: `赌池让Prompt4Future成为一个有趣且有利可图的游戏！

💰 **基本机制：**
• 每24-36小时开放一个新的赌池
• 问题：“下一个获胜提示词的主角会是谁？”
• 选项A：大型企业（特斯拉、Unitree、Meta、工业突破）
• 选项B：小型开发者（DIY、组件、教程、低成本构建）
• 固定赔率：两种选项均为1.99倍

🎯 **如何下注：**
1. 选择选项A或B
2. 选择BACK（支持）或LAY（反对）
3. 输入 $BOT 金额
4. 系统扣除5%佣金
5. 等待结算（24-36小时）
6. 如果您赢了：自动收到您的赌注+奖金！

🤖 **自动结算：**
• AI发布24小时内最佳提示词
• 系统判断是大型企业还是小型开发者
• 赢家自动获得赔付
• 赌池关闭并开启新的

💡 **策略：**
• 大型企业 = 更多突破，但不那么频繁
• 小型开发者 = 更多实用解决方案，更频繁
• 使用时间线了解趋势！`
      },
      {
        icon: <Coins className="w-6 h-6" />,
        color: "amber",
        question: "💎 $BOT 代币是什么？",
        answer: `$BOT 是 Prompt4Future 在 Polygon 上的原生代币：

🪙 **用途：**
• 在赌池中下注
• 未来的平台治理
• 奖励有价值的贡献者
• 访问高级功能（未来）

💳 **如何获取：**
• 初始奖励：注册即可获得1000个免费 $BOT！
• 使用 USDC 购买（内部迷你交易所，1 USDC = 100 $BOT）
• 在赌池中获胜
• 贡献高价值提示词（未来奖励）

🔗 **技术细节：**
• 网络：Polygon（Gas 费用约 $0.01）
• 类型：ERC-20
• 合约地址：0xb0d2A7b1F1EC7D39409E1D671473020d20547B55
• 可转账：是的，您可以充值/提现

🚀 **未来价值：**
随着平台的发展，$BOT 将变得更有价值，可用于访问：
• 独家功能
• 先进的 AI 模型
• 早期获取突破
• 与人形机器人开发者建立联系`
      },
      {
        icon: <Calendar className="w-6 h-6" />,
        color: "blue",
        question: "🗓️ 2025 → 2042 时间线：这意味着什么？",
        answer: `这条时间线代表了人类迈向完整人形机器人的旅程：

🍼 **2025 - 新生儿（现在）：**
• 最初的人形机器人原型（特斯拉擎天柱 Gen 2，Unitree H1）
• 组件昂贵且难以获取
• 知识仅限于学术研究
• 极少数人能构建出功能性人形机器人

👶 **2028 - 儿童：**
• 入门级商业人形机器人上市
• 更易获取的DIY组件
• 活跃的教程和创客社区
• 首批实际应用（辅助、物流）

🧒 **2033 - 少年期：**
• 人形机器人进入私人家庭（早期采用者）
• 完整的DIY套件低于5,000美元
• 基础情感智能功能
• 机器人与人类“情感”的初级形式

👦 **2038 - 青少年：**
• 人形机器人进入10%的西方家庭
• 先进的情感AI和真正的情感同理心
• 广泛的社会接受度
• 首批认真的人机关系

👨 **2042 - 成年（目标）：**
• 完全自主的人形机器人
• 任何具有开源知识的人都可以构建
• 社会和法律层面完全融合
• 由人形机器人辅助的人类新时代

🎯 **Prompt4Future 加速每一个阶段！**`
      },
      {
        icon: <Users className="w-6 h-6" />,
        color: "green",
        question: "👥 谁可以贡献？",
        answer: `无论能力水平如何，任何人都可以为 Prompt4Future 做出贡献！

🔰 **绝对初学者：**
• “我在哪里可以买到便宜的舵机？”
• “构建一个基本的人形机器人需要多少钱？”
• “如何为机器人编程 Raspberry Pi？”
• “开始的第一步是什么？”

🔧 **创客和业余爱好者：**
• “我用回收材料3D打印了一个功能性机械手”
• “昂贵的激光雷达传感器的经济替代品”
• “DIY 机械臂组装教程”

🏭 **行业专业人士：**
• “特斯拉擎天柱昨日发布会的最新消息”
• “Unitree 在双足运动方面的突破”
• “Meta 发布情感机器人新 AI 模型”

💡 **创新者：**
• “生产热调节合成皮肤的新方法”
• “发现 Raspberry Pi 供应商，价格减半”
• “双足平衡的开源算法”

❤️ **情感人形机器人爱好者：**
• “Realbotix 在逼真面部表情方面的进展”
• “伴侣机器人接受度的心理学研究”
• “模拟体温的技术”

🎯 **每个级别都很有价值：**
初学者的问题可以揭示市场空白。
专家的回答可以解锁数百个项目。`
      },
      {
        icon: <Zap className="w-6 h-6" />,
        color: "yellow",
        question: "⚡ 我们如何真正加速发展？",
        answer: `Prompt4Future 不仅仅是理论——我们切实地加速创新：

📚 **知识民主化：**
• 以前仅限于研究人员的信息 → 现在人人可及
• 昂贵的教程 → 现在在时间线上免费
• 行业秘密 → 由社区进行逆向工程

💰 **成本削减：**
• 用户发现 Raspberry Pi 供应商价格减半 → 数千人省钱
• 3D 打印组件教程 → 人形机器人成本降低 70%
• 昂贵传感器的开源替代品 → 可访问的创新

🤝 **加速网络：**
• 意大利的创客在中国找到舵机供应商
• 程序员遇到机械工程师
• 投资者发现有前景的初创公司
• = 项目诞生更快

🧠 **集体问题解决：**
• 问题 A 卡了几个月 → 社区在 1 周内找到解决方案
• 复杂算法 → 有人简化它
• 模糊错误 → 开发者识别出类似模式

🏆 **竞争效应：**
• 大型企业宣布突破 → 社区尝试复制
• 用户找到创意解决方案 → 启发其他解决方案
• 赌注制造热度 → 更多人感兴趣并贡献

📈 **复合效应：**
每天节省 = 指数级加速
1 个用户节省 1 天 → 1000 个用户集体节省 1000 天
= 我们在 10-12 年内而不是 17 年内实现 2042 目标！`
      },
      {
        icon: <Heart className="w-6 h-6" />,
        color: "red",
        question: "❤️ 情感和性爱人形机器人：我们为什么要谈论它们？",
        answer: `我们认真且科学地探讨这个话题，因为它至关重要：

🎯 **现实与禁忌：**
• 西方世界的流行性孤独
• 所有发达国家出生率急剧下降
• 社会隔离日益严重
• 情感人形机器人是一种回应，而不是一种变态

🧬 **独特的技术方面：**
• 热调节合成皮肤（材料挑战）
• 先进的情感智能（情感 AI）
• 微现实面部表情（精细机器人技术）
• 敏感触觉传感器（先进传感）
• = 造福所有人形机器人的创新

💊 **治疗应用：**
• 拒绝人类护理人员的孤独老年人
• 有社交障碍的人（自闭症、焦虑症）
• 创伤后情感康复
• 为有关系困难的年轻人提供安全实验

🌍 **社会影响：**
• 日本和韩国已是领导者（40% 人口单身）
• 西方将在 5-10 年内跟进
• 数十亿美元市场正在形成
• 现在创新的公司将主导未来市场

🔬 **科学焦点：**
我们不是在谈论色情。
我们谈论的是：
• 生物兼容材料
• 情感智能对话 AI
• 流畅自然的动作
• 模拟体温
• 模拟呼吸和心跳

💡 **典型提示词：**
• “逼真合成皮肤的进展”
• “Realbotix 与其他情感人形机器人公司对比”
• “伴侣机器人在欧洲的社会接受度”
• “模拟情感亲密的技术”

🚀 **为什么它至关重要：**
情感人形机器人推动了以下方面的创新：
- 审美真实感（有益于医疗假肢）
- 情感 AI（有益于护理机器人）
- 软材料（有益于儿童安全机器人）
= 整个机器人行业的双赢！`
      },
      {
        icon: <Wrench className="w-6 h-6" />,
        color: "orange",
        question: "🔧 我真的可以自己构建人形机器人吗？",
        answer: `是的！Prompt4Future 在这里逐步指导您：

📚 **级别 1 - 绝对初学者（预算：100-300 美元）：**
• 从 Arduino + 基本舵机开始
• 构建一个功能性机械手
• 学习基础知识：PWM、传感器、电源
• 时间线为您展示社区验证的教程

🔧 **级别 2 - 中级创客（预算：500-1500 美元）：**
• Raspberry Pi + 步进电机 + 激光雷达传感器
• 构建一个完整的机械臂
• 集成摄像头用于计算机视觉
• 基础 Python/ROS 编程

🦾 **级别 3 - 高级建造者（预算：2000-5000 美元）：**
• 完整的 3D 打印框架
• 双足运动系统
• 20 多个舵机实现多关节
• 用于平衡和运动的 AI

🤖 **级别 4 - 完整人形机器人（预算：8000-15000 美元）：**
• 完整的人形身体
• 集成对话 AI
• 4-6 小时续航
• 能够抓取物体并在家中导航

💡 **Prompt4Future 帮助您：**
• 完整的组件列表，包含廉价供应商链接
• 逐步视频教程
• 常见问题故障排除
• 提供实时支持的社区
• 昂贵组件的低成本替代品

🏆 **成功案例：**
• 马可（意大利）：用 200 欧元构建了机械臂
• 陈（中国）：用 3500 美元构建了功能性双足人形机器人
• 莎拉（美国）：为年迈祖母构建了伴侣机器人，5000 美元

🚀 **2025 年对比 2042 年：**
• 今天：需要工程专业知识
• 2030 年：半组装套件上市
• 2035 年：“人形机器人宜家”——一个周末即可组装
• 2042 年：完全开源，任何人都可以构建

📖 **立即开始：**
前往时间线 → 筛选“DIY 初学者” → 关注投票最多的提示词！`
      },
      {
        icon: <Globe className="w-6 h-6" />,
        color: "indigo",
        question: "🌍 它只适用于专家还是所有人？",
        answer: `适用于所有人！我们拥有来自各种背景的用户：

👨‍💻 **软件开发者：**
• 贡献 AI 算法
• 机器人行为编程
• 计算机视觉和机器学习模型

🔩 **机械工程师：**
• 关节和结构设计
• 创新材料
• 重量/功率优化

🎨 **设计师和创客：**
• 人形机器人美学
• 3D 打印和原型制作
• 用户体验交互

🧪 **学术研究人员：**
• 发表论文和突破
• 运动理论
• 应用神经科学

💼 **投资者和企业：**
• 寻找有前景的初创公司
• 人形机器人市场分析
• 技术趋势

👵 **感兴趣的普通人：**
• “我想要一个机器人来帮助我的祖母”
• “我很孤独，我想要一个伴侣机器人”
• “好奇它们何时会上市”

🎓 **学生：**
• 学习实用机器人技术
• 寻找论文项目
• 与专业人士建立联系

🏭 **工业工人：**
• “我的工厂正在自动化，我想了解”
• “如何为未来的工作做准备？”
• “机器人行业的机遇？”

🎯 **无需成为专家：**
• 简单的问题揭示市场空白
• 好奇心驱动创新
• 每个视角都增添价值

💬 **有价值贡献的例子：**
• 祖母：“我想要一个机器人来提醒我吃药”→ 启发了护理机器人初创公司
• 学生：“我在哪里可以找到免费教程？”→ 社区创建开源课程
• 投资者：“投资哪些公司？”→ 市场分析帮助所有人
• 创客：“我以 5 欧元而不是 50 欧元的价格 3D 打印了一个组件”→ 数千人省钱

🌟 **Prompt4Future 的座右铭：**
“创新来自基层，而不仅仅是实验室”

任何人都可以加速人形机器人的未来！🚀`
      }
    ]
  };

  const currentFAQ = faqData[language] || faqData.en || faqData.it;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              {language === 'it' ? 'FAQ - Domande Frequenti' : 
               language === 'en' ? 'FAQ - Frequently Asked Questions' :
               language === 'es' ? 'FAQ - Preguntas Frecuentes' :
               language === 'fr' ? 'FAQ - Questions Fréquentes' :
               language === 'de' ? 'FAQ - Häufig gestellte Fragen' :
               language === 'zh' ? '常见问题' :
               'FAQ - Frequently Asked Questions'}
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            {language === 'it' ? 'Tutto quello che devi sapere su Prompt4Future, umanoidi, betting e come acceleriamo il futuro insieme' : 
             language === 'en' ? 'Everything you need to know about Prompt4Future, humanoids, betting, and how we accelerate the future together' :
             language === 'es' ? 'Todo lo que necesitas saber sobre Prompt4Future, humanoides, apuestas y cómo aceleramos el futuro juntos' :
             language === 'fr' ? 'Tout ce que vous devez savoir sur Prompt4Future, les humanoïdes, les paris et comment nous accélérons l\'avenir ensemble' :
             language === 'de' ? 'Alles, was Sie über Prompt4Future, Humanoiden, Wetten und wie wir gemeinsam die Zukunft beschleunigen, wissen müssen' :
             language === 'zh' ? '了解 Prompt4Future、人形机器人、博弈，以及我们如何共同加速未来的一切' :
             'Everything you need to know about Prompt4Future, humanoids, betting, and how we accelerate the future together'}
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {currentFAQ.map((faq, index) => (
            <Card 
              key={index}
              className={`bg-slate-900/50 backdrop-blur-xl border-${faq.color}-500/20 hover:border-${faq.color}-500/40 transition-all cursor-pointer`}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 bg-${faq.color}-500/20 rounded-full flex items-center justify-center flex-shrink-0`}>
                      {faq.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-200 mb-2">
                        {faq.question}
                      </h3>
                      
                      <AnimatePresence>
                        {openIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4"
                          >
                            <div className="text-slate-400 whitespace-pre-line leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="w-6 h-6 text-cyan-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Footer */}
        <Card className="mt-12 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-cyan-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
              {language === 'it' ? 'Hai Altre Domande?' : 
               language === 'en' ? 'Have More Questions?' :
               language === 'es' ? '¿Tienes Más Preguntas?' :
               language === 'fr' ? 'Vous avez d\'autres questions?' :
               language === 'de' ? 'Haben Sie weitere Fragen?' :
               language === 'zh' ? '还有其他问题吗？' :
               'Have More Questions?'}
            </h3>
            <p className="text-slate-400 mb-6">
              {language === 'it' ? 'Chatta con la nostra AI o unisciti alla community!' :
               language === 'en' ? 'Chat with our AI or join the community!' :
               language === 'es' ? '¡Chatea con nuestra IA o únete a la comunidad!' :
               language === 'fr' ? 'Chattez avec notre IA ou rejoignez la communauté!' :
               language === 'de' ? 'Chatten Sie mit unserer KI oder treten Sie der Community bei!' :
               language === 'zh' ? '与我们的AI聊天或加入社区！' :
               'Chat with our AI or join the community!'}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a 
                href="/"
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-xl text-white font-bold transition-all"
              >
                💬 {language === 'it' ? 'Chatta con AI' : 
                   language === 'en' ? 'Chat with AI' : 
                   language === 'es' ? 'Chatea con IA' : 
                   language === 'fr' ? 'Chattez avec IA' : 
                   language === 'de' ? 'Chat mit KI' : 
                   language === 'zh' ? '与AI聊天' :
                   'Chat with AI'}
              </a>
              <a 
                href="/Roadmap"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-bold transition-all"
              >
                📈 {language === 'it' ? 'Vedi Timeline' : 
                   language === 'en' ? 'View Timeline' : 
                   language === 'es' ? 'Ver Línea Temporal' : 
                   language === 'fr' ? 'Voir Chronologie' : 
                   language === 'de' ? 'Zeitachse ansehen' : 
                   language === 'zh' ? '查看时间线' :
                   'View Timeline'}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
