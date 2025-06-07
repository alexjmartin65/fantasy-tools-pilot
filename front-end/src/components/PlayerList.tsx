import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useDraft } from '../context/DraftContext';
import { Player } from '../types';
import { filterPlayers, sortPlayers, getCurrentPickTeam } from '../utils/helpers';

const positionColors = {
  QB: 'bg-red-100 text-red-800',
  RB: 'bg-green-100 text-green-800',
  WR: 'bg-blue-100 text-blue-800',
  TE: 'bg-yellow-100 text-yellow-800',
  K: 'bg-purple-100 text-purple-800',
  DST: 'bg-gray-100 text-gray-800',
};

export function PlayerList() {
  const { state, draftPlayer } = useDraft();
  const { session, filters } = state;
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Draft Session</h3>
          <p className="text-gray-600">Create a new draft session to get started.</p>
        </div>
      </div>
    );
  }
  const filteredPlayers = filterPlayers(session.players, filters);
  const sortedPlayers = sortPlayers(filteredPlayers, filters);
  const currentTeamId = getCurrentPickTeam(session);

  const handleDraftPlayer = (player: Player) => {
    if (player.isDrafted) return;

    let teamId = selectedTeam || currentTeamId;
    
    // If no team selected and not auto-draft, prompt user
    if (!selectedTeam) {
      const team = session.teams.find(t => t.id === currentTeamId);
      const confirmMessage = `Draft ${player.name} for ${team?.name}?`;
      if (!confirm(confirmMessage)) return;
    }

    draftPlayer(player, teamId);
    setSelectedTeam(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Team Selector for Manual Drafting */}
      <div className="border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Draft for team:</span>
            <select
              value={selectedTeam || currentTeamId}
              onChange={(e) => setSelectedTeam(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {session.teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name} {team.id === currentTeamId && '(On the Clock)'}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredPlayers.length} players shown
          </div>
        </div>
      </div>      {/* Players Table */}
      <div className="flex-1 overflow-y-auto overflow-x-auto shadow-inner" style={{
        maxHeight: 'calc(100vh - 240px)',
        minHeight: '400px',
        scrollBehavior: 'smooth'
      }}>
        {sortedPlayers.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No players found matching your filters.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 relative">
            <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>            <tbody className="bg-white divide-y divide-gray-200 relative">
              {sortedPlayers.map((player, index) => (
                <tr
                  key={player.id}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    player.isDrafted 
                      ? filters.showDrafted 
                        ? 'bg-orange-50 border-l-4 border-orange-400' 
                        : 'opacity-50'
                      : ''
                  } ${index % 2 === 0 ? 'bg-gray-25' : 'bg-white'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{player.overallRank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {player.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {player.positionRank}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${positionColors[player.position]}`}>
                      {player.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {player.nflTeam}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {player.isDrafted ? (
                      <span className="text-red-600">
                        Drafted by {session.teams.find(t => t.id === player.draftedByTeam)?.name}
                        {player.draftPosition && ` (Pick ${player.draftPosition})`}
                      </span>
                    ) : (
                      <span className="text-green-600">Available</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!player.isDrafted && (
                      <button
                        onClick={() => handleDraftPlayer(player)}
                        className="btn btn-primary btn-sm"
                        disabled={state.isLoading}
                      >
                        <Plus size={14} className="mr-1" />
                        Draft
                      </button>
                    )}
                  </td>
                </tr>              ))}
            </tbody>
          </table>
        )}
        {/* Scroll indicator - shows when there's more content below */}
        {sortedPlayers.length > 10 && (
          <div className="sticky bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none opacity-60"></div>
        )}
      </div>
    </div>
  );
}
