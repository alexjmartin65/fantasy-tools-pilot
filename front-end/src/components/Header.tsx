import { Upload, Download, Undo2 } from 'lucide-react';
import { useDraft } from '../context/DraftContext';
import { parseCSV, validateCSVStructure } from '../utils/csvParser';
import { exportToCsv } from '../utils/helpers';

export function Header() {
  const { state, importPlayers, undoPick, setLoading } = useDraft();
  const { session } = state;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const isValid = await validateCSVStructure(file);
      if (!isValid) {
        alert('Invalid CSV format. Please ensure your file has the required columns: Name, Pos, Team, ETR_Rank, Pos_Rank');
        return;
      }

      const players = await parseCSV(file);
      importPlayers(players);
      alert(`Successfully imported ${players.length} players`);
    } catch (error) {
      alert(`Error importing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const handleExportDraft = () => {
    if (!session) return;

    const draftData = session.draftLog.map(pick => ({
      Round: pick.round,
      Pick: pick.pick,
      Team: pick.team.name,
      Player: pick.player.name,
      Position: pick.player.position,
      NFLTeam: pick.player.nflTeam,
      OverallRank: pick.player.overallRank,
    }));

    exportToCsv(draftData, `${session.leagueName}_draft_results.csv`);
  };

  const handleExportRemaining = () => {
    if (!session) return;

    const remainingPlayers = session.players
      .filter(p => !p.isDrafted)
      .map(player => ({
        Name: player.name,
        Position: player.position,
        Team: player.nflTeam,
        OverallRank: player.overallRank,
        PositionRank: player.positionRank,
      }));

    exportToCsv(remainingPlayers, `${session.leagueName}_remaining_players.csv`);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Fantasy Football Live Draft Tool
          </h1>
          {session && (
            <div className="text-sm text-gray-600">
              {session.leagueName} • Round {session.currentRound} • Pick {session.currentPick}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* File Upload */}
          <label className="btn btn-secondary btn-md cursor-pointer">
            <Upload size={16} className="mr-2" />
            Import Players
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={state.isLoading}
            />
          </label>

          {/* Undo Pick */}
          {session && session.draftLog.length > 0 && (
            <button
              onClick={undoPick}
              className="btn btn-secondary btn-md"
              disabled={state.isLoading}
            >
              <Undo2 size={16} className="mr-2" />
              Undo Pick
            </button>
          )}

          {/* Export Options */}
          {session && session.draftLog.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={handleExportDraft}
                className="btn btn-secondary btn-md"
                disabled={state.isLoading}
              >
                <Download size={16} className="mr-2" />
                Export Draft
              </button>
              <button
                onClick={handleExportRemaining}
                className="btn btn-secondary btn-md"
                disabled={state.isLoading}
              >
                <Download size={16} className="mr-2" />
                Export Remaining
              </button>
            </div>
          )}
        </div>
      </div>

      {state.isLoading && (
        <div className="mt-2">
          <div className="h-1 bg-gray-200 rounded">
            <div className="h-1 bg-primary-600 rounded animate-pulse"></div>
          </div>
        </div>
      )}
    </header>
  );
}
