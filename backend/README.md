# Backend API

This directory will contain the .NET backend API for the Fantasy Football Live Draft Tool.

## Planned Architecture

-   **ASP.NET Core Web API** - RESTful API endpoints
-   **Entity Framework Core** - Database ORM
-   **SQL Server/SQLite** - Database storage
-   **SignalR** - Real-time communication for live draft updates

## Future Endpoints

```
GET    /api/sessions           - Get all draft sessions
POST   /api/sessions           - Create new draft session
GET    /api/sessions/{id}      - Get specific session
PUT    /api/sessions/{id}      - Update session
DELETE /api/sessions/{id}      - Delete session

GET    /api/sessions/{id}/players    - Get players for session
POST   /api/sessions/{id}/draft      - Draft a player
DELETE /api/sessions/{id}/undo       - Undo last pick

GET    /api/players                  - Get all players
POST   /api/players/import           - Import players from CSV
```

## Database Schema

```sql
Sessions
- Id (uniqueidentifier)
- LeagueName (nvarchar)
- NumTeams (int)
- DraftType (nvarchar)
- CurrentPick (int)
- CurrentRound (int)
- CreatedAt (datetime)
- UpdatedAt (datetime)

Teams
- Id (int)
- SessionId (uniqueidentifier)
- Name (nvarchar)
- DraftOrder (int)

Players
- Id (uniqueidentifier)
- Name (nvarchar)
- Position (nvarchar)
- NflTeam (nvarchar)
- OverallRank (int)
- PositionRank (nvarchar)
- SessionId (uniqueidentifier)

DraftPicks
- Id (uniqueidentifier)
- PlayerId (uniqueidentifier)
- TeamId (int)
- Round (int)
- Pick (int)
- Timestamp (datetime)
```

## To Add Backend

1. Create new ASP.NET Core Web API project in this directory
2. Add to Visual Studio solution
3. Configure Entity Framework with appropriate database provider
4. Implement API controllers and SignalR hubs
5. Update React frontend to use API endpoints instead of local state
