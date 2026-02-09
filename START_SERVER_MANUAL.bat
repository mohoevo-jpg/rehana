@echo off
echo Starting Rehana Backend Server...
cd /d "%~dp0backend"
start /min cmd /c "npm install && node server.js"

echo Starting Cloudflare Tunnel...
start /min cmd /c "cloudflared.exe tunnel run --token eyJhIjoiYjU1YWFiNDA3ZTRjODdiN2I3YTlhZWRjNmI5ZDlmYjgiLCJ0IjoiYjdiZWFiZjAtMTQ4ZC00MzNkLWE2NmMtMDA1NTE1YmQxYzlmIiwicyI6Ik1tVXhZV0kzTVdRdE5XWXdOeTAwWWpNd0xUaGlNakF0T1dKbU16ZGhNVEJrTlRFeSJ9"

echo Services started in background.
timeout /t 5
