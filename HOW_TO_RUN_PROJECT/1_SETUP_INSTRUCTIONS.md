#  Project Setup Instructions

##  Prerequisites

Before running this project, ensure you have:

### Required Software:
1. **Python 3.9 or higher**
   - Download: https://www.python.org/downloads/
   -  During installation, check "Add Python to PATH"

2. **Node.js 16 or higher**
   - Download: https://nodejs.org/
   - Includes npm (Node Package Manager)

3. **MongoDB Community Edition**
   - Download: https://www.mongodb.com/try/download/community
   - Install and start MongoDB service

4. **Git** (optional, for version control)
   - Download: https://git-scm.com/downloads

---

##  Initial Setup (First Time Only)

### Step 1: Extract the Project

1. Extract the ZIP file to a location on your computer
2. Example: `C:\Projects\Accident-Detection\`

### Step 2: Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `cmd` or `powershell`
- Press Enter

**OR**

- Right-click in project folder
- Select "Open in Terminal"

### Step 3: Navigate to Project Directory

```bash
cd "path\to\project\folder"
```

Example:
```bash
cd "C:\Users\YourName\Desktop\Accident and Non-accident label Image Dataset.v14-hai-s-augment-attempt.clip"
```

---

##  Backend Setup

### Step 1: Navigate to Backend Folder

```bash
cd backend
```

### Step 2: Create Virtual Environment (Recommended)

```bash
python -m venv venv
```

### Step 3: Activate Virtual Environment

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

### Step 4: Install Python Dependencies

```bash
pip install -r requirements.txt
```

 This may take 5-10 minutes depending on your internet speed.

### Step 5: Verify Installation

```bash
pip list
```

You should see packages like:
- fastapi
- uvicorn
- tensorflow
- pymongo
- pydantic

---

##  Frontend Setup

### Step 1: Navigate to Frontend Folder

```bash
# From project root
cd frontend
```

### Step 2: Install Node Dependencies

```bash
npm install
```

 This may take 3-5 minutes.

### Step 3: Verify Installation

```bash
npm list --depth=0
```

You should see packages like:
- react
- react-router-dom
- axios
- leaflet

---

##  Database Setup

### Step 1: Check MongoDB is Running

**Windows:**
```bash
# Check if MongoDB service is running
sc query MongoDB
```

**If not running:**
```bash
net start MongoDB
```

**Linux/Mac:**
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

### Step 2: Verify MongoDB Connection

Open MongoDB Shell:
```bash
mongosh
```

Or check connection:
```bash
# This should return MongoDB version
mongosh --eval "db.version()"
```

---

##  Setup Verification Checklist

- [ ] Python 3.9+ installed (`python --version`)
- [ ] Node.js 16+ installed (`node --version`)
- [ ] MongoDB running (`mongosh --eval "db.version()"`)
- [ ] Backend dependencies installed (`cd backend && pip list`)
- [ ] Frontend dependencies installed (`cd frontend && npm list --depth=0`)
- [ ] Virtual environment activated (see `(venv)` in terminal)

---

##  Configuration (Optional)

### Backend Configuration

Edit `backend/.env` if you need to change:
- MongoDB connection string
- API keys
- Upload directories
- Port numbers

Default values work for local development!

---

##  Common Setup Issues

### Issue 1: Python not found
```
'python' is not recognized as an internal or external command
```
**Solution:**
- Reinstall Python with "Add to PATH" checked
- Or use `py` instead of `python`

### Issue 2: MongoDB connection failed
```
MongoServerError: connect ECONNREFUSED
```
**Solution:**
```bash
# Start MongoDB service
net start MongoDB
```

### Issue 3: Port already in use
```
Error: Port 3000/8000 already in use
```
**Solution:**
```bash
# Find and kill process using the port
netstat -ano | findstr :3000
taskkill /F /PID <PID_NUMBER>
```

### Issue 4: TensorFlow installation failed
```
ERROR: Could not find a version that satisfies the requirement tensorflow
```
**Solution:**
- Ensure Python 3.9-3.11 (TensorFlow doesn't support 3.12 yet)
- Use: `pip install tensorflow==2.16.1`

---

##  Need Help?

If you encounter issues:

1. Check error message carefully
2. Ensure all prerequisites are installed
3. Try restarting your computer
4. Verify Python and Node versions

---

##  Next Steps

After setup is complete, go to:
- **2_START_PROJECT.md** - Learn how to start the application
- **3_USAGE_GUIDE.md** - Learn how to use the application
- **4_STOP_PROJECT.md** - Learn how to properly shut down

---

 **Setup Complete! You're ready to run the project.**
