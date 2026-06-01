@echo off
echo Installing Google Auth Library...
npm install google-auth-library@^9.6.3
echo Google Auth Library installed successfully!
echo.
echo Don't forget to:
echo 1. Add your Google Client ID and Secret to .env file
echo 2. Restart your server: npm run dev
pause