# Visual Studio Solution Setup

When you're ready to add a .NET backend, you can create a Visual Studio solution in the root directory:

## Steps to Add .NET Backend

1. **Create Solution File**:

    ```bash
    dotnet new sln -n FantasyToolsPilot
    ```

2. **Create Web API Project**:

    ```bash
    cd backend
    dotnet new webapi -n FantasyTools.Api
    dotnet sln ../FantasyToolsPilot.sln add FantasyTools.Api
    ```

3. **Add Additional Projects** (optional):

    ```bash
    dotnet new classlib -n FantasyTools.Core
    dotnet new classlib -n FantasyTools.Infrastructure
    dotnet sln ../FantasyToolsPilot.sln add FantasyTools.Core
    dotnet sln ../FantasyToolsPilot.sln add FantasyTools.Infrastructure
    ```

4. **Project Structure**:

    ```
    FantasyToolsPilot.sln
    backend/
    ├── FantasyTools.Api/          # Web API
    ├── FantasyTools.Core/         # Domain models & interfaces
    └── FantasyTools.Infrastructure/ # Data access & external services
    src/ (React app)
    ```

5. **Configure CORS** in the API to allow requests from the React dev server (localhost:3000)

6. **Update React** to use API endpoints instead of local state management

The current React application is fully functional as a standalone frontend and can be used immediately for local draft sessions.
