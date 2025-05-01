@echo off
REM Wrapper batch file to run the PowerShell initialization script
powershell -ExecutionPolicy Bypass -File "%~dp0init.ps1"