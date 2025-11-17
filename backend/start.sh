#!/bin/bash

# Start script for Render deployment

echo "Starting Voting Platform API..."

# Run database migrations (if using alembic)
# alembic upgrade head

# Start the application
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
