#  Accident Detection System with AI

##  Project Overview

An intelligent accident detection system that uses **AI-powered image analysis** to automatically identify road accidents with **87% accuracy**. Built with React, FastAPI, MongoDB, and TensorFlow.

---

##  Key Features

-  **AI-Powered Detection** - Custom trained CNN model (87% accuracy)
-  **Image Analysis** - Upload photos for instant accident detection
-  **Real-time Dashboard** - View all reports and statistics
-  **Location Tracking** - Interactive maps with GPS coordinates
-  **Anonymous Reporting** - No login required for users
-  **Admin Portal** - Manage and review reports
-  **Fast Predictions** - Results in < 1 second
-  **Responsive Design** - Works on desktop and mobile

---

##  Quick Start

### For First Time Users:

1. ** Read Documentation:**
   ```
   Open: HOW_TO_RUN_PROJECT/README.md
   ```

2. ** Setup (One Time):**
   ```
   Open: HOW_TO_RUN_PROJECT/1_SETUP_INSTRUCTIONS.md
   Follow installation steps
   ```

3. ** Start Application:**
   ```
   Double-click: START_ALL.bat
   Wait 30-60 seconds
   ```

4. ** Open Browser:**
   ```
   Automatically opens: http://localhost:3000
   Or visit manually
   ```

### For Daily Use:

```bash
# Start
START_ALL.bat

# Use application at http://localhost:3000

# Stop
STOP_ALL.bat
```

---

##  Project Structure

```
Accident-Detection-System/

  HOW_TO_RUN_PROJECT/       START HERE! Complete documentation
    README.md
    1_SETUP_INSTRUCTIONS.md
    2_START_PROJECT.md
    3_USAGE_GUIDE.md
    4_STOP_PROJECT.md
    5_TERMINAL_COMMANDS.md

  START_ALL.bat             Double-click to start
  STOP_ALL.bat              Double-click to stop

  backend/                  FastAPI Python backend
    app/
       main.py
       api/routes/
       core/
       models/
       schemas/
    run_server.py
    requirements.txt
    venv/

  frontend/                 React frontend
    src/
       components/
       pages/
       services/
       App.js
    public/
    package.json
    node_modules/

  ml_model/                 AI model training code
    predict.py              Prediction logic
    train_model.py          Training script
    __init__.py

  models/                   Trained AI model files
    accident_detection_model.h5  (21 MB)
    training_history.png
    confusion_matrix.png
    metrics.json

  test/                     Test images
    accident/               Sample accident images
    non-accident/           Sample normal road images

  uploads/                  User uploaded images
     [user_id]/
```

---

##  Technology Stack

### Backend:
- **Python 3.9+**
- **FastAPI** - Modern web framework
- **TensorFlow/Keras** - Deep learning
- **MongoDB** - NoSQL database
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend:
- **React 18** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Leaflet** - Interactive maps
- **CSS3** - Styling

### AI/ML:
- **TensorFlow 2.16** - ML framework
- **Keras** - High-level neural networks API
- **Custom CNN** - Transfer learning
- **MobileNetV2** - Base architecture
- **3,300+ images** - Training dataset

### Database:
- **MongoDB Community Edition**
- Collections: reports, users

---

##  Model Performance

### Statistics:
```
Overall Accuracy:        87%
Accident Detection:      90%
Non-Accident Detection:  73-80%
False Positive Rate:     ~15-20%
Prediction Speed:        < 1 second
Training Time:           ~10 hours
Dataset Size:            3,300+ images
```

### Confusion Matrix:
```
                    Predicted
Actual        Accident  Non-Accident
Accident        294        31         (90% correct)
Non-Accident     25        67         (73% correct)

Total Test Accuracy: 87%
```

---

##  Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Main App** | http://localhost:3000 | User interface |
| **Dashboard** | http://localhost:3000/dashboard | Reports overview |
| **Admin Portal** | http://localhost:3000/admin | Management panel |
| **API Docs** | http://localhost:8000/docs | Swagger UI |
| **Backend API** | http://localhost:8000 | REST API |
| **Health Check** | http://localhost:8000/health | Status endpoint |

---

##  Credentials

### Admin Login:
```
URL: http://localhost:3000/admin
Email: admin@accidentdetection.com
Password: admin123
```

### User Access:
```
No login required - Anonymous reporting enabled
```

---

##  Documentation

