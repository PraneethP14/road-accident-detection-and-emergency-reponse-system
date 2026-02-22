"""
QUICK START: Train Advanced Model
One-command model training
"""

import os
import sys

# Add ml_model to path
ml_model_path = os.path.join(os.path.dirname(__file__), 'ml_model')
sys.path.insert(0, ml_model_path)

from train_advanced_model import train_advanced_model

if __name__ == "__main__":
    print("\n" + "="*70)
    print("ACCIDENT DETECTION - ADVANCED MODEL v2.0 TRAINING")
    print("="*70)
    print("\n📊 Model Features:")
    print("  ✓ Dual-branch architecture (EfficientNetB3 + MobileNetV3)")
    print("  ✓ Transfer learning with fine-tuning")
    print("  ✓ Aggressive data augmentation")
    print("  ✓ Class weight balancing")
    print("  ✓ Expected: 85-92% accuracy, 88-95% precision")
    print("\n⏱️  Training time: ~45-60 minutes (with GPU)")
    print("\n🎯 Files that will be created/updated:")
    print("  - models/accident_detection_model_v2.h5 (new model)")
    print("  - models/metrics_v2.json (new metrics)")
    print("\n" + "="*70 + "\n")
    
    # Start training
    train_advanced_model()
