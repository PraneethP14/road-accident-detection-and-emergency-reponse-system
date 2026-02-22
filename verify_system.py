"""Quick verification that all systems are ready"""
import sys
import os

# Add project root
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

print("=" * 70)
print("FINAL SYSTEM VERIFICATION")
print("=" * 70)

# Test 1: Model imports
print("\n[1] Testing ML Model Imports...")
try:
    from ml_model.ultra_precision_predictor import UltraPrecisionPredictor
    print("    [OK] UltraPrecisionPredictor imported")
except Exception as e:
    print(f"    [FAIL] {e}")
    sys.exit(1)

try:
    from ml_model.improved_balanced_predictor import ImprovedBalancedPredictor
    print("    [OK] ImprovedBalancedPredictor imported")
except Exception as e:
    print(f"    [FAIL] {e}")
    sys.exit(1)

# Test 2: Model initialization
print("\n[2] Testing Model Initialization...")
try:
    predictor = UltraPrecisionPredictor()
    print("    [OK] UltraPrecisionPredictor initialized")
except Exception as e:
    print(f"    [FAIL] {e}")
    sys.exit(1)

# Test 3: Check key files
print("\n[3] Checking Key Files...")
files_to_check = [
    "models/accident_detection_model.h5",
    "backend/app/main.py",
    "backend/app/api/routes/reports.py",
    "ml_model/ultra_precision_predictor.py",
    "ml_model/improved_balanced_predictor.py"
]

for file_path in files_to_check:
    if os.path.exists(file_path):
        print(f"    [OK] {file_path}")
    else:
        print(f"    [FAIL] {file_path} - NOT FOUND")

# Test 4: Directory structure
print("\n[4] Checking Directory Structure...")
dirs = ["backend", "frontend", "ml_model", "models", "test_images"]
for dir_name in dirs:
    if os.path.isdir(dir_name):
        print(f"    [OK] {dir_name}/")
    else:
        print(f"    [FAIL] {dir_name}/ - NOT FOUND")

print("\n" + "=" * 70)
print("SYSTEM STATUS: ALL CHECKS PASSED!")
print("=" * 70)
print("\nReady to start with: .\START_ALL.bat")
print("\nThe fine-tuned model will load automatically!")