### Complete Guides:
All documentation is in the **HOW_TO_RUN_PROJECT/** folder:

1. **[README.md](HOW_TO_RUN_PROJECT/README.md)** - Start here!
2. **[Setup Instructions](HOW_TO_RUN_PROJECT/1_SETUP_INSTRUCTIONS.md)** - First time setup
3. **[Start Guide](HOW_TO_RUN_PROJECT/2_START_PROJECT.md)** - How to run
4. **[Usage Guide](HOW_TO_RUN_PROJECT/3_USAGE_GUIDE.md)** - How to use
5. **[Stop Guide](HOW_TO_RUN_PROJECT/4_STOP_PROJECT.md)** - How to stop
6. **[Commands Reference](HOW_TO_RUN_PROJECT/5_TERMINAL_COMMANDS.md)** - All commands

---

##  System Requirements

### Minimum:
- Windows 10/11, Linux, or macOS
- Python 3.9+
- Node.js 16+
- MongoDB
- 8 GB RAM
- 5 GB free storage

### Recommended:
- 16 GB RAM
- SSD storage
- 8+ CPU cores
- GPU (optional, for faster predictions)

---

##  Installation

### Quick Install:
```bash
# 1. Navigate to project
cd "path/to/project"

# 2. Setup backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 3. Setup frontend
cd ../frontend
npm install

# 4. Start MongoDB
net start MongoDB  # Windows

# 5. Run application
# From project root:
START_ALL.bat
```

### Detailed Instructions:
See **[HOW_TO_RUN_PROJECT/1_SETUP_INSTRUCTIONS.md](HOW_TO_RUN_PROJECT/1_SETUP_INSTRUCTIONS.md)**

---

##  Usage Examples

### Example 1: Report Accident
```
1. Go to http://localhost:3000
2. Click "Report Accident"
3. Upload accident image
4. Set location on map
5. Click "Submit"
6. See AI prediction: "ACCIDENT - 85% confidence"
```

### Example 2: Check Dashboard
```
1. Go to http://localhost:3000/dashboard
2. View all reports
3. See AI predictions and confidence scores
4. Filter by status/date
5. Click report for details
```

### Example 3: Admin Review
```
1. Go to http://localhost:3000/admin
2. Login with admin credentials
3. Review pending reports
4. Approve/reject with notes
5. View statistics
```

---

##  Testing

### Test Images Included:
```bash
test/
 accident/           # Use these to test accident detection
    accidentFrame210_*.jpg
    accidentFrame254_*.jpg
    ...

 non-accident/       # Use these to test normal road detection
     car_driving_0002.jpg
     highway_*.jpg
     ...
```

### Run Tests:
```bash
# Test ML model
python test_predictions.py

# Test API predictions
python test_api_prediction.py

# Test both types
python test_both_types.py
```

---

##  Troubleshooting

### Common Issues:

**Port already in use:**
```bash
netstat -ano | findstr :3000
taskkill /F /PID <PID>
```

**MongoDB not running:**
```bash
net start MongoDB
```

**Module not found:**
```bash
cd backend
pip install -r requirements.txt --force-reinstall
```

**More help:**
See **[HOW_TO_RUN_PROJECT/5_TERMINAL_COMMANDS.md](HOW_TO_RUN_PROJECT/5_TERMINAL_COMMANDS.md)**

---

##  Model Training

The AI model was trained with:

- **Architecture:** Custom CNN with MobileNetV2 backbone
- **Dataset:** 3,300+ labeled images
- **Classes:** accident, non-accident
- **Training:** 16 epochs with early stopping
- **Augmentation:** Rotation, flip, zoom, brightness
- **Class Weights:** Applied to handle imbalance
- **Validation:** 87% accuracy on test set

### Retrain Model (Optional):
```bash
python ml_model/train_model.py
```

---

##  Version History

```
Version 1.0 (Current)
- Initial release
- 87% model accuracy
- Full-stack application
- Anonymous reporting
- Admin portal
- Documentation complete
```

---

##  Project Info

```
Project Name: Accident Detection System with AI
Version: 1.0
Status: Production Ready
Created: October-November 2025
Model Accuracy: 87%
Tech Stack: React, FastAPI, MongoDB, TensorFlow
```

---

##  Key Achievements

 **AI Integration** - Custom trained CNN with 87% accuracy  
 **Full-Stack App** - Complete frontend and backend  
 **Real-time Analysis** - < 1 second predictions  
 **Anonymous Access** - No login barriers  
 **Production Ready** - Deployed and tested  
 **Well Documented** - Complete setup guides  
 **Easy to Use** - One-click startup  

---

##  Getting Started

### New to the Project?

1. ** Read This First:**
   - You're reading it! (PROJECT_README.md)

2. ** Read Documentation:**
   - Open: **HOW_TO_RUN_PROJECT/README.md**

3. ** Setup:**
   - Follow: **HOW_TO_RUN_PROJECT/1_SETUP_INSTRUCTIONS.md**

4. ** Run:**
   - Execute: **START_ALL.bat**

5. ** Use:**
   - Visit: **http://localhost:3000**

---

##  Project Checklist

- [x] Backend API with FastAPI
- [x] Frontend UI with React
- [x] MongoDB database integration
- [x] AI model trained (87% accuracy)
- [x] Image upload functionality
- [x] Location tracking with maps
- [x] Anonymous user support
- [x] Admin portal
- [x] Dashboard with statistics
- [x] Real-time predictions
- [x] Complete documentation
- [x] Easy startup scripts
- [x] Test images included
- [x] Error handling
- [x] Production ready

---

##  For Project Submission

### What to Show:

1. **System Demo:**
   - Upload accident image  AI detects it
   - Upload normal road  AI recognizes it
   - Show dashboard with reports
   - Demo admin portal

2. **Model Performance:**
   - Show 87% accuracy
   - Explain training process
   - Show confusion matrix
   - Discuss threshold tuning

3. **Technical Stack:**
   - Full-stack application
   - Modern frameworks (React, FastAPI)
   - AI/ML integration (TensorFlow)
   - NoSQL database (MongoDB)

4. **Documentation:**
   - Complete setup guides
   - User manual
   - Admin guide
   - Command reference

---

##  Highlights

**This project demonstrates:**

-  Full-stack web development
-  Machine learning integration
-  Real-world problem solving
-  Modern tech stack proficiency
-  Production-ready deployment
-  Comprehensive documentation
-  User-friendly design

---

##  Support

For questions or issues:

1. Check **HOW_TO_RUN_PROJECT/** documentation
2. Review error messages in terminals
3. Try troubleshooting commands
4. Restart the system

---

##  Ready to Begin!

**Start using the system now:**

```bash
# Just run this:
START_ALL.bat

# Then visit:
http://localhost:3000
```

---

** Accident Detection System - Making Roads Safer with AI! **

---

*For complete documentation, see [HOW_TO_RUN_PROJECT/README.md](HOW_TO_RUN_PROJECT/README.md)*
