@echo off
REM Wrapper script to run PowerShell audit script
REM Usage: set VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx && run_local_audits.bat

if "%VITE_CLERK_PUBLISHABLE_KEY%"=="" (
    echo ERROR: VITE_CLERK_PUBLISHABLE_KEY environment variable is not set
    echo.
    echo Usage:
    echo   set VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx ^&^& scripts\run_local_audits.bat
    echo.
    exit /b 1
)

powershell -ExecutionPolicy Bypass -File "%~dp0run_local_audits.ps1"
