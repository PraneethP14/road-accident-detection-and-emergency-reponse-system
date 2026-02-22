#!/usr/bin/env python
"""Quick test of enhanced predictions"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from ml_model.predict import AccidentPredictor

p = AccidentPredictor()

print("Testing enhanced predictor (85% precision):")
print("Available test images:")
test_dirs = ["results_images", "test_images"]
for test_dir in test_dirs:
    if os.path.exists(test_dir):
        files = os.listdir(test_dir)[:3]
        for f in files:
            if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                path = os.path.join(test_dir, f)
                result = p.predict(path)
                prob = result.get('accident_probability', 0)
                is_acc = result.get('is_accident')
                confidence = result.get('confidence', 0)
                method = result.get('method', 'unknown')
                print(f"  {f}: {method} -> prob={prob:.3f}, is_accident={is_acc}, confidence={confidence:.3f}")
