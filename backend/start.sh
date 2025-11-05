#!/bin/bash
# Start script for Render deployment

# Create database directory if it doesn't exist
mkdir -p database

# Run the FastAPI application with Uvicorn
uvicorn main:app --host 0.0.0.0 --port 10000
