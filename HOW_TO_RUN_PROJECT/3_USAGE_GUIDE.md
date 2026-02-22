#  User Guide - How to Use the Application

##  Overview

This accident detection system uses AI to analyze images and determine if they show an accident or normal traffic conditions.

**Key Features:**
-  AI-powered accident detection (87% accuracy)
-  Image upload support
-  Location tracking with maps
-  Real-time dashboard
-  Anonymous reporting (no login required)
-  Admin portal for management

---

##  Main User Application

### Access: http://localhost:3000

### Feature 1: Report an Accident

#### Step-by-Step:

1. **Click "Report Accident" button** on home page

2. **Fill in the form:**
   - **Location:** Drag map marker or enter coordinates
   - **Upload Image:** Click to select image file
     - Supported: JPG, JPEG, PNG
     - Max size: 50 MB
   - **Description:** (Optional) Add details about the incident
   - **Address:** (Optional) Auto-filled from map

3. **Submit Report**
   - Click "Submit Report" button
   - Wait for AI analysis (1-2 seconds)

4. **View Results:**
   - **Prediction:** ACCIDENT or NON-ACCIDENT
   - **Confidence:** AI confidence score (60-99%)
   - **Probabilities:**
     - Accident Probability: X%
     - Non-Accident Probability: Y%

#### Example Result:
```
 Report Submitted Successfully!

AI Prediction: ACCIDENT
Confidence: 85.4%
Accident Probability: 85.4%
Non-Accident Probability: 14.6%

Location: 13.1062, 77.5592
Time: 11/01/2025, 12:45:30 PM
```

---

### Feature 2: SOS Emergency Report

#### For emergencies WITHOUT image:

1. Click "SOS Emergency" button
2. Location is captured automatically
3. No image required
4. Immediately marked as high-priority

**Use when:**
- Phone camera not working
- Too dangerous to take photo
- Need immediate help

---

##  Dashboard

### Access: http://localhost:3000/dashboard

### What You Can See:

#### 1. Statistics Cards
- **Total Reports:** All submitted reports
- **Pending Reports:** Awaiting admin review
- **Accidents Detected:** AI-confirmed accidents
- **Accuracy Rate:** Overall system accuracy

#### 2. Recent Reports List
- Report ID
- Location (lat/long)
- AI Prediction
- Confidence Score
- Timestamp
- Status (Pending/Approved/Rejected)

#### 3. Filters
- **By Status:** All, Pending, Approved, Rejected
- **By Date:** Recent, Today, This Week
- **By Prediction:** All, Accidents Only, Non-Accidents Only

#### 4. Actions
- **View Details:** Click any report
- **See Location:** View on map
- **Check Image:** View uploaded photo
- **See AI Analysis:** Full prediction details

---

##  Admin Portal

### Access: http://localhost:3000/admin

### Login Credentials:
```
Email: admin@accidentdetection.com
Password: admin123
```

### Admin Features:

#### 1. Report Management

**Approve Report:**
1. Click on pending report
2. Review image and AI prediction
3. Click "Approve" button
4. Add admin notes (optional)

**Reject Report:**
1. Click on pending report
2. Review details
3. Click "Reject" button
4. Add reason for rejection

**Add Notes:**
- Emergency level
- Response status
- Follow-up actions
- Contact information

#### 2. Analytics Dashboard

**View Statistics:**
- Total reports by day/week/month
- Accuracy metrics
- Response times
- Geographic distribution

#### 3. User Management

**Manage Admin Accounts:**
- Create new admins
- Update permissions
- View activity logs

---

##  Testing the AI Model

### Test with Sample Images:

#### Test 1: Clear Accident Image
1. Go to: http://localhost:3000
2. Upload: `test/accident/accidentFrame210_*.jpg`
3. **Expected Result:**
   - Prediction: ACCIDENT 
   - Confidence: 90-96%

#### Test 2: Normal Road Image
1. Go to: http://localhost:3000
2. Upload: `test/non-accident/car_driving_0002.jpg`
3. **Expected Result:**
   - Prediction: NON-ACCIDENT 
   - Confidence: 70-75%

#### Test 3: Borderline Case
1. Upload any ambiguous image
2. **Expected Result:**
   - Confidence: 50-65% (uncertain)
   - Either prediction is acceptable

---

##  Understanding AI Predictions

### Confidence Levels:

#### High Confidence (80-99%)
```
Prediction: ACCIDENT
Confidence: 92%
```
**Meaning:** Model is very certain. Clear accident indicators detected.

