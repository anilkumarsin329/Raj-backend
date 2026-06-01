@echo off
echo Installing Passport Google OAuth dependencies...
npm install passport passport-google-oauth20 express-session
echo.
echo Dependencies installed successfully!
echo.
echo Setup Instructions:
echo 1. Add to Backend/.env:
echo    GOOGLE_CLIENT_ID=679451935692-1l0qvndq7ekp1uiqfqs6v65n93mefftc.apps.googleusercontent.com
echo    GOOGLE_CLIENT_SECRET=your_google_client_secret
echo.
echo 2. Add to Frontend/.env:
echo    VITE_GOOGLE_CLIENT_ID=your_google_client_id
echo.
echo 3. Google Console Setup:
echo    - Authorized origins: http://localhost:5000
echo    - Redirect URI: http://localhost:5000/api/auth/google/callback
echo.
echo 4. Restart servers: npm run dev
pause