FROM python:3.10-slim

# Install git and ffmpeg (required for whisper)
RUN apt-get update && apt-get install -y git ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first (for caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your code
COPY . .

# Expose the port Hugging Face expects
EXPOSE 7860

# Start the FastAPI app with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
