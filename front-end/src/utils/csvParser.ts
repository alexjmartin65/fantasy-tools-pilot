import Papa from 'papaparse';
import { Player } from '../types';

export interface CSVPlayerData {
  Name: string;
  Pos: string;
  Team: string;
  ETR_Rank: string;
  Pos_Rank: string;
}

export function parseCSV(file: File): Promise<Player[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVPlayerData>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const players = results.data.map((row, index) => {
            const player: Player = {
              id: `player-${index}-${Date.now()}`,
              name: row.Name?.trim() || '',
              position: normalizePosition(row.Pos?.trim() || ''),
              nflTeam: row.Team?.trim() || '',
              overallRank: parseInt(row.ETR_Rank) || index + 1,
              positionRank: row.Pos_Rank?.trim() || '',
              isDrafted: false,
            };
            return player;
          }).filter(player => player.name && player.position);

          resolve(players);
        } catch (error) {
          reject(new Error('Failed to parse CSV data'));
        }
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      },
    });
  });
}

function normalizePosition(position: string): Player['position'] {
  const pos = position.toUpperCase();
  switch (pos) {
    case 'QB':
      return 'QB';
    case 'RB':
      return 'RB';
    case 'WR':
      return 'WR';
    case 'TE':
      return 'TE';
    case 'K':
      return 'K';
    case 'DST':
    case 'D/ST':
    case 'DEF':
      return 'DST';
    default:
      throw new Error(`Unknown position: ${position}`);
  }
}

export function validateCSVStructure(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      preview: 1,
      complete: (results) => {
        const requiredFields = ['Name', 'Pos', 'Team', 'ETR_Rank', 'Pos_Rank'];
        const fields = results.meta.fields || [];
        const hasAllFields = requiredFields.every(field => fields.includes(field));
        resolve(hasAllFields);
      },
      error: () => resolve(false),
    });
  });
}
