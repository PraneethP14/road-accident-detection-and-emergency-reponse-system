#!/usr/bin/env python
"""Test that prediction model now accepts ultra_precision predictor output"""
import sys
import os
from pathlib import Path

# Add project root
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

print("=" * 70)
print("TEST: PredictionModel with Ultra-Precision Predictor")
print("=" * 70)

# Import models
from backend.app.models.report import PredictionModel

# Simulate what ultra_precision_predictor returns
sample_prediction = {
    'is_accident': False,
    'confidence': 0.35,
    'threshold': 0.50,
    'confidence_level': 'MEDIUM',
    'evidence': ['no emergency vehicle', 'no visible damage'],
    'reasoning': 'No strong accident indicators detected',
    'method': 'ultra_precision_v3.0',
    'model': 'Ultra-Precision Predictor'
}

print("\nInput (from ultra_precision_predictor):")
for k, v in sample_prediction.items():
    print(f"  {k}: {v}")

print("\nTesting PredictionModel validation...")
try:
    pred = PredictionModel(**sample_prediction)
    print("[OK] PredictionModel accepts ultra_precision output!")
    print(f"\nPredictionModel fields:")
    print(f"  is_accident: {pred.is_accident}")
    print(f"  confidence: {pred.confidence}")
    print(f"  confidence_level: {getattr(pred, 'confidence_level', 'N/A')}")
except Exception as e:
    print(f"[FAIL] Error: {e}")
    sys.exit(1)

print("\n" + "=" * 70)
print("[OK] TEST PASSED - Model is compatible!")
print("=" * 70)
