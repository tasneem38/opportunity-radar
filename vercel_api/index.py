import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from backend.main import create_app

app = create_app()
