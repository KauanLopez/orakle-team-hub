import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { HomePage } from './pages/HomePage';
import { PerformancePage } from './pages/PerformancePage';
import { RankingPage } from './pages/RankingPage';
import { RequestsPage } from './pages/RequestsPage';
import { CalendarPage } from './pages/CalendarPage';
import { TeamPage } from './pages/TeamPage';
import { RewardsPage } from './pages/RewardsPage';
import { GamesPage } from './pages/GamesPage';
import { ProfilePage } from './pages/ProfilePage';
import { SupportPage } from './pages/SupportPage';

export const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  // Iniciar a sidebar fechada em telas grandes por padrão para melhor visualização inicial
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'performance': return <PerformancePage />;
      case 'ranking': return <RankingPage />;
      case 'requests': return <RequestsPage />;
      case 'calendar': return <CalendarPage />;
      case 'team': return <TeamPage />;
      case 'rewards': return <RewardsPage />;
      case 'games': return <GamesPage />;
      case 'profile': return <ProfilePage />;
      case 'support': return <SupportPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      {/* A mágica acontece aqui: ajustamos a margem esquerda (ml) em telas grandes (lg) */}
      <div 
        className={`
          flex flex-col flex-1 transition-all duration-300 ease-in-out
          lg:ml-20  // Margem padrão para sidebar recolhida
          ${sidebarOpen && 'lg:ml-64'} // Margem quando a sidebar está aberta
        `}
      >
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};