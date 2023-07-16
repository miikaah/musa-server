@echo off
echo Building musa-server backend...
rmdir /q /s dist
call npm run build:backend

echo Building musa frontend...
cd %FRONTEND_DIR%
node scripts/buildDistributable.mjs server

echo Copying frontend to distributable...
cd %BACKEND_DIR%
xcopy "%FRONTEND_DIR%\build-server" dist\public\ /s /e