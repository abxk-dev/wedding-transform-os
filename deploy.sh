#!/bin/bash
# Deploy to DigitalOcean Droplet
# Usage: ./deploy.sh YOUR_DROPLET_IP

set -e

DROPLET_IP=${1:?"Usage: ./deploy.sh DROPLET_IP"}
APP_DIR="/opt/transform-os"

echo "🚀 Deploying to $DROPLET_IP..."

# Create app directory on droplet
ssh root@$DROPLET_IP "mkdir -p $APP_DIR"

# Copy files
rsync -avz --exclude node_modules --exclude .next --exclude .git \
  ./ root@$DROPLET_IP:$APP_DIR/

# Build and start on droplet
ssh root@$DROPLET_IP << 'EOF'
cd /opt/transform-os

# Install Docker if not present
if ! command -v docker &> /dev/null; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
  echo "Installing Docker Compose..."
  apt-get install -y docker-compose-plugin
fi

# Build and deploy
docker compose down 2>/dev/null || true
docker compose up -d --build

echo "✅ Deployed! Running on port 3000"
EOF

echo ""
echo "✅ Done! App running at http://$DROPLET_IP:3000"
echo ""
echo "To set up nginx reverse proxy with SSL:"
echo "  ssh root@$DROPLET_IP"
echo "  apt install nginx certbot python3-certbot-nginx"
echo "  # Add nginx config for your domain"
echo "  certbot --nginx -d your-domain.com"
