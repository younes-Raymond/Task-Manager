@echo off

rem Start the backend server
echo Starting backend server...
cd backend
npx nodemon server.js

rem Output a message before starting the frontend server
echo Starting frontend server...

rem Open a new command prompt window for the frontend server
start cmd /k "cd ../frontend && npm start"

rem Pause to keep the command prompt window open for debugging
pause
