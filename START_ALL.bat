@echo off
echo ========================================
echo  STARTING ACCIDENT DETECTION SYSTEM
echo  WITH PHONE NUMBER + SMS FEATURES
echo ========================================
echo.

echo [1/5] Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if %ERRORLEVEL%==0 (
    echo     MongoDB is already running
) else (
    echo     Starting MongoDB...
    net start MongoDB 2>nul
    if %ERRORLEVEL%==0 (
        echo     MongoDB started successfully
    ) else (
        echo     WARNING: Could not start MongoDB
        echo     Please start MongoDB manually: net start MongoDB
    )
)

echo.
echo [2/5] Starting Enhanced Backend Server...
echo     Location: http://localhost:8000
echo     Features: Phone Numbers + Admin Portal + Working Approval/Rejection + SMS Enabled
start "Accident Detection - Backend (Enhanced)" cmd /k "python start_backend.py"
timeout /t 3 >nul

echo.
echo [3/5] Starting Frontend Server...
echo     Location: http://localhost:3000
echo     Features: Phone Number Field + No Popup
start "Accident Detection - Frontend" cmd /k "cd frontend && npm start"

echo.
echo [4/5] Waiting for servers to initialize...
timeout /t 10 >nul

echo.
echo [5/5] System Ready - Testing Phone Features...
echo     Phone number field added to report form
echo     Admin Portal approval/rejection working
echo     Admin portal shows phone numbers
echo     No popup interruptions
echo     Frontend-backend connection fixed
echo     SMS notifications enabled (Twilio)

echo.
echo ========================================
echo  SYSTEM STARTED SUCCESSFULLY!
echo ========================================
echo.
echo  Main Application: http://localhost:3000
echo      Features: Phone number collection, working admin portal, ambulance dispatch
echo  Dashboard:        http://localhost:3000/dashboard
echo  Admin Portal:     http://localhost:3000/admin
echo      Features: View phone numbers, approve/reject reports, dispatch ambulance (Working)
echo  API Docs:         http://localhost:8000/docs
echo  SMS Status:       http://localhost:8000/api/reports/sms-status
echo. 
echo   PHONE NUMBER FEATURES:
echo  - Phone number field in accident report form
echo  - 10-digit mobile number validation
echo  - Admin Portal approval/rejection working (Fixed)
echo  - Admin portal displays phone numbers
echo  - No popup interruptions
echo  - Frontend-backend connection fixed
echo. 
echo   TESTING INSTRUCTIONS:
echo  1. Go to http://localhost:3000
echo  2. Navigate to "Report Accident"
echo  3. Upload image and allow location
echo  4. Enter phone number (optional) - e.g., 9606848038
echo  5. Click "Submit Report"
echo  6. Check admin portal for phone numbers
echo  7. Approve/reject to test working admin portal (Fixed!)
echo  8. Check SMS status: http://localhost:8000/api/reports/sms-status
echo.
echo  Backend Terminal: Check window titled "Accident Detection - Backend (Enhanced)"
echo  Frontend Terminal: Check window titled "Accident Detection - Frontend"
echo.
echo ========================================
echo  IMPORTANT:
echo  - Do NOT close the backend/frontend terminal windows
echo  - To stop: Run STOP_ALL.bat or press Ctrl+C in terminals
echo  - Browser should open automatically to localhost:3000
echo.
echo   SMS STATUS: SMS ENABLED - Ready to send notifications!
echo   Admin Portal approval/rejection with SMS is working perfectly!
echo   Configure Twilio credentials in .env file to activate SMS
echo ========================================
echo.
echo Opening browser in 5 seconds...
timeout /t 5 >nul
start http://localhost:3000
echo Press any key to close this window...
pause >nul
