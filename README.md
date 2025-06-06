# Fantasy Football Live Draft Tool

A React-based web application for managing fantasy football draft sessions in real-time.

## Prerequisites

-   Node.js 18+ (✅ currently using v22.16.0)
-   npm or yarn package manager

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The application will open at `http://localhost:3000/`

3. Open your browser to `http://localhost:3000`

## Features

-   **Player Rankings Import**: Upload CSV files with player rankings
-   **Live Draft Tracking**: Real-time tracking of drafted players
-   **Position-Based Filtering**: Filter by QB, RB, WR, TE, K, DST
-   **Team Management**: Track picks by team with draft order
-   **Export Functionality**: Export draft results and remaining players

## Usage

1. **Create Draft Session**: Set up league name, number of teams (8-20), and draft type (snake/linear)
2. **Import Players**: Upload a CSV file with player rankings (see example_rankings.csv for format)
3. **Start Drafting**: Use the interface to draft players for each team
4. **Export Results**: Download draft results and remaining player lists

## CSV Format

Your player rankings CSV should include these columns:

-   `Name`: Player name
-   `Pos`: Position (QB, RB, WR, TE, K, DST)
-   `Team`: NFL team abbreviation
-   `ETR_Rank`: Overall ranking number
-   `Pos_Rank`: Position ranking (e.g., "WR01", "RB05")

## Project Structure

```
fantasy-tools-pilot/
├── src/                    # React source files
│   ├── components/         # React components
│   ├── context/           # React context for state management
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── hooks/             # Custom React hooks
├── public/                # Static assets
├── dist/                  # Build output
└── backend/               # (Future .NET backend)
```

## Development Commands

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run preview` - Preview production build
-   `npm run lint` - Run ESLint

## Technology Stack

-   **Frontend**: React 18 + TypeScript
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **State Management**: React Context + useReducer
-   **CSV Parsing**: Papa Parse
-   **Icons**: Lucide React

## Browser Support

-   Chrome 90+
-   Firefox 88+
-   Safari 14+
-   Edge 90+

## Future Backend Integration

The project structure is prepared for adding a .NET backend:

-   Backend API will be placed in `/backend` folder
-   Frontend will connect via REST API endpoints
-   Data persistence will be added for multi-session support