#### Medium Confidence (65-79%)
```
Prediction: NON-ACCIDENT
Confidence: 73%
```
**Meaning:** Model is confident but not certain. Most likely correct.

#### Low Confidence (50-64%)
```
Prediction: ACCIDENT
Confidence: 56%
```
**Meaning:** Borderline case. Image has mixed features. Manual review recommended.

### What the AI Looks For:

**Accident Indicators:**
-  Damaged vehicles
-  Collision debris
-  Emergency vehicles
-  People on road
-  Unusual vehicle positions

**Non-Accident Indicators:**
-  Normal traffic flow
-  Proper lane usage
-  Regular city/highway scenes
-  Organized traffic

---

##  Understanding Locations

### Map Features:

**Interactive Map:**
- Drag marker to change location
- Zoom in/out
- Street view toggle
- Get directions

**Location Data:**
- Latitude & Longitude (decimal degrees)
- Address (reverse geocoded)
- Accuracy radius
- Timestamp

---

##  Best Practices

### For Accurate AI Predictions:

####  Good Image Quality:
- Clear, well-lit photos
- Close enough to see details
- Minimal blur
- Correct orientation

####  Relevant Content:
- Show vehicles/road clearly
- Include context (surroundings)
- Avoid extreme angles
- No filters or edits

####  Avoid:
- Very blurry images
- Dark/night photos without flash
- Zoomed in on random objects
- Screenshots of other images

### For Faster Processing:

1. **Optimize images:** Resize large images before upload
2. **Use JPG format:** Smaller file size, faster upload
3. **Stable internet:** Ensure good connection
4. **One at a time:** Submit reports sequentially

---

##  Report Status Workflow

```
1. SUBMITTED (You)  Report created with AI prediction

2. PENDING  Awaiting admin review

3. UNDER REVIEW (Admin)  Admin checking details

4. APPROVED (Admin)  Confirmed as valid report
   OR
   REJECTED (Admin)  Invalid/duplicate report

5. EMERGENCY RESPONSE  If needed, dispatched to authorities
```

---

##  Common Workflows

### Workflow 1: Report and Track

1. Submit accident report with image
2. Note your Report ID (e.g., #c1c6a2)
3. Go to Dashboard
4. Search for your Report ID
5. Track status updates

### Workflow 2: Anonymous Reporting

1. No login required
2. Submit report
3. View in Dashboard
4. Reports saved as "Anonymous User"

### Workflow 3: Admin Review

1. Admin receives notification
2. Reviews image and AI prediction
3. Checks location accuracy
4. Approves or rejects
5. Adds response notes

---

##  Tips for Best Results

### Improve AI Accuracy:

1. **Multiple Angles:** If possible, upload photos from different angles
2. **Context Matters:** Include surrounding area in frame
3. **Timing:** Upload as soon as possible after incident
4. **Description:** Add details to help admin review

### Speed Up Response:

1. **Accurate Location:** Ensure GPS/map location is correct
2. **Clear Description:** Mention severity, injuries, road blocks
3. **Use SOS:** For life-threatening emergencies

---

##  Troubleshooting

### Issue: Image won't upload
**Solutions:**
- Check file size < 50 MB
- Use JPG/PNG format only
- Try a different image
- Check internet connection

### Issue: Location not detected
**Solutions:**
- Allow browser location access
- Manually drag map marker
- Enter coordinates manually
- Use address search

### Issue: Slow AI prediction
**Solutions:**
- Check internet speed
- Wait 30-60 seconds
- Refresh page and try again
- Check backend is running

### Issue: Wrong prediction
**Remember:**
- AI is 87% accurate (not 100%)
- Borderline cases happen
- Admin can override
- Confidence score indicates certainty

---

##  Support

### For Technical Issues:
1. Check terminals for error messages
2. Verify all services running
3. Restart application
4. See troubleshooting section

### For Questions:
- Read this guide thoroughly
- Check API documentation
- Review training metrics
- Contact system administrator

---

##  Next Steps

- **4_STOP_PROJECT.md** - Learn how to properly shut down
- **5_TRAINING_MODEL.md** - Learn about the AI model
- **6_TROUBLESHOOTING.md** - Common issues and solutions

---

 **You're now ready to use the Accident Detection System!**

**Quick Links:**
- Main App: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard  
- Admin: http://localhost:3000/admin
- API Docs: http://localhost:8000/docs
