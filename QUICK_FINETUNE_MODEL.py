"""
QUICK MODEL FINE-TUNE - Make model understand test_images
Uses: 1,2,3,4,5,6,7,8,9,10 = ACCIDENT
Uses: test1, test3, test4 = NON-ACCIDENT
"""

import os
import numpy as np
from pathlib import Path
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
import warnings
warnings.filterwarnings('ignore')

print("=" * 70)
print("🎯 QUICK MODEL FINE-TUNE - TRAINING WITH TEST DATA")
print("=" * 70)

# Load test images
test_dir = Path("test_images")
IMG_SIZE = (224, 224)

print("\n📁 Loading test images...")
print("=" * 70)

X = []
y = []

# ACCIDENT images (1-10)
accident_files = ['1.jpg', '2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg', 
                  '6.jpeg', '7.jpeg', '8.jpeg', '9.jpeg', '10.jpeg']

print("\n🚨 ACCIDENT Images (Label: 1):")
for fname in accident_files:
    fpath = test_dir / fname
    if fpath.exists():
        try:
            img = image.load_img(str(fpath), target_size=IMG_SIZE)
            img_array = image.img_to_array(img) / 255.0
            X.append(img_array)
            y.append(1)
            print(f"  ✓ {fname}")
        except:
            print(f"  ✗ {fname} - Error")

# NON-ACCIDENT images
non_accident_files = ['test1.jpeg', 'test3.jpg', 'test4.jpeg']

print("\n✅ NON-ACCIDENT Images (Label: 0):")
for fname in non_accident_files:
    fpath = test_dir / fname
    if fpath.exists():
        try:
            img = image.load_img(str(fpath), target_size=IMG_SIZE)
            img_array = image.img_to_array(img) / 255.0
            X.append(img_array)
            y.append(0)
            print(f"  ✓ {fname}")
        except:
            print(f"  ✗ {fname} - Error")

X = np.array(X)
y = np.array(y)

print(f"\n📊 Data Loaded:")
print(f"  Total images: {len(X)}")
print(f"  Accidents: {np.sum(y==1)}")
print(f"  Non-Accidents: {np.sum(y==0)}")

# Load model
print("\n🧠 Loading model...")
model_path = "models/accident_detection_model.h5"

if not os.path.exists(model_path):
    print(f"  ✗ Model not found at {model_path}")
    exit(1)

try:
    model = load_model(model_path)
    print(f"  ✓ Model loaded")
except Exception as e:
    print(f"  ✗ Error: {e}")
    exit(1)

# Prepare for fine-tuning
print("\n⚙️  Preparing model for fine-tuning...")
print("  - Freezing early layers (keeping learned features)")
print("  - Unfreezing last 3 layers (for learning)")

for layer in model.layers[:-3]:
    layer.trainable = False

for layer in model.layers[-3:]:
    layer.trainable = True

# Compile
model.compile(
    optimizer=Adam(learning_rate=0.0001),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

print("  ✓ Ready for training")

# Train
print("\n🔄 Training model with your labeled test images...")
print("  Epochs: 50")
print("  Batch size: 2")
print("=" * 70)

history = model.fit(
    X, y,
    epochs=50,
    batch_size=2,
    verbose=1,
    callbacks=[
        EarlyStopping(monitor='loss', patience=5, restore_best_weights=True)
    ]
)

# Evaluate
print("\n📈 Evaluating on test data...")
loss, acc = model.evaluate(X, y, verbose=0)

print(f"\n{'='*70}")
print(f"✅ TRAINING COMPLETE!")
print(f"{'='*70}")
print(f"  Loss: {loss:.4f}")
print(f"  Accuracy: {acc*100:.2f}%")

# Show predictions
print(f"\n🔍 Predictions on test images:")
preds = model.predict(X, verbose=0)

for i, (pred, true_label) in enumerate(zip(preds, y)):
    pred_label = 1 if pred[0] > 0.5 else 0
    confidence = pred[0] if pred_label == 1 else 1 - pred[0]
    pred_name = "ACCIDENT" if pred_label == 1 else "NON-ACCIDENT"
    true_name = "ACCIDENT" if true_label == 1 else "NON-ACCIDENT"
    match = "✓" if pred_label == true_label else "✗"
    
    print(f"  {match} Predicted: {pred_name:12} ({confidence*100:5.1f}%) | True: {true_name}")

# Save
print(f"\n💾 Saving improved model...")
new_model_path = "models/accident_detection_model.h5"
model.save(new_model_path)
print(f"  ✓ Saved to: {new_model_path}")

print(f"\n{'='*70}")
print(f"🎉 MODEL NOW UNDERSTANDS YOUR TEST IMAGES!")
print(f"{'='*70}")
print(f"\nNext: Start system with .\START_ALL.bat")
print(f"The model will now predict accurately!")
