#  How to Start the Project

##  Quick Start (3 Steps)

### Method 1: Using Batch File (Windows - Easiest)

1. **Double-click** `START_ALL.bat` in project root
2. Wait for servers to start (30-60 seconds)
3. Open browser: http://localhost:3000

 Done! Both backend and frontend will start automatically.

---

### Method 2: Manual Start (All Platforms)

Follow these steps in order:

---

##  Step-by-Step Manual Start

### Step 1: Start MongoDB

**Windows:**
```bash
# Check if already running
sc query MongoDB

# If not running, start it
net start MongoDB
```

**Linux/Mac:**
```bash
sudo systemctl start mongod
```

**Verification:**
```bash
mongosh --eval "db.version()"
```
Should show MongoDB version number.

---

### Step 2: Start Backend Server

#### Open Terminal/Command Prompt #1

**Navigate to backend folder:**
```bash
cd backend
```

**Activate virtual environment:**

**Windows PowerShell:**
```bash
.\venv\Scripts\Activate.ps1
```

**Windows Command Prompt:**
```bash
venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

**Start the backend:**
```bash
python run_server.py
```

**Expected output:**
```
INFO: Started server process
INFO: Waiting for application startup
 Starting Road Accident Detection System...
 Connected to MongoDB at mongodb://localhost:27017
 Admin user already exists
 Application started successfully!
INFO: Uvicorn running on http://0.0.0.0:8000
```

 **Backend is running!** Leave this terminal open.

---

### Step 3: Start Frontend Server

#### Open NEW Terminal/Command Prompt #2

**Navigate to frontend folder:**
```bash
cd frontend
```

**Start the frontend:**
```bash
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view accident-detection-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

 **Frontend is running!** Browser should open automatically.

If not, manually open: http://localhost:3000

---

##  Accessing the Application

Once both servers are running:

### Main Application
```
http://localhost:3000
```
**Use this to:**
- Report accidents
- Upload images
- See AI predictions

### Dashboard
```
http://localhost:3000/dashboard
```
**Use this to:**
- View all reports
- Check statistics
- See AI confidence scores

### Admin Portal
```
http://localhost:3000/admin
```
**Login credentials:**
- Email: `admin@accidentdetection.com`
- Password: `admin123`

**Use this to:**
- Manage reports
- Approve/reject submissions
- View analytics

### API Documentation
```
http://localhost:8000/docs
```
**Use this to:**
- Test API endpoints
- View API schema
- Test requests directly

---

##  Verification Checklist

Ensure all components are running:

- [ ] **MongoDB running** 
  ```bash
  mongosh --eval "db.version()"
  ```

- [ ] **Backend running on port 8000** 
  - Terminal shows "Uvicorn running on http://0.0.0.0:8000"
  - Visit: http://localhost:8000/health

- [ ] **Frontend running on port 3000** 
  - Terminal shows "Compiled successfully!"
  - Visit: http://localhost:3000

- [ ] **ML Model loaded** 
  - Backend terminal shows: " ML model loaded successfully"

---

##  Terminal Layout Recommendation

Keep terminals organized:

**Terminal 1 (Backend):**
```
Title: Accident Detection - Backend
Location: backend/
Status: Running run_server.py
```

**Terminal 2 (Frontend):**
```
Title: Accident Detection - Frontend
Location: frontend/
Status: Running npm start
```

 **Tip:** Don't close these terminals while using the application!

---

##  Restarting After Errors

If you encounter errors:

### Restart Backend:
1. In backend terminal, press `Ctrl + C`
2. Wait for process to stop
3. Run: `python run_server.py`

### Restart Frontend:
1. In frontend terminal, press `Ctrl + C`
2. Wait for process to stop
3. Run: `npm start`

### Full Restart:
```bash
# Stop everything (Ctrl + C in both terminals)
# Then run START_ALL.bat again
# Or manually restart following steps above
```

---

##  Troubleshooting

### Backend won't start

**Error:** `Port 8000 already in use`

**Solution:**
```bash
# Find process on port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /F /PID <PID>

# Restart backend
python run_server.py
```

---

### Frontend won't start

**Error:** `Port 3000 already in use`

**Solution:**
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Restart frontend
npm start
```

---

### MongoDB connection failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
```bash
# Start MongoDB
net start MongoDB

# Verify it's running
sc query MongoDB

# Restart backend
python run_server.py
```

---

### ML Model not loading

**Error:** `Could not load ML model`

**Check:**
1. File exists: `models/accident_detection_model.h5`
2. Size: ~20 MB
3. Backend logs show the path it's trying to load from

**Solution:**
- Model file should be in `models/` folder in project root
- If missing, you need to train the model first (see 5_TRAINING_MODEL.md)

---

##  Performance Tips

### Speed up startup:

1. **Use SSD:** Install project on SSD drive
2. **Close other apps:** Free up RAM
3. **First run is slow:** TensorFlow takes time to initialize
4. **Subsequent runs:** Much faster (20-30 seconds)

---

##  Expected Startup Time

- **MongoDB:** ~2-5 seconds
- **Backend:** ~10-15 seconds
- **Frontend:** ~20-30 seconds
- **Total:** ~30-50 seconds

First run may take up to 2 minutes due to ML model loading.

---

##  Success Indicators

You'll know everything is working when:

1.  **Backend terminal** shows: `Uvicorn running on http://0.0.0.0:8000`
2.  **Frontend terminal** shows: `Compiled successfully!`
3.  **Browser opens** to http://localhost:3000
4.  **Website loads** with "Accident Detection" header
5.  **No error messages** in either terminal

---

##  Next Steps

- Go to **3_USAGE_GUIDE.md** to learn how to use the application
- Go to **4_STOP_PROJECT.md** to learn how to properly shut down

---

 **Your Accident Detection System is now running!**

**Quick Access:**
- Main App: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard
- Admin: http://localhost:3000/admin
- API: http://localhost:8000/docs
