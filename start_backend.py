#!/usr/bin/env python
"""Backend startup script with proper path configuration"""
import sys
import os

# Add project root to Python path
project_root = os.path.dirname(os.path.abspath(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

print("=" * 70)
print("BACKEND STARTUP WITH PATH CONFIGURATION")
print("=" * 70)
print(f"Project root: {project_root}")
print(f"Python path: {sys.path[0]}")
print("=" * 70)

# Now import and run uvicorn
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "backend.app.main:app",
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
