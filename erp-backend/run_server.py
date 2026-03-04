import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables if python-dotenv is installed
try:
    load_dotenv()
except ImportError:
    pass

if __name__ == "__main__":
    print("Starting ERP Backend...")
    print("Local Access: http://127.0.0.1:8000")
    print("API Docs: http://127.0.0.1:8000/docs")
    
    # We use 0.0.0.0 to allow LAN access if needed, 
    # but we inform the user to use localhost in the browser.
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
