@echo off
cd /d "%~dp0"

C:\game\mysql\bin\mysqladmin.exe -u root ping >nul 2>&1
if errorlevel 1 (
  start "" /min C:\game\mysql_start.bat
  timeout /t 2 /nobreak >nul
)

echo MediaGallery: http://127.0.0.1:8891
C:\game\php\php.exe -d upload_max_filesize=512M -d post_max_size=520M -S 127.0.0.1:8891 -t src router.php
