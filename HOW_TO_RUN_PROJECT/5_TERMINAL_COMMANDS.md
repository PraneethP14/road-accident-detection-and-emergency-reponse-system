#  Terminal Commands Quick Reference

##  Table of Contents

1. [Initial Setup Commands](#initial-setup-commands)
2. [Start Commands](#start-commands)
3. [Stop Commands](#stop-commands)
4. [Troubleshooting Commands](#troubleshooting-commands)
5. [Development Commands](#development-commands)
6. [MongoDB Commands](#mongodb-commands)

---

##  Initial Setup Commands

### Navigate to Project
```bash
cd "C:\path\to\Accident and Non-accident label Image Dataset.v14-hai-s-augment-attempt.clip"
```

### Check Prerequisites
```bash
# Check Python version (need 3.9+)
python --version

# Check Node version (need 16+)
node --version

# Check MongoDB
mongosh --eval "db.version()"

# Check pip
pip --version

# Check npm
npm --version
```

---

##  Backend Setup Commands

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activate virtual environment (Windows CMD)
venv\Scripts\activate.bat

# Activate virtual environment (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# List installed packages
pip list

# Update pip
python -m pip install --upgrade pip

# Deactivate virtual environment
deactivate
```

---

##  Frontend Setup Commands

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# List packages
npm list --depth=0

# Update npm
npm install -g npm@latest

# Clear npm cache (if issues)
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

##  Start Commands

### Start All (Recommended)
```bash
# Windows - Use batch file
START_ALL.bat

# Or manually:
```

### Start MongoDB
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod

# Check status
sc query MongoDB  # Windows
sudo systemctl status mongod  # Linux/Mac
```

### Start Backend
```bash
# Navigate to backend
cd backend

# Activate venv (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Start server
python run_server.py

# Alternative (from project root)
cd backend && python run_server.py
```

### Start Frontend
```bash
# Navigate to frontend
cd frontend

# Start development server
npm start

# Alternative with different port
PORT=3001 npm start  # Linux/Mac
set PORT=3001 && npm start  # Windows
```

---

##  Stop Commands

### Stop Frontend
```bash
# In frontend terminal
Ctrl + C

# Confirm if asked
Y
```

### Stop Backend
```bash
# In backend terminal
Ctrl + C
```

### Stop MongoDB
```bash
# Windows
net stop MongoDB

# Linux/Mac
sudo systemctl stop mongod
```

### Force Stop Processes
```bash
# Windows - Kill by process name
taskkill /F /IM python.exe
taskkill /F /IM node.exe

# Windows - Kill by PID
taskkill /F /PID <PID_NUMBER>

# Linux/Mac
killall python
killall node

# Or by PID
kill -9 <PID_NUMBER>
```

### Stop by Port
```bash
# Find process on port 8000
netstat -ano | findstr :8000

# Find process on port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /F /PID <PID_NUMBER>
```

---

##  Verification Commands

### Check if Services Running
```bash
# Check ports
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :27017

# Check processes
tasklist | findstr python
tasklist | findstr node
tasklist | findstr mongod
```

### Test Endpoints
```bash
# Test backend
curl http://localhost:8000/health

# Test frontend
curl http://localhost:3000

# Test MongoDB
mongosh --eval "db.runCommand({ ping: 1 })"
```

### Check Logs
```bash
# View backend logs (in terminal running server)
# Logs appear automatically

# View frontend logs (in terminal running npm)
# Logs appear automatically
```

---

##  Troubleshooting Commands

### Clear Port Issues
```bash
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill the process
taskkill /F /PID <PID>

# Verify port is free
netstat -ano | findstr :8000
# Should return nothing
```

### Fix Module Not Found
```bash
# Backend
cd backend
pip install -r requirements.txt --force-reinstall

# Frontend
cd frontend
npm install --force
```

### Reset Virtual Environment
```bash
cd backend

# Remove old venv
rm -rf venv  # Linux/Mac
rmdir /s venv  # Windows

# Create new venv
python -m venv venv

# Activate and install
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Reset Node Modules
```bash
cd frontend

# Remove node_modules
rm -rf node_modules package-lock.json  # Linux/Mac
rmdir /s node_modules  # Windows
del package-lock.json  # Windows

# Reinstall
npm install
```

### MongoDB Issues
```bash
# Restart MongoDB
net stop MongoDB
net start MongoDB

# Check MongoDB log
# Windows: C:\Program Files\MongoDB\Server\{version}\log\
# Linux: /var/log/mongodb/mongod.log

# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use project database
use accident_detection

# Show collections
show collections

# Count documents
db.reports.countDocuments()
```

---

##  Development Commands

### Backend Development

```bash
# Run backend with reload on changes
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run with different port
uvicorn app.main:app --reload --port 8001

# Check Python packages
pip list

# Update a package
pip install --upgrade package_name

# Install new package
pip install package_name

# Update requirements.txt
pip freeze > requirements.txt
```

### Frontend Development

```bash
# Start with hot reload (default)
npm start

# Build for production
npm run build

# Test production build
npm run serve

# Check for updates
npm outdated

# Update packages
npm update

# Install new package
npm install package_name
```

### Testing Commands

```bash
# Test backend endpoints
python test_api_prediction.py

# Test ML model
python test_predictions.py

# Test both accident types
python test_both_types.py

# Test model loading
python test_predictor_load.py
```

---

##  MongoDB Commands

### Basic Operations

```bash
# Connect to MongoDB
mongosh

# Show databases
show dbs

# Use accident detection database
use accident_detection

# Show collections
show collections

# View reports
db.reports.find().pretty()

# Count reports
db.reports.countDocuments()

# Find specific report
db.reports.findOne({ "_id": ObjectId("...") })

# Find by status
db.reports.find({ "status": "pending" })

# Find accidents
db.reports.find({ "prediction.is_accident": true })

# Delete a report
db.reports.deleteOne({ "_id": ObjectId("...") })

# Delete all reports (CAREFUL!)
db.reports.deleteMany({})

# Exit MongoDB shell
exit
```

### Backup & Restore

```bash
# Backup database
mongodump --db accident_detection --out ./backup

# Restore database
mongorestore --db accident_detection ./backup/accident_detection

# Export collection to JSON
mongoexport --db accident_detection --collection reports --out reports.json

# Import from JSON
mongoimport --db accident_detection --collection reports --file reports.json
```

---

##  Status Check Commands

### Complete System Check

```bash
# 1. Check Python
python --version

# 2. Check Node
node --version

# 3. Check MongoDB
sc query MongoDB

# 4. Check Backend port
netstat -ano | findstr :8000

# 5. Check Frontend port
netstat -ano | findstr :3000

# 6. Test Backend
curl http://localhost:8000/health

# 7. Test Frontend
curl http://localhost:3000

# 8. Check ML model
# Look for this in backend terminal:
# " ML model loaded successfully"
```

---

##  Environment & Configuration

### View Environment Variables
```bash
# Windows
set

# Linux/Mac
env

# Check specific variable
echo %PATH%  # Windows
echo $PATH  # Linux/Mac
```

### Python Virtual Environment
```bash
# Check if venv is activated
# Look for (venv) in terminal prompt

# Show Python location
where python  # Windows
which python  # Linux/Mac

# Show pip location
where pip  # Windows
which pip  # Linux/Mac
```

---

##  Package Management

### Update All Packages

```bash
# Backend (Python)
cd backend
pip list --outdated
pip install --upgrade package_name

# Frontend (Node)
cd frontend
npm outdated
npm update
```

### Install Specific Versions

```bash
# Python
pip install tensorflow==2.16.1

# Node
npm install react@18.2.0
```

---

##  Quick Command Combinations

### Full Start Sequence
```bash
# 1. Start MongoDB
net start MongoDB

# 2. Start Backend (Terminal 1)
cd backend && .\venv\Scripts\Activate.ps1 && python run_server.py

# 3. Start Frontend (Terminal 2)
cd frontend && npm start
```

### Full Stop Sequence
```bash
# 1. Stop Frontend (Ctrl + C in Terminal 2)
# 2. Stop Backend (Ctrl + C in Terminal 1)
# 3. Stop MongoDB
net stop MongoDB
```

### Quick Restart
```bash
# Backend only
# Ctrl + C in backend terminal
python run_server.py

# Frontend only
# Ctrl + C in frontend terminal
npm start
```

---

##  Common Command Chains

### Setup New Machine
```bash
# Navigate to project
cd "path\to\project"

# Setup backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ..

# Setup frontend
cd frontend
npm install
cd ..

# Start MongoDB
net start MongoDB
```

### Daily Startup
```bash
# Just run the batch file!
START_ALL.bat

# Or manually:
net start MongoDB
cd backend && .\venv\Scripts\Activate.ps1 && python run_server.py
# In new terminal:
cd frontend && npm start
```

### Clean Restart
```bash
# Stop everything
Ctrl + C  # In both terminals
net stop MongoDB

# Wait 5 seconds

# Start everything
START_ALL.bat
```

---

##  Emergency Commands

### System Frozen - Force Stop All
```bash
taskkill /F /IM python.exe
taskkill /F /IM node.exe
net stop MongoDB /y
```

### Clear All Ports
```bash
# Port 3000
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Port 8000
netstat -ano | findstr :8000
taskkill /F /PID <PID>

# Port 27017
netstat -ano | findstr :27017
# MongoDB - use: net stop MongoDB
```

### Nuclear Option - Kill Everything
```bash
# ONLY USE IN EMERGENCY!
taskkill /F /IM python.exe
taskkill /F /IM node.exe
taskkill /F /IM mongod.exe
```

---

##  Command Reference Summary

| Task | Command | Location |
|------|---------|----------|
| **Start All** | `START_ALL.bat` | Project root |
| **Stop All** | `Ctrl + C` (both terminals) | Terminals |
| **Start Backend** | `python run_server.py` | backend/ |
| **Start Frontend** | `npm start` | frontend/ |
| **Start MongoDB** | `net start MongoDB` | Any |
| **Check Port 8000** | `netstat -ano \| findstr :8000` | Any |
| **Check Port 3000** | `netstat -ano \| findstr :3000` | Any |
| **Kill Process** | `taskkill /F /PID <PID>` | Any |
| **Test Backend** | `curl localhost:8000/health` | Any |
| **MongoDB Shell** | `mongosh` | Any |

---

 **Save this file for quick command reference!**

**Pro Tip:** Keep this file open in a separate window while working on the project.
