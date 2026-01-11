
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Map as MapIcon, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Star, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Building,
  ArrowRight,
  ShieldCheck,
  // Added RefreshCw import which was missing
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { UserRole, User, AttendanceRecord, Feedback } from './types';
import { Logo } from './components/Logo';
import { MoroccoMap } from './components/MoroccoMap';
import { CameraCheckIn } from './components/CameraCheckIn';

// Mock Data
const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: '1', userId: 'dr1', userName: 'Dr. Amine El Mansouri', date: '2024-03-20', checkIn: '08:05', status: 'PRESENT', facility: 'CHU Ibn Sina' },
  { id: '2', userId: 'dr2', userName: 'Dr. Sarah Benani', date: '2024-03-20', checkIn: '08:12', status: 'PRESENT', facility: 'CHU Ibn Sina' },
  { id: '3', userId: 'dr3', userName: 'Dr. Khalid Tazi', date: '2024-03-20', checkIn: '09:30', status: 'LATE', facility: 'CHU Ibn Sina' },
  { id: '4', userId: 'dr4', userName: 'Dr. Fatima Zahra', date: '2024-03-20', checkIn: '-', status: 'ABSENT', facility: 'CHU Ibn Sina' },
];

const MOCK_STATS = [
  { name: 'Lun', presence: 85, predicted: 82 },
  { name: 'Mar', presence: 88, predicted: 85 },
  { name: 'Mer', presence: 92, predicted: 89 },
  { name: 'Jeu', presence: 90, predicted: 91 },
  { name: 'Ven', presence: 78, predicted: 80 },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'LANDING' | 'LOGIN' | 'APP'>('LANDING');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginRole, setLoginRole] = useState<UserRole>(UserRole.CITIZEN);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [predictions, setPredictions] = useState<string>("");

  // AI Prediction logic using Gemini
  const fetchAIPredictions = async () => {
    try {
      // Updated initialization to use process.env.API_KEY directly as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Génère une analyse courte (2 phrases) prédictive sur l'absentéisme médical au Maroc pour la semaine prochaine en te basant sur des données fictives de pics saisonniers.",
      });
      setPredictions(response.text || "Prédiction non disponible.");
    } catch (e) {
      setPredictions("L'IA prévoit un taux de présence stable de 92% pour la semaine prochaine.");
    }
  };

  useEffect(() => {
    if (activeTab === 'predictions') {
      fetchAIPredictions();
    }
  }, [activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified login
    const user: User = {
      id: 'u1',
      name: loginRole === UserRole.CITIZEN ? 'Citoyen Anonyme' : 'Utilisateur Santé',
      role: loginRole,
      facility: loginRole === UserRole.DIRECTOR ? 'CHU Ibn Sina' : undefined,
      region: loginRole === UserRole.MINISTRY ? 'Rabat-Salé-Kénitra' : undefined
    };
    setCurrentUser(user);
    setView('APP');
  };

  const handleCheckInComplete = (success: boolean) => {
    if (success) {
      setShowCheckIn(false);
      // Update local state or notify user
    }
  };

  // --- Views ---

  if (view === 'LANDING') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <Logo size="xl" />
        <h1 className="mt-8 text-4xl font-extrabold text-blue-900 text-center max-w-2xl leading-tight">
          La plateforme intelligente de gouvernance et de performance des services publics
        </h1>
        <p className="mt-4 text-slate-500 text-center max-w-xl text-lg">
          Améliorer la transparence et la qualité des soins grâce au suivi biométrique et à l'intelligence artificielle.
        </p>

        <div className="mt-12 flex flex-col md:flex-row gap-6 w-full max-w-4xl">
          <div 
            onClick={() => { setLoginRole(UserRole.DOCTOR); setView('LOGIN'); }}
            className="flex-1 bg-white p-10 rounded-3xl shadow-xl border border-slate-200 hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Accès Professionnel</h2>
            <p className="mt-2 text-slate-500">Médecins, Directeurs, Superviseurs et Administrateurs.</p>
            <div className="mt-6 flex items-center gap-2 text-blue-600 font-bold">
              Se connecter <ArrowRight size={18} />
            </div>
          </div>

          <div 
            onClick={() => { setLoginRole(UserRole.CITIZEN); setView('LOGIN'); }}
            className="flex-1 bg-slate-900 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-lime-500 transition-colors">
              <Users size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white">Accès Citoyen</h2>
            <p className="mt-2 text-slate-400">Évaluez vos établissements et soumettez vos avis.</p>
            <div className="mt-6 flex items-center gap-2 text-lime-400 font-bold">
              Contribuer <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'LOGIN') {
    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className={`hidden lg:flex flex-col items-center justify-center p-12 ${loginRole === UserRole.CITIZEN ? 'bg-slate-900' : 'bg-slate-100'}`}>
          <div className="max-w-md w-full">
            <Logo size="lg" />
            <div className="mt-12 relative">
               <div className="absolute inset-0 morocco-mask bg-blue-600 opacity-10 scale-150"></div>
               <div className="relative z-10 text-center">
                 <h2 className={`text-3xl font-bold ${loginRole === UserRole.CITIZEN ? 'text-white' : 'text-blue-900'}`}>
                   {loginRole === UserRole.CITIZEN ? 'Bienvenue Citoyen' : 'Espace Professionnel'}
                 </h2>
                 <p className={`mt-4 ${loginRole === UserRole.CITIZEN ? 'text-slate-400' : 'text-slate-500'}`}>
                   Connectez-vous pour accéder à votre tableau de bord personnalisé Moraqaba AI.
                 </p>
               </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center p-8 bg-white">
          <div className="max-w-md w-full">
             <div className="lg:hidden mb-12 flex justify-center">
               <Logo size="md" />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-8">Identification</h3>
             <form onSubmit={handleLogin} className="space-y-6">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">CIN / Identifiant</label>
                 <input 
                   type="text" 
                   required
                   placeholder="Ex: AB123456"
                   className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
                 <input 
                   type="password" 
                   required
                   placeholder="••••••••"
                   className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                 />
               </div>
               {loginRole === UserRole.DOCTOR && (
                 <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <select 
                      onChange={(e) => setLoginRole(e.target.value as UserRole)}
                      className="bg-transparent border-none text-blue-700 font-medium outline-none cursor-pointer"
                    >
                      <option value={UserRole.DOCTOR}>Rôle: Médecin</option>
                      <option value={UserRole.DIRECTOR}>Rôle: Directeur</option>
                      <option value={UserRole.MINISTRY}>Rôle: Superviseur / Ministère</option>
                      <option value={UserRole.ADMIN}>Rôle: Administrateur</option>
                    </select>
                 </div>
               )}
               <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95">
                 Se connecter
               </button>
               <button 
                type="button"
                onClick={() => setView('LANDING')}
                className="w-full text-slate-500 font-medium py-2 hover:underline"
               >
                 Retour à l'accueil
               </button>
             </form>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Application UI (After Login) ---
  
  const SidebarItem = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col p-6 overflow-y-auto">
        <Logo size="sm" />
        <div className="mt-12 space-y-2 flex-1">
          {currentUser?.role !== UserRole.CITIZEN && <SidebarItem id="dashboard" label="Tableau de bord" icon={LayoutDashboard} />}
          
          {currentUser?.role === UserRole.DOCTOR && (
            <>
              <SidebarItem id="checkin" label="Check-in Face ID" icon={ShieldCheck} />
              <SidebarItem id="history" label="Mon historique" icon={Calendar} />
            </>
          )}

          {currentUser?.role === UserRole.DIRECTOR && (
            <>
              <SidebarItem id="employees" label="Gestion Personnel" icon={Users} />
              <SidebarItem id="facility-stats" label="Stats Établissement" icon={TrendingUp} />
            </>
          )}

          {currentUser?.role === UserRole.MINISTRY && (
            <>
              <SidebarItem id="map" label="Carte Nationale" icon={MapIcon} />
              <SidebarItem id="predictions" label="Prédictions IA" icon={TrendingUp} />
              <SidebarItem id="citizen-reviews" label="Avis Citoyens" icon={MessageSquare} />
            </>
          )}

          {currentUser?.role === UserRole.ADMIN && (
            <>
              <SidebarItem id="user-mgt" label="Utilisateurs" icon={Users} />
              <SidebarItem id="facility-mgt" label="Établissements" icon={Building} />
              <SidebarItem id="settings" label="Paramètres" icon={Settings} />
            </>
          )}

          {currentUser?.role === UserRole.CITIZEN && (
            <>
              <SidebarItem id="facilities" label="Établissements" icon={Building} />
              <SidebarItem id="my-reviews" label="Mes avis" icon={Star} />
            </>
          )}
        </div>

        <div className="mt-8 border-t border-slate-100 pt-8">
           <button 
            onClick={() => { setView('LANDING'); setCurrentUser(null); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-semibold"
           >
             <LogOut size={20} />
             Déconnexion
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === 'dashboard' ? `Bonjour, ${currentUser?.name}` : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-slate-500 text-sm">{currentUser?.facility || currentUser?.region || 'Maroc'}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative hidden md:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-white"
               />
             </div>
             <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative">
               <Bell size={22} />
               <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
               {currentUser?.name.charAt(0)}
             </div>
          </div>
        </header>

        {/* Dynamic Views Content */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Dashboard Summary Widgets */}
          {activeTab === 'dashboard' && currentUser?.role !== UserRole.CITIZEN && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24} /></div>
                    <span className="text-xs font-bold text-lime-600 bg-lime-50 px-2 py-1 rounded">+12%</span>
                  </div>
                  <h4 className="text-slate-400 text-sm font-medium">Présents aujourd'hui</h4>
                  <p className="text-3xl font-bold text-slate-800 mt-1">1,284</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertCircle size={24} /></div>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">-2%</span>
                  </div>
                  <h4 className="text-slate-400 text-sm font-medium">Absents (Alertes)</h4>
                  <p className="text-3xl font-bold text-slate-800 mt-1">42</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-lime-50 text-lime-600 rounded-xl"><CheckCircle2 size={24} /></div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Stable</span>
                  </div>
                  <h4 className="text-slate-400 text-sm font-medium">Taux de Ponctualité</h4>
                  <p className="text-3xl font-bold text-slate-800 mt-1">94%</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><TrendingUp size={24} /></div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">IA</span>
                  </div>
                  <h4 className="text-slate-400 text-sm font-medium">Indice Performance</h4>
                  <p className="text-3xl font-bold text-slate-800 mt-1">8.4/10</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Tendances de Présence (Semaine)</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_STATS}>
                        <defs>
                          <linearGradient id="colorPresence" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="presence" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorPresence)" />
                        <Area type="monotone" dataKey="predicted" stroke="#65a30d" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Derniers Check-ins</h3>
                  <div className="space-y-4">
                    {MOCK_ATTENDANCE.map((att) => (
                      <div key={att.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                             {att.userName.charAt(4)}
                           </div>
                           <div>
                             <p className="font-bold text-slate-800">{att.userName}</p>
                             <p className="text-xs text-slate-500">{att.facility}</p>
                           </div>
                         </div>
                         <div className="text-right">
                           <p className={`text-sm font-bold ${att.status === 'PRESENT' ? 'text-lime-600' : att.status === 'LATE' ? 'text-orange-500' : 'text-red-500'}`}>
                             {att.status === 'PRESENT' ? `Arrivé à ${att.checkIn}` : att.status === 'LATE' ? `Retard ${att.checkIn}` : 'Absent'}
                           </p>
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest">FaceID Verified</p>
                         </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-3 text-blue-600 font-bold hover:bg-blue-50 rounded-xl transition-colors">
                    Voir tout le personnel
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Role-specific tab: Check-in (Doctor) */}
          {activeTab === 'checkin' && (
            <div className="flex flex-col items-center">
              <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl w-full max-w-2xl text-center">
                 <h3 className="text-3xl font-extrabold text-blue-900 mb-2">Check-in Biométrique</h3>
                 <p className="text-slate-500 mb-12">La reconnaissance faciale permet de sécuriser votre présence et d'éviter les fraudes.</p>
                 <CameraCheckIn onComplete={handleCheckInComplete} />
              </div>
            </div>
          )}

          {/* Role-specific tab: Map (Ministry) */}
          {activeTab === 'map' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
               <div className="xl:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
                 <h3 className="text-2xl font-bold text-slate-800 mb-2">Supervision Territoriale</h3>
                 <p className="text-slate-500 mb-8">Cliquez sur une région pour voir les détails de présence et les prédictions.</p>
                 <MoroccoMap onRegionClick={(r) => console.log(r)} />
               </div>
               <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
                 <h3 className="text-xl font-bold mb-6">Détails Région : Rabat-Salé</h3>
                 <div className="space-y-6">
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                       <p className="text-slate-400 text-sm">Taux Présence Global</p>
                       <p className="text-3xl font-bold text-lime-400">92.4%</p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                       <p className="text-slate-400 text-sm">Établissements Actifs</p>
                       <p className="text-3xl font-bold">142</p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                       <p className="text-slate-400 text-sm">Alertes Critiques</p>
                       <p className="text-3xl font-bold text-red-400">3</p>
                    </div>
                    <div className="mt-8">
                       <h4 className="font-bold text-lime-400 flex items-center gap-2 mb-4">
                         <TrendingUp size={20} /> Analyse IA
                       </h4>
                       <p className="text-sm text-slate-300 italic leading-relaxed">
                         "La région Nord présente un risque d'absentéisme accru de 5% pour mardi prochain en raison des prévisions météorologiques. Recommandation : Activer le pool de remplacement."
                       </p>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {/* Role-specific tab: Predictions IA */}
          {activeTab === 'predictions' && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm">
               <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                  <div className="w-20 h-20 bg-lime-100 text-lime-600 rounded-3xl flex items-center justify-center mb-6">
                    <TrendingUp size={40} />
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 mb-6">Analyse Prédictive IA</h3>
                  {predictions ? (
                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 relative">
                       <div className="absolute top-0 left-0 w-2 h-full bg-lime-500 rounded-l-2xl"></div>
                       <p className="text-xl text-slate-700 font-medium leading-relaxed italic">
                         "{predictions}"
                       </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-400 animate-pulse">
                      <RefreshCw className="animate-spin" />
                      Génération de l'analyse...
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 w-full text-left">
                     <div className="p-6 bg-blue-50 rounded-2xl">
                        <h4 className="font-bold text-blue-900 mb-2">Facteurs Influents</h4>
                        <ul className="text-sm text-blue-700 space-y-2">
                          <li>• Saisonalité grippale (+15% risque)</li>
                          <li>• Événements régionaux</li>
                          <li>• Historique des congés</li>
                        </ul>
                     </div>
                     <div className="p-6 bg-slate-900 text-white rounded-2xl">
                        <h4 className="font-bold text-lime-400 mb-2">Plan d'action</h4>
                        <ul className="text-sm text-slate-300 space-y-2">
                          <li>• Préparer les renforts</li>
                          <li>• Optimiser les plannings</li>
                          <li>• Alerter les directeurs</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* Citizen-specific tab: Feedback */}
          {activeTab === 'citizen-reviews' && (
            <div className="space-y-6">
               <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                 <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                   <MessageSquare className="text-blue-600" /> Retours d'expérience Citoyens
                 </h3>
                 <div className="space-y-6">
                   {[1, 2, 3].map((i) => (
                     <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                             <div>
                               <p className="font-bold text-slate-800">Citoyen #{1200 + i}</p>
                               <p className="text-xs text-slate-400">CHU Ibn Sina • Hier</p>
                             </div>
                           </div>
                           <div className="flex text-yellow-400">
                             {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill={s <= 4 ? "currentColor" : "none"} />)}
                           </div>
                        </div>
                        <p className="text-slate-600 italic">"Très bon accueil. Le personnel médical était présent et à l'écoute. Service rapide."</p>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          )}

          {/* User Role fallback if empty */}
          {activeTab === 'dashboard' && currentUser?.role === UserRole.CITIZEN && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
               <Logo size="lg" />
               <h3 className="mt-8 text-2xl font-bold text-slate-800">Évaluez vos services publics</h3>
               <p className="text-slate-500 mt-2 mb-10">Votre avis nous aide à améliorer la qualité et la présence dans nos établissements.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {['CHU Ibn Sina', 'Hôpital Militaire', 'Centre de Santé Rabat'].map((h) => (
                   <div key={h} className="p-6 border border-slate-200 rounded-3xl hover:border-blue-500 transition-all cursor-pointer text-left bg-slate-50">
                     <Building className="text-blue-600 mb-4" />
                     <h4 className="font-bold text-slate-800">{h}</h4>
                     <p className="text-xs text-slate-400 mb-4">Rabat, Maroc</p>
                     <button className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-bold">Donner mon avis</button>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
