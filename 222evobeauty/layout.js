import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Bot, Map, Home, Globe, Shield, HelpCircle, LogOut, User, Zap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const ADMIN_EMAIL = "francescoullo1@gmail.com";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

function createPageUrl(pageName) {
  return `/${pageName}`;
}

const translations = {
  en: {
    nav_home: "Home",
    nav_betting: "Betting",
    nav_wallet: "Wallet",
    nav_timeline: "Timeline",
    nav_faq: "FAQ",
    nav_admin: "Admin Panel",
  },
  it: {
    nav_home: "Home",
    nav_betting: "Betting",
    nav_wallet: "Wallet",
    nav_timeline: "Timeline",
    nav_faq: "FAQ",
    nav_admin: "Admin Panel",
  },
  es: {
    nav_home: "Inicio",
    nav_betting: "Apuestas",
    nav_wallet: "Cartera",
    nav_timeline: "Timeline",
    nav_faq: "FAQ",
    nav_admin: "Admin",
  },
  zh: {
    nav_home: "首页",
    nav_betting: "投注",
    nav_wallet: "钱包",
    nav_timeline: "时间线",
    nav_faq: "FAQ",
    nav_admin: "管理",
  },
  de: {
    nav_home: "Start",
    nav_betting: "Wetten",
    nav_wallet: "Wallet",
    nav_timeline: "Timeline",
    nav_faq: "FAQ",
    nav_admin: "Admin",
  },
  fr: {
    nav_home: "Accueil",
    nav_betting: "Paris",
    nav_wallet: "Portefeuille",
    nav_timeline: "Timeline",
    nav_faq: "FAQ",
    nav_admin: "Admin",
  },
};

export const LanguageContext = React.createContext({
  language: 'it',
  setLanguage: () => {}
});

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [language, setLanguage] = React.useState('it');

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        console.log("✅ Layout: User loaded:", currentUser?.email);
        console.log("✅ Layout: Is Admin?", currentUser?.email === ADMIN_EMAIL);
      } catch (error) {
        console.log("❌ Layout: User not logged in");
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  React.useEffect(() => {
    const reloadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        console.log("🔄 Layout: User reloaded on page change:", currentUser?.email);
      } catch (error) {
        setUser(null);
        console.log("❌ Layout: User lost on page change");
      }
    };
    reloadUser();
  }, [location.pathname]);

  const isAdmin = user?.email === ADMIN_EMAIL;

  console.log("🎨 Layout Render - User:", user?.email, "| isAdmin:", isAdmin, "| Language:", language);

  const t = (translations && translations[language]) ? translations[language] : (translations?.en || {});

  const navigationItems = [
    {
      title: t.nav_home || "Home",
      url: createPageUrl("Home"),
      icon: Home,
    },
    {
      title: t.nav_betting || "Betting",
      url: createPageUrl("Betting"),
      icon: Bot,
    },
    {
      title: t.nav_wallet || "Wallet",
      url: createPageUrl("Wallet"),
      icon: Globe,
    },
    {
      title: t.nav_timeline || "Timeline",
      url: createPageUrl("Roadmap"),
      icon: Map,
    },
    {
      title: t.nav_faq || "FAQ",
      url: createPageUrl("FAQ"),
      icon: HelpCircle,
    },
  ];

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[5];

  const handleLogout = async () => {
    console.log("🚪 Logout button clicked!");
    try {
      await base44.auth.logout();
      console.log("✅ Logout successful");
      window.location.href = '/';
    } catch (error) {
      console.error("❌ Logout error:", error);
      window.location.href = '/';
    }
  };

  const handleLanguageChange = (newLang) => {
    console.log("🌍 Language changed from", language, "to", newLang);
    setLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange }}>
      <SidebarProvider>
        <style>{`
          :root {
            --primary-dark: #0a0e27;
            --primary-blue: #1e3a8a;
            --accent-cyan: #06b6d4;
            --accent-purple: #8b5cf6;
            --accent-pink: #ec4899;
          }
        `}</style>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
          <Sidebar className="border-r border-cyan-500/20 bg-slate-950/50 backdrop-blur-xl">
            <SidebarHeader className="border-b border-cyan-500/20 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-lg">
                    Prompt4Future
                  </h2>
                  <p className="text-xs text-cyan-300/70">Betting Platform</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-3">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-medium text-cyan-300/50 uppercase tracking-wider px-3 py-3">
                  Navigation
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-cyan-500/10 hover:text-cyan-300 transition-all duration-300 rounded-xl mb-2 ${
                            location.pathname === item.url 
                              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20' 
                              : 'text-slate-400'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}

                    {isAdmin && (
                      <>
                        <SidebarMenuItem>
                          <SidebarMenuButton 
                            asChild 
                            className={`hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 rounded-xl mb-2 ${
                              location.pathname === createPageUrl("Admin")
                                ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 shadow-lg shadow-red-500/20' 
                                : 'text-slate-400'
                            }`}
                          >
                            <Link to={createPageUrl("Admin")} className="flex items-center gap-3 px-4 py-3">
                              <Shield className="w-5 h-5" />
                              <span className="font-medium">{t.nav_admin || "Admin Panel"}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <SidebarMenuButton 
                            asChild 
                            className={`hover:bg-green-500/10 hover:text-green-300 transition-all duration-300 rounded-xl mb-2 ${
                              location.pathname === createPageUrl("AutoApprove")
                                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 shadow-lg shadow-green-500/20' 
                                : 'text-slate-400'
                            }`}
                          >
                            <Link to={createPageUrl("AutoApprove")} className="flex items-center gap-3 px-4 py-3">
                              <Zap className="w-5 h-5" />
                              <span className="font-medium">🤖 Auto-Approve</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-medium text-cyan-300/50 uppercase tracking-wider px-3 py-3">
                  🌍 Language
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-3">
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-full bg-slate-800 border-cyan-500/30 text-slate-200 hover:bg-slate-700 transition-colors">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{currentLang.flag}</span>
                            <span className="text-slate-200">{currentLang.name}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 backdrop-blur-xl border-cyan-500/30 z-[99999]">
                        {LANGUAGES.map((lang) => (
                          <SelectItem 
                            key={lang.code} 
                            value={lang.code}
                            className="text-slate-200 cursor-pointer hover:bg-cyan-500/20 focus:bg-cyan-500/30 focus:text-cyan-200 bg-slate-800"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{lang.flag}</span>
                              <span className="text-slate-200 font-medium">{lang.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-cyan-500/20 p-4 space-y-3">
              <div className="flex items-center gap-3 px-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-300 text-sm">Polygon Network</p>
                  <p className="text-xs text-cyan-300/70">
                    {isAdmin ? '⚡ Admin Mode' : 'ERC-20 Token'}
                  </p>
                </div>
              </div>

              {user && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-purple-500/30">
                    <User className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span className="text-xs text-slate-300 truncate flex-1">
                      {user.email}
                    </span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="w-full border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="font-medium">Logout</span>
                  </Button>
                </div>
              )}

              {!user && (
                <Button
                  onClick={() => base44.auth.redirectToLogin(window.location.pathname)}
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="bg-slate-950/30 backdrop-blur-xl border-b border-cyan-500/20 px-6 py-4 md:hidden">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="hover:bg-cyan-500/10 p-2 rounded-lg transition-colors duration-200 text-cyan-300" />
                  <h1 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    Prompt4Future
                  </h1>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </LanguageContext.Provider>
  );
}