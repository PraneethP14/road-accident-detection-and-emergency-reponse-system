#  How to Stop the Project

##  Quick Stop (Recommended)

### Method 1: Using Batch File (Windows)

1. **Double-click** `STOP_ALL.bat` in project root
2. All services will shut down automatically
3. Wait for confirmation message

 Done! All servers stopped safely.

---

##  Step-by-Step Manual Stop

### Step 1: Stop Frontend Server

1. **Go to Frontend Terminal** (the one running `npm start`)

2. **Press:** `Ctrl + C`

3. **Confirm if asked:**
   ```
   Terminate batch job (Y/N)? Y
   ```

4. **Wait for message:**
   ```
   Gracefully shutting down...
   Process terminated
   ```

 **Frontend stopped!**

---

### Step 2: Stop Backend Server

1. **Go to Backend Terminal** (the one running `python run_server.py`)

2. **Press:** `Ctrl + C`

3. **Wait for shutdown message:**
   ```
   INFO: Shutting down
    Shutting down application...
    Closed MongoDB connection
    Application shut down complete
   ```

 **Backend stopped!**

---

### Step 3: Stop MongoDB (Optional)

MongoDB can keep running in the background. Only stop if needed.

#### Windows:
```bash
net stop MongoDB
```

#### Linux/Mac:
```bash
sudo systemctl stop mongod
```

 **MongoDB stopped!**

---

##  Graceful Shutdown vs Force Stop

###  Graceful Shutdown (Recommended)

**Use:** `Ctrl + C` in terminals

**Benefits:**
- Saves all data properly
- Closes database connections
- Cleans up temporary files
- No data corruption

**Time:** 2-5 seconds per service

---

###  Force Stop (Use Only When Needed)

**Use when:**
- Service is frozen/not responding
- Ctrl + C doesn't work
- Terminal is unresponsive

#### Force Stop Backend (Windows):
```bash
# Find Python processes
tasklist | findstr python

# Kill specific process (replace PID with actual number)
taskkill /F /PID <PID>
```

#### Force Stop Frontend (Windows):
```bash
# Find Node processes
tasklist | findstr node

# Kill specific process
taskkill /F /PID <PID>
```

#### Force Stop by Port:
```bash
# Backend on port 8000
netstat -ano | findstr :8000
taskkill /F /PID <PID>

# Frontend on port 3000
netstat -ano | findstr :3000
taskkill /F /PID <PID>
```

---

##  Clean Shutdown Checklist

Follow this checklist for a complete clean shutdown:

### Before Stopping:

- [ ] Save any work in progress
- [ ] Note any important Report IDs
- [ ] Close all browser tabs accessing the app
- [ ] Make sure no uploads are in progress

### During Shutdown:

- [ ] Stop Frontend first (`Ctrl + C`)
- [ ] Wait for confirmation message
- [ ] Stop Backend second (`Ctrl + C`)
- [ ] Wait for "Application shut down complete"
- [ ] Close both terminal windows

### After Stopping:

- [ ] All terminals closed
- [ ] No "localhost:3000" or "localhost:8000" tabs open
- [ ] If needed, stop MongoDB
- [ ] Deactivate virtual environment (if manually activated)

---

##  Verify Services are Stopped

### Check if Backend Stopped:

```bash
# Should return nothing
netstat -ano | findstr :8000
```

### Check if Frontend Stopped:

```bash
# Should return nothing
netstat -ano | findstr :3000
```

### Check if Processes Stopped:

**Windows:**
```bash
# Should show no Python/Node processes from project
tasklist | findstr "python node"
```

**Linux/Mac:**
```bash
ps aux | grep -E "python|node"
```

---

##  Save Work Before Stopping

### What Gets Saved Automatically:

 **Always Saved:**
- All submitted reports
- User data
- Admin actions
- Database records
- Uploaded images

 **NOT Saved:**
- Forms in progress (not submitted)
- Pending uploads
- Unsaved admin notes
- Open dashboards/tabs

---

##  Emergency Shutdown

### If System Becomes Unresponsive:

#### Option 1: Close Terminals
1. Click X on terminal windows
2. Confirm "Terminate all processes"

#### Option 2: Task Manager (Windows)
1. Press `Ctrl + Shift + Esc`
2. Find Python/Node processes
3. Right-click  End Task

#### Option 3: Command Line Kill
```bash
# Kill all Python processes
taskkill /F /IM python.exe

# Kill all Node processes
taskkill /F /IM node.exe
```

 **Warning:** Only use emergency shutdown when normal methods fail!

---

##  Restart vs Stop

### Just Restarting? 

**Don't stop MongoDB!**

1. Stop Frontend (`Ctrl + C`)
2. Stop Backend (`Ctrl + C`)
3. Leave MongoDB running
4. Start Backend again
5. Start Frontend again

**Benefits:**
- Faster restart (15-20 seconds)
- No database reconnection needed
- Data immediately available

### Completely Stopping?

**Stop everything including MongoDB:**

1. Stop Frontend
2. Stop Backend
3. Stop MongoDB
4. Close all terminals
5. Close browser

**When to do this:**
- End of work session
- System maintenance
- Computer shutdown/restart

---

##  Stop Time Estimates

| Service | Time to Stop | Method |
|---------|-------------|---------|
| **Frontend** | 2-3 seconds | `Ctrl + C` |
| **Backend** | 3-5 seconds | `Ctrl + C` |
| **MongoDB** | 5-10 seconds | `net stop MongoDB` |
| **Total** | ~10-18 seconds | Normal shutdown |

---

##  Common Stop Issues

### Issue: Ctrl + C not working

**Solutions:**
1. Press `Ctrl + C` multiple times
2. Wait 10 seconds
3. Close terminal window (force stop)
4. Use Task Manager

---

### Issue: Process still running after stop

**Check:**
```bash
netstat -ano | findstr :8000
netstat -ano | findstr :3000
```

**Solution:**
```bash
taskkill /F /PID <PID>
```

---

### Issue: Can't restart after stopping

**Error:** `Port already in use`

**Solution:**
```bash
# Kill processes on ports
netstat -ano | findstr :8000
taskkill /F /PID <PID>

netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Wait 5 seconds
# Try starting again
```

---

### Issue: MongoDB won't stop

**Windows:**
```bash
# Force stop MongoDB service
net stop MongoDB /y

# Or
sc stop MongoDB
```

**Check status:**
```bash
sc query MongoDB
```

---

##  Deactivate Virtual Environment

If you manually activated the virtual environment:

**Windows PowerShell:**
```bash
deactivate
```

**Linux/Mac:**
```bash
deactivate
```

You'll know it's deactivated when `(venv)` disappears from terminal prompt.

---

##  Verify Clean Shutdown

Run these checks:

### 1. No Services Running
```bash
netstat -ano | findstr :8000
netstat -ano | findstr :3000
# Both should return nothing
```

### 2. No Project Processes
```bash
tasklist | findstr "python node"
# Should not show project-related processes
```

### 3. Ports Available
```bash
# Try connecting (should fail)
curl http://localhost:3000
curl http://localhost:8000
# Both should show connection refused
```

 **All checks passed = Clean shutdown!**

---

##  Shutdown Checklist Summary

**Quick Checklist:**

```
1. [ ] Close browser tabs (localhost:3000, localhost:8000)
2. [ ] Stop Frontend (Ctrl + C in Terminal 1)
3. [ ] Stop Backend (Ctrl + C in Terminal 2)
4. [ ] Optional: Stop MongoDB (net stop MongoDB)
5. [ ] Verify ports free (netstat -ano | findstr :3000)
6. [ ] Close terminals
7. [ ] Deactivate venv (if manually activated)
```

---

##  Next Steps

- **2_START_PROJECT.md** - How to start again
- **6_TROUBLESHOOTING.md** - Common issues
- **5_TERMINAL_COMMANDS.md** - Quick command reference

---

 **Services Successfully Stopped!**

**To restart:**
- Run `START_ALL.bat`
- Or follow **2_START_PROJECT.md**

**Remember:**
- Always use `Ctrl + C` first
- Force stop only when necessary
- MongoDB can stay running between sessions
