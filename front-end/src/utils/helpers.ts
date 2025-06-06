import { Player, FilterOptions, DraftSession } from '../types';

export function filterPlayers(players: Player[], filters: FilterOptions): Player[] {
  return players.filter(player => {
    // Position filter
    if (filters.position !== 'ALL' && player.position !== filters.position) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesName = player.name.toLowerCase().includes(searchLower);
      const matchesTeam = player.nflTeam.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesTeam) {
        return false;
      }
    }

    // Draft status filter - this replaces the old onlyAvailable logic
    if (filters.onlyAvailable && player.isDrafted) {
      return false;
    }
    
    // Show drafted filter - when enabled, only show drafted players
    if (filters.showDrafted && !player.isDrafted) {
      return false;
    }

    // NFL Team filter
    if (filters.nflTeam && player.nflTeam !== filters.nflTeam) {
      return false;
    }

    return true;
  });
}

export function sortPlayers(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    // Drafted players go to bottom
    if (a.isDrafted && !b.isDrafted) return 1;
    if (!a.isDrafted && b.isDrafted) return -1;
    
    // Sort by overall rank
    return a.overallRank - b.overallRank;
  });
}

export function getCurrentPickTeam(session: DraftSession): number {
  const { currentPick, numTeams, draftType } = session;
  const round = Math.ceil(currentPick / numTeams);
  
  if (draftType === 'linear') {
    return ((currentPick - 1) % numTeams) + 1;
  } else { // snake
    const isEvenRound = round % 2 === 0;
    if (isEvenRound) {
      return numTeams - ((currentPick - 1) % numTeams);
    } else {
      return ((currentPick - 1) % numTeams) + 1;
    }
  }
}

export function getPositionCounts(players: Player[]): Record<Player['position'], { total: number; drafted: number }> {
  const counts: Record<Player['position'], { total: number; drafted: number }> = {
    QB: { total: 0, drafted: 0 },
    RB: { total: 0, drafted: 0 },
    WR: { total: 0, drafted: 0 },
    TE: { total: 0, drafted: 0 },
    K: { total: 0, drafted: 0 },
    DST: { total: 0, drafted: 0 },
  };

  players.forEach(player => {
    counts[player.position].total++;
    if (player.isDrafted) {
      counts[player.position].drafted++;
    }
  });

  return counts;
}

export function exportToCsv(data: any[], filename: string): void {
  const csvContent = Papa.unparse(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Re-export Papa for use in exportToCsv
import Papa from 'papaparse';
