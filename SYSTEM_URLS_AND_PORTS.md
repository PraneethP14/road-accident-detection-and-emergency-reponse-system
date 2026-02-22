# System URLs and Ports Reference

## Frontend (React Application)
- **Port**: 3000
- **Main URL**: http://localhost:3000
- **Purpose**: Accident Detection and Reporting Application

### Frontend Routes
- **Report Accident**: http://localhost:3000 (Main Page)
- **Dashboard**: http://localhost:3000/dashboard
- **Admin Portal**: http://localhost:3000/admin

## Backend (FastAPI)
- **Port**: 8000
- **Base URL**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Backend API Endpoints
- **Create Report**: `POST /api/reports/create`
  - Accepts image upload, location, phone number
  - Returns prediction result
  
- **Get Reports**: `GET /api/reports`
  - Retrieves all accident reports
  
- **Admin Approve**: `POST /api/reports/{id}/approve`
  - Admin approves a report and triggers SMS
  
- **Admin Reject**: `POST /api/reports/{id}/reject`
  - Admin rejects a report
  
- **SMS Status**: `GET /api/reports/sms-status`
  - Checks SMS notification status

## Database
- **Type**: MongoDB
- **Default Port**: 27017
- **Status**: Started automatically by START_ALL.bat

## ML Model
- **Current Predictor**: ImprovedBalancedPredictor (v2.0)
- **Location**: ml_model/improved_balanced_predictor.py
- **Features**:
  - Reduced false positives on non-accident scenes
  - Better detection of accident images
  - Threshold: 0.35 (conservative)

## Test Data Organization
- **Accident Images**: test/accident/
  - Files: 1.jpg, 2.jpeg, 3.jpeg, 4.jpeg, 5.jpeg, 6.jpeg, 7.jpeg, 8.jpeg, 9.jpeg, 10.jpeg
  
- **Non-Accident Images**: test/non-accident/
  - Files: test1.jpeg, test2.jpeg, test3.jpg, test4.jpeg
  - Plus: 86 additional non-accident images (parking lots, normal traffic, highways, etc.)

## Testing Instructions

### Test the Predictor
```bash
cd ml_model
python test_improved_predictor.py
```

### Run the Full System
```bash
START_ALL.bat
```

This will:
1. Start MongoDB
2. Start Backend API (port 8000)
3. Start Frontend (port 3000)
4. Open browser to http://localhost:3000

### Quick Test Flow
1. Go to http://localhost:3000
2. Click "Report Accident"
3. Upload an accident image
4. Enter phone number (optional)
5. Submit report
6. Go to http://localhost:3000/admin
7. View report and approve/reject

## Files Removed (Cleanup)
- debug_*.py files (15 files)
- Multiple predictor variations (advanced, balanced, enhanced, final)
- Multiple approval system implementations
- Test and training files
- Analysis and summary documents

## Active Development Files
- Backend: app/ folder with routes, models, schemas, services
- Frontend: src/ folder with components, pages, services
- ML Model: improved_balanced_predictor.py (main predictor)
- Utils: START_ALL.bat, requirements.txt

