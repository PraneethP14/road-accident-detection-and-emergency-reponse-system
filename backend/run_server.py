"""
Simple server runner without reload
"""
import sys
import os
from pathlib import Path

# Add parent directory to Python path so ml_model can be imported
parent_dir = Path(__file__).parent.parent
sys.path.insert(0, str(parent_dir))

import uvicorn

if __name__ == "__main__":
    print("=" * 70)
    print("BACKEND STARTUP")
    print("=" * 70)
    print(f"Python path includes: {parent_dir}")
    print(f"Current directory: {os.getcwd()}")
    print("=" * 70)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
