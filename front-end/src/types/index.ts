export interface Player {
  id: string;
  name: string;
  position: "QB" | "RB" | "WR" | "TE" | "K" | "DST";
  nflTeam: string;
  overallRank: number;
  positionRank: string; // e.g., "WR01", "RB05"
  isDrafted: boolean;
  draftedByTeam?: number;
  draftPosition?: number;
}

export interface Team {
  id: number;
  name: string;
  roster: Player[];
  draftOrder: number;
}

export interface DraftPick {
  id: string;
  player: Player;
  team: Team;
  round: number;
  pick: number;
  timestamp: Date;
}

export interface DraftSession {
  id: string;
  leagueName: string;
  numTeams: number;
  draftType: "snake" | "linear";
  currentPick: number;
  currentRound: number;
  teams: Team[];
  players: Player[];
  draftLog: DraftPick[];
  createdAt: Date;
  updatedAt: Date;
}

export type Position = "QB" | "RB" | "WR" | "TE" | "K" | "DST" | "ALL";

export interface FilterOptions {
  position: Position;
  searchTerm: string;
  onlyAvailable: boolean;
  showDrafted: boolean;
  nflTeam?: string;
}
