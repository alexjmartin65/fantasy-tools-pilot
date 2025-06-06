import { Search, Filter } from 'lucide-react';
import { useDraft } from '../context/DraftContext';
import { Position } from '../types';
import { getPositionCounts } from '../utils/helpers';

const positions: { value: Position; label: string }[] = [
  { value: 'ALL', label: 'All Positions' },
  { value: 'QB', label: 'Quarterback' },
  { value: 'RB', label: 'Running Back' },
  { value: 'WR', label: 'Wide Receiver' },
  { value: 'TE', label: 'Tight End' },
  { value: 'K', label: 'Kicker' },
  { value: 'DST', label: 'Defense/ST' },
];

export function PlayerFilters() {
  const { state, setFilters } = useDraft();
  const { session, filters } = state;

  const positionCounts = session ? getPositionCounts(session.players) : null;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search players or teams..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Position Filter */}
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filters.position}
            onChange={(e) => setFilters({ position: e.target.value as Position })}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {positions.map(pos => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
                {positionCounts && pos.value !== 'ALL' && (
                  ` (${positionCounts[pos.value].total - positionCounts[pos.value].drafted}/${positionCounts[pos.value].total})`
                )}
              </option>
            ))}
          </select>
        </div>        {/* Available Only Toggle */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={(e) => setFilters({ onlyAvailable: e.target.checked, showDrafted: false })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Available only</span>
        </label>

        {/* Show Drafted Toggle */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showDrafted}
            onChange={(e) => setFilters({ showDrafted: e.target.checked, onlyAvailable: false })}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="text-sm text-gray-700">Show drafted</span>
        </label>

        {/* Position Counts */}
        {positionCounts && (
          <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600">
            {Object.entries(positionCounts).map(([pos, counts]) => (
              <div key={pos} className="flex items-center space-x-1">
                <span className="font-medium">{pos}:</span>
                <span>{counts.total - counts.drafted}/{counts.total}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
