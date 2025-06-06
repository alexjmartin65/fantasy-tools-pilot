import { useState } from 'react';
import { Play, Users } from 'lucide-react';
import { useDraft } from '../context/DraftContext';

export function DraftSetup() {
  const { createSession } = useDraft();
  const [leagueName, setLeagueName] = useState('My Fantasy League');
  const [numTeams, setNumTeams] = useState(12);
  const [draftType, setDraftType] = useState<'snake' | 'linear'>('snake');

  const handleCreateSession = () => {
    if (!leagueName.trim()) {
      alert('Please enter a league name');
      return;
    }

    if (numTeams < 8 || numTeams > 20) {
      alert('Number of teams must be between 8 and 20');
      return;
    }

    createSession(leagueName.trim(), numTeams, draftType);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Play size={32} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Fantasy Football Live Draft Tool
          </h1>
          <p className="text-gray-600">
            Set up your draft session to get started
          </p>
        </div>

        <div className="space-y-6">
          {/* League Name */}
          <div>
            <label htmlFor="leagueName" className="block text-sm font-medium text-gray-700 mb-2">
              League Name
            </label>
            <input
              id="leagueName"
              type="text"
              value={leagueName}
              onChange={(e) => setLeagueName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter league name"
            />
          </div>

          {/* Number of Teams */}
          <div>
            <label htmlFor="numTeams" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Teams
            </label>
            <select
              id="numTeams"
              value={numTeams}
              onChange={(e) => setNumTeams(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {Array.from({ length: 13 }, (_, i) => i + 8).map(num => (
                <option key={num} value={num}>
                  {num} Teams
                </option>
              ))}
            </select>
          </div>

          {/* Draft Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Draft Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="snake"
                  checked={draftType === 'snake'}
                  onChange={(e) => setDraftType(e.target.value as 'snake' | 'linear')}
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  Snake Draft (1-12, 12-1, 1-12...)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="linear"
                  checked={draftType === 'linear'}
                  onChange={(e) => setDraftType(e.target.value as 'snake' | 'linear')}
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  Linear Draft (1-12, 1-12, 1-12...)
                </span>
              </label>
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateSession}
            className="w-full btn btn-primary py-3 font-medium"
          >
            <Users size={20} className="mr-2" />
            Create Draft Session
          </button>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Next Steps:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Import your player rankings CSV file</li>
              <li>Start drafting players by clicking the "Draft" button</li>
              <li>Use filters to find specific positions or players</li>
              <li>Export your draft results when complete</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
