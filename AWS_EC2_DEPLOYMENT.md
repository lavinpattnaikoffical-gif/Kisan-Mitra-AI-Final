# KisanMitra-AI AWS EC2 Deployment Guide

This guide covers how to deploy the KisanMitra-AI backend server to an AWS EC2 instance.

## 1. Launch an EC2 Instance
1. Log into your AWS Console and navigate to **EC2 > Instances > Launch instances**.
2. **Name**: `kisanmitra-backend`
3. **AMI**: Ubuntu 24.04 LTS (or 22.04 LTS).
4. **Instance Type**: `t2.micro` (Free tier eligible).
5. **Key Pair**: Create a new key pair or use an existing one (keep the `.pem` file safe).
6. **Network Settings**:
    *   Allow SSH traffic from your IP.
    *   Allow HTTP traffic from the internet.
    *   Allow Custom TCP port `3001` (from anywhere, for your ESP32 and API testing).
7. Launch the instance.

## 2. Connect to the Instance
Use SSH to connect to your instance using the key pair you downloaded:
```bash
ssh -i /path/to/your-key-pair.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
```

## 3. Install Node.js and Git
Once logged in, install the necessary dependencies:
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# Verify installation
node -v
npm -v
```

## 4. Clone the Repository and Setup
```bash
# Clone the repository (replace with your repo URL)
git clone https://github.com/lavinpattnaikoffical-gif/KisanMitra-AI.git
cd KisanMitra-AI

# Install dependencies
npm install
```

## 4.5 Install MongoDB
For data persistence, we'll install MongoDB directly on the EC2 instance:
```bash
# Import the public key used by the package management system
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Create a list file for MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Reload local package database and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start and enable MongoDB to run on boot
sudo systemctl start mongod
sudo systemctl enable mongod
```

## 5. Configure Environment Variables
Create a `.env` file from the example:
```bash
cp .env.example .env
nano .env
```
Add your required API keys inside the `.env` file, specifically:
```
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/kisanmitra
```
Save and exit (Ctrl+O, Enter, Ctrl+X).

## 6. Build and Start the Application using PM2
PM2 is a process manager that ensures your server stays alive even after you disconnect from SSH, and it restarts the server if it crashes.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Build the project (if applicable)
npm run build

# Start the server using PM2
pm2 start npm --name "kisanmitra" -- run start

# Ensure PM2 restarts on server reboot
pm2 startup
# (Run the command PM2 outputs, then run:)
pm2 save
```

## 7. Connecting Your ESP32
Your backend is now running at `http://<YOUR_EC2_PUBLIC_IP>:3001/`.

### Sending Sensor Data from ESP32
Configure your first ESP32 to send a `POST` request to:
`http://<YOUR_EC2_PUBLIC_IP>:3001/api/iot-ingest`

**Example JSON Payload:**
```json
{
  "source": "ESP32_SENSOR_1",
  "data": {
    "temperature": 32.5,
    "humidity": 60,
    "moisture": 45,
    "gps": "19.0760, 72.8777"
  }
}
```

### Polling Farm Control State from Second ESP32
Configure your second ESP32 to send a `GET` request to:
`http://<YOUR_EC2_PUBLIC_IP>:3001/api/farm-status`

**Example Response:**
```json
{
  "pump": "ON",
  "lastUpdated": "2026-06-12T00:00:00.000Z"
}
```
Based on the `pump` value (`"ON"` or `"OFF"`), your ESP32 can actuate the relay connected to the water pump.

### Analyzing Sensors with Gemini
You can test the AI integration by sending a `POST` request to:
`http://<YOUR_EC2_PUBLIC_IP>:3001/api/analyze-sensors`
(No payload required, it uses the latest data from `iot-ingest`).
