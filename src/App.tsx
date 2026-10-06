import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { DashboardView } from '@/views/DashboardView';
import { ProductionView } from '@/views/ProductionView';
import { EquipmentView } from '@/views/EquipmentView';
import { AnalyticsView } from '@/views/AnalyticsView';
import { IncidentsView } from '@/views/IncidentsView';
import { AICenterView } from '@/views/AICenterView';
import { BusinessView } from '@/views/BusinessView';
import { ArchitectureView } from '@/views/ArchitectureView';
import { DemoMode } from '@/views/DemoMode';
import type { ViewId } from '@/types';

const VIEW_META: Record<ViewId, { title: string; subtitle: string }> = {
  home: { title: 'Главная', subtitle: 'Обзор производства и ключевые показатели' },
  production: { title: 'Производство', subtitle: 'Данные производства и контроля качества' },
  equipment: { title: 'Оборудование', subtitle: 'Мониторинг простоев оборудования' },
  analytics: { title: 'Аналитика', subtitle: 'Интерактивные графики и анализ данных' },
  incidents: { title: 'Инциденты', subtitle: 'Журнал отклонений и инцидентов' },
  'ai-center': { title: 'AI-центр', subtitle: 'Прогнозирование и анализ рисков' },
  business: { title: 'Бизнес-эффект', subtitle: 'Оценка потенциальной экономии' },
  architecture: { title: 'Архитектура', subtitle: 'Схема системы цифрового двойника' },
};

function App() {
  const [view, setView] = useState<ViewId>('home');
  const [demoMode, setDemoMode] = useState(false);

  if (demoMode) {
    return <DemoMode onExit={() => setDemoMode(false)} />;
  }

  const meta = VIEW_META[view];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0e17]">
      <Sidebar
        current={view}
        onNavigate={setView}
        onDemo={() => setDemoMode(true)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <TopBar title={meta.title} subtitle={meta.subtitle} />

        <div className="flex-1 min-h-0">
          {view === 'home' && <DashboardView date="02.10.2026" />}
          {view === 'production' && <ProductionView />}
          {view === 'equipment' && <EquipmentView />}
          {view === 'analytics' && <AnalyticsView />}
          {view === 'incidents' && <IncidentsView />}
          {view === 'ai-center' && <AICenterView />}
          {view === 'business' && <BusinessView />}
          {view === 'architecture' && <ArchitectureView />}
        </div>
      </main>
    </div>
  );
}

export default App;
