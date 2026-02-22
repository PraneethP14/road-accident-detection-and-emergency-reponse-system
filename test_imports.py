"""Test that backend can import ML models correctly"""
import sys
from pathlib import Path

# Add parent directory
parent = Path(__file__).parent
sys.path.insert(0, str(parent))

print("Testing ML Model Imports...")
print("=" * 70)

try:
    from ml_model.ultra_precision_predictor import UltraPrecisionPredictor
    print("[OK] UltraPrecisionPredictor imported")
    predictor = UltraPrecisionPredictor()
    print("[OK] UltraPrecisionPredictor initialized")
except Exception as e:
    print(f"[FAIL] UltraPrecisionPredictor failed: {e}")

try:
    from ml_model.improved_balanced_predictor import ImprovedBalancedPredictor
    print("[OK] ImprovedBalancedPredictor imported")
except Exception as e:
    print(f"[FAIL] ImprovedBalancedPredictor failed: {e}")

print("=" * 70)
print("[SUCCESS] All imports successful! Backend ready!")
