# Dino Runner: A Full-Stack Web Game with User Authentication and Score Tracking

This project is a small fun personal project, a full-stack web application that implements a Dino Runner game with user authentication, score tracking, and avatar upload functionality. The application consists of a React-based frontend and a FastAPI-based backend, providing a complete gaming experience with user management features.

The Dino Runner game is a side-scrolling endless runner where players control a dinosaur character, jumping over obstacles and ducking under flying objects to achieve the highest score possible. The game features retro-style graphics and intuitive controls, making it accessible and enjoyable for players of all ages.

The backend of the application handles user authentication using JWT tokens, stores user data and high scores in a SQLite database, and provides API endpoints for user registration, login, avatar upload, and score management. The frontend offers a responsive user interface with game controls, user profile management, and score display.

## Repository Structure

```
.
├── backend
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
├── frontend
│   ├── package.json
│   ├── public
│   │   ├── index.html
│   │   └── manifest.json
│   └── src
│       ├── App.js
│       ├── components
│       │   ├── Game.js
│       │   ├── Login.js
│       │   ├── Profile.js
│       │   ├── ProtectedRoute.js
│       │   └── Signup.js
|       ├── index.css
│       └── index.js

```

### Key Files:
- `backend/main.py`: Entry point for the FastAPI backend application
- `backend/database.py`: Database connection and session management
- `backend/models.py`: SQLAlchemy models for the database
- `backend/schemas.py`: Pydantic schemas for data validation
- `frontend/src/App.js`: Main React component and routing setup
- `frontend/src/components/Game.js`: Dino Runner game implementation
- `frontend/package.json`: Frontend dependencies and scripts
- `dotproduct.py`: Utility function for matrix-vector multiplication

## Usage Instructions

### Backend Setup

1. Ensure you have Python 3.7+ installed.
2. Navigate to the `backend` directory.
3. Create a virtual environment:
   ```
   python -m venv venv
   ```
4. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS and Linux: `source venv/bin/activate`
5. Install the required packages:
   ```
   pip install fastapi sqlalchemy pydantic passlib python-jose python-multipart
   ```
6. Start the backend server:
   ```
   uvicorn main:app --reload
   ```

The backend server will be running at `http://localhost:8000`.

### Frontend Setup

1. Ensure you have Node.js and npm installed.
2. Navigate to the `frontend` directory.
3. Install the required packages:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

The frontend application will be accessible at `http://localhost:3000`.

### Playing the Game

1. Open your web browser and navigate to `http://localhost:3000`.
2. Sign up for a new account or log in if you already have one.
3. Click on the "Game" link in the navigation bar to start playing.
4. Use the spacebar or up arrow key to jump, and the down arrow key to duck.
5. Try to avoid obstacles and achieve the highest score possible.
6. Your high scores will be automatically saved and can be viewed on your profile page.

### API Endpoints

- `POST /users/`: Create a new user account
- `POST /token`: Obtain a JWT token for authentication
- `POST /upload-avatar/{user_id}`: Upload a user avatar
- `POST /scores/`: Save a game score
- `GET /high-scores/{user_id}`: Retrieve top 10 high scores for a user

### Troubleshooting

1. CORS Issues:
   - Ensure that the backend CORS settings in `main.py` match your frontend URL.
   - If you're running the frontend on a different port, update the `allow_origins` list in the backend CORS middleware.

2. Database Errors:
   - Check that the SQLite database file `game.db` has been created in the backend directory.
   - Ensure you have write permissions in the backend directory.

3. Authentication Problems:
   - Verify that you're sending the correct credentials during login.
   - Check that the JWT token is being properly stored and sent with subsequent requests.

4. Game Performance:
   - If the game is running slowly, try closing other resource-intensive applications.
   - Ensure your browser is up to date, as older versions may have performance issues with canvas-based games.

## Data Flow

The Dino Runner application follows a client-server architecture with a clear separation between the frontend and backend components. Here's an overview of the data flow:

1. User Authentication:
   - User submits login credentials to the frontend.
   - Frontend sends a POST request to `/token` endpoint.
   - Backend validates credentials and returns a JWT token.
   - Frontend stores the token for subsequent authenticated requests.

2. Game Play:
   - User interacts with the game in the browser.
   - Game state is managed client-side in the `Game.js` component.
   - When the game ends, the frontend sends a POST request to `/scores/` with the user's score.
   - Backend saves the score in the database.

3. High Scores:
   - Frontend requests high scores via GET to `/high-scores/{user_id}`.
   - Backend queries the database and returns the top 10 scores.
   - Frontend displays the high scores in the user's profile.

4. Avatar Upload:
   - User selects an image file in the frontend.
   - Frontend sends a POST request to `/upload-avatar/{user_id}` with the file.
   - Backend saves the file and updates the user's avatar path in the database.

```
[Browser] <--> [React Frontend] <--> [FastAPI Backend] <--> [SQLite Database]
   |                |                       |
   |                |                       |
   |          Game Logic               Data Processing
   |          State Management         Authentication
   |          User Interface           File Handling
```