import { DraftProvider, useDraft } from './context/DraftContext';
import { Header } from './components/Header';
import { PlayerFilters } from './components/PlayerFilters';
import { PlayerList } from './components/PlayerList';
import { DraftBoard } from './components/DraftBoard';
import { DraftSetup } from './components/DraftSetup';

function AppContent() {
  const { state } = useDraft();
  const { session } = state;

  if (!session) {
    return <DraftSetup />;
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <PlayerFilters />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <PlayerList />
        </div>
        <div className="w-96 hidden lg:block">
          <DraftBoard />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <DraftProvider>
      <AppContent />
    </DraftProvider>
  );
}

export default App;
