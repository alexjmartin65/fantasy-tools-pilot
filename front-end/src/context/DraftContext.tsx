import { createContext, useContext, useReducer, ReactNode } from 'react';
import { DraftSession, Player, Team, DraftPick, FilterOptions } from '../types';

interface DraftState {
  session: DraftSession | null;
  filters: FilterOptions;
  isLoading: boolean;
}

type DraftAction =
  | { type: 'SET_SESSION'; payload: DraftSession }
  | { type: 'DRAFT_PLAYER'; payload: { player: Player; teamId: number } }
  | { type: 'UNDO_PICK' }
  | { type: 'SET_FILTERS'; payload: Partial<FilterOptions> }
  | { type: 'IMPORT_PLAYERS'; payload: Player[] }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: DraftState = {
  session: null,
  filters: {
    position: 'ALL',
    searchTerm: '',
    onlyAvailable: true,
    showDrafted: false,
  },
  isLoading: false,
};

function draftReducer(state: DraftState, action: DraftAction): DraftState {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, session: action.payload };
    
    case 'DRAFT_PLAYER':
      if (!state.session) return state;
      
      const { player, teamId } = action.payload;
      const updatedPlayer = {
        ...player,
        isDrafted: true,
        draftedByTeam: teamId,
        draftPosition: state.session.currentPick,
      };
      
      const updatedPlayers = state.session.players.map(p =>
        p.id === player.id ? updatedPlayer : p
      );
      
      const team = state.session.teams.find(t => t.id === teamId);
      if (!team) return state;
      
      const draftPick: DraftPick = {
        id: `pick-${state.session.currentPick}`,
        player: updatedPlayer,
        team,
        round: state.session.currentRound,
        pick: state.session.currentPick,
        timestamp: new Date(),
      };
      
      const nextPick = state.session.currentPick + 1;
      const nextRound = Math.ceil(nextPick / state.session.numTeams);
      
      return {
        ...state,
        session: {
          ...state.session,
          players: updatedPlayers,
          draftLog: [...state.session.draftLog, draftPick],
          currentPick: nextPick,
          currentRound: nextRound,
          updatedAt: new Date(),
        },
      };
    
    case 'UNDO_PICK':
      if (!state.session || state.session.draftLog.length === 0) return state;
      
      const lastPick = state.session.draftLog[state.session.draftLog.length - 1];
      const revertedPlayers = state.session.players.map(p =>
        p.id === lastPick.player.id
          ? { ...p, isDrafted: false, draftedByTeam: undefined, draftPosition: undefined }
          : p
      );
      
      return {
        ...state,
        session: {
          ...state.session,
          players: revertedPlayers,
          draftLog: state.session.draftLog.slice(0, -1),
          currentPick: lastPick.pick,
          currentRound: lastPick.round,
          updatedAt: new Date(),
        },
      };
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    
    case 'IMPORT_PLAYERS':
      if (!state.session) return state;
      
      return {
        ...state,
        session: {
          ...state.session,
          players: action.payload,
          updatedAt: new Date(),
        },
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    default:
      return state;
  }
}

interface DraftContextType {
  state: DraftState;
  draftPlayer: (player: Player, teamId: number) => void;
  undoPick: () => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  importPlayers: (players: Player[]) => void;
  createSession: (leagueName: string, numTeams: number, draftType: 'snake' | 'linear') => void;
  setLoading: (loading: boolean) => void;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);

export function DraftProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(draftReducer, initialState);

  const draftPlayer = (player: Player, teamId: number) => {
    dispatch({ type: 'DRAFT_PLAYER', payload: { player, teamId } });
  };

  const undoPick = () => {
    dispatch({ type: 'UNDO_PICK' });
  };

  const setFilters = (filters: Partial<FilterOptions>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const importPlayers = (players: Player[]) => {
    dispatch({ type: 'IMPORT_PLAYERS', payload: players });
  };

  const createSession = (leagueName: string, numTeams: number, draftType: 'snake' | 'linear') => {
    const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
      id: i + 1,
      name: `Team ${i + 1}`,
      roster: [],
      draftOrder: i + 1,
    }));

    const session: DraftSession = {
      id: `session-${Date.now()}`,
      leagueName,
      numTeams,
      draftType,
      currentPick: 1,
      currentRound: 1,
      teams,
      players: [],
      draftLog: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({ type: 'SET_SESSION', payload: session });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  return (
    <DraftContext.Provider
      value={{
        state,
        draftPlayer,
        undoPick,
        setFilters,
        importPlayers,
        createSession,
        setLoading,
      }}
    >
      {children}
    </DraftContext.Provider>
  );
}

export function useDraft() {
  const context = useContext(DraftContext);
  if (context === undefined) {
    throw new Error('useDraft must be used within a DraftProvider');
  }
  return context;
}
