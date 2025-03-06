
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies including nginx
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Set up nginx configuration
COPY nginx.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Create startup script
RUN echo '#!/bin/bash\nnginx\npython app.py' > /app/start.sh && chmod +x /app/start.sh

# Expose the ports
EXPOSE 80 5000

# Command to run both nginx and the application
CMD ["/app/start.sh"]
