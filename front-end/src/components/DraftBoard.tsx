import { useDraft } from '../context/DraftContext';

export function DraftBoard() {
  const { state } = useDraft();
  const { session } = state;

  if (!session) return null;

  const getRosterByTeam = (teamId: number) => {
    return session.players.filter(p => p.draftedByTeam === teamId);  };

  const maxRounds = 16; // Typical fantasy roster size

  return (
    <div className="bg-white border-l border-gray-200 h-full overflow-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">Draft Board</h2>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 gap-4">
          {session.teams.map(team => {
            const roster = getRosterByTeam(team.id);
            return (
              <div key={team.id} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">
                    {team.name}
                    <span className="ml-2 text-sm text-gray-600">
                      ({roster.length} picks)
                    </span>
                  </h3>
                </div>
                <div className="p-4">
                  {roster.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No picks yet</p>
                  ) : (
                    <div className="space-y-2">
                      {roster
                        .sort((a, b) => (a.draftPosition || 0) - (b.draftPosition || 0))
                        .map(player => (
                          <div
                            key={player.id}
                            className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded"
                          >
                            <div>
                              <span className="font-medium">{player.name}</span>
                              <span className="ml-2 text-sm text-gray-600">
                                {player.position} - {player.nflTeam}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Pick {player.draftPosition}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Draft Order Preview */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Next 10 Picks</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Array.from({ length: 10 }, (_, i) => {
              const pickNum = session.currentPick + i;
              const round = Math.ceil(pickNum / session.numTeams);
              
              if (round > maxRounds) return null;
              
              let teamId: number;
              if (session.draftType === 'snake') {
                const isEvenRound = round % 2 === 0;
                if (isEvenRound) {
                  teamId = session.numTeams - ((pickNum - 1) % session.numTeams);
                } else {
                  teamId = ((pickNum - 1) % session.numTeams) + 1;
                }
              } else {
                teamId = ((pickNum - 1) % session.numTeams) + 1;
              }
              
              const team = session.teams.find(t => t.id === teamId);
              const isCurrentPick = i === 0;
              
              return (
                <div
                  key={pickNum}
                  className={`p-2 text-center text-sm rounded border ${
                    isCurrentPick
                      ? 'bg-primary-100 border-primary-300 text-primary-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="font-medium">Pick {pickNum}</div>
                  <div className="text-xs">{team?.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
