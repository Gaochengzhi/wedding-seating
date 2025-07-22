# Wedding Invitation & Seat Selection System

An elegant wedding invitation system with online seat selection functionality. This system consists of two main modules: invitation display and seat selection.

## 🌟 Features

- **Elegant Wedding Invitation**: Beautiful animated invitation page with couple photos and wedding details
- **Online Seat Selection**: Interactive round table layout with real-time seat management
- **Admin Management**: Complete guest management with drag-and-drop functionality
- **Phone Verification**: Secure guest verification system
- **Responsive Design**: Mobile-friendly interface
- **Real-time Data**: CSV-based data persistence with auto-sync

## 🚀 Technology Stack

- **Frontend**: React 19 + Vite
- **UI Components**: Material-UI (MUI) + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Data Storage**: CSV files with automatic backup
- **State Management**: React Hooks
- **Environment**: .env configuration

## 📁 Project Structure

```
wedding_invitor/
├── src/
│   ├── components/
│   │   ├── admin/           # Admin management components
│   │   ├── guest/           # Guest registration components
│   │   ├── ui/              # Reusable UI components
│   │   ├── SeatSelection.jsx
│   │   └── WelcomePage.jsx
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── assets/              # Images and SVG files
├── server/
│   ├── server.js           # Express server
│   ├── config.js           # Server configuration
│   └── data/               # CSV data files
└── dist/                   # Production build files
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd wedding_invitor
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment configuration
Copy the example environment file:
```bash
cp example.env .env
```

Edit `.env` file with your configuration:
```env
# App Configuration
VITE_APP_MODE=development
VITE_INVITATION_CODE=5201314
VITE_ADMIN_USERNAME=root
VITE_ADMIN_PASSWORD=root

# Server Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_PRODUCTION_SERVER=your-server-ip

# Asset Paths
VITE_COUPLE_PATH=./src/assets/couple.svg
VITE_LEFT_FLOWER_PATH=./src/assets/left_flower.svg
VITE_RIGHT_FLOWER_PATH=./src/assets/right_flower.svg
VITE_WEDDING_INVITATION_TITLE_PATH=./src/assets/wedding_invitaion_titile_logo.svg
VITE_DINNING_ICON_PATH=./src/assets/dinning_icon.svg

# Table Configuration
VITE_TOTAL_TABLES=22
VITE_TABLES_PER_SIDE=11
VITE_MAX_SEATS_PER_TABLE=16
VITE_TABLE_RADIUS=65
VITE_TABLE_CENTER_SIZE=96
```

### 4. Development mode
Run frontend and backend concurrently:
```bash
npm run dev:full
```

Or run separately:
```bash
# Terminal 1 - Backend server
npm run server

# Terminal 2 - Frontend development
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## 🏗️ Production Deployment

### 1. Build the frontend
```bash
npm run build
```

### 2. Server deployment structure
```
production-server/
├── dist/                   # Frontend build files
├── server/                 # Backend files
│   ├── server.js
│   ├── config.js
│   └── data/               # CSV data files
├── .env                    # Production environment
├── package.json
└── node_modules/
```

### 3. Production deployment steps

#### Step 1: Prepare files for deployment
```bash
# Files to upload to production server:
- dist/ (frontend build output)
- server/ (backend code)
- .env (production environment config)
- package.json
```

#### Step 2: Server setup
```bash
# On production server
npm install --production

# Start backend service
cd server
node server.js
```

#### Step 3: Web server configuration (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend static files
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }

    # API proxy to Express server
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Step 4: Process management (PM2)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server/server.js --name wedding-api

# Enable auto-start on system boot
pm2 startup
pm2 save
```

#### Step 5: Data directory permissions
```bash
# Ensure CSV data directory has write permissions
chmod 755 server/data/
chmod 644 server/data/*.csv
```

## 🎯 Usage Guide

### Guest Flow
1. **Welcome Page**: View wedding invitation with couple photos and details
2. **Invitation Code**: Enter the invitation code (auto-filled in development)
3. **Seat Selection**: Choose available seats on interactive round tables
4. **Guest Registration**: Fill in name, gender, phone number and optional details
5. **Phone Verification**: Verify phone number to edit or delete seats

### Admin Features
1. **Admin Login**: Username: `root`, Password: `root`
2. **Drag & Drop**: Move guests between seats by dragging
3. **Table Management**: Add/delete tables and add table notes
4. **Guest Management**: View all guests in data table format
5. **Relationship Management**: Manage guest relationship categories

## 🔧 API Endpoints

### Guest Management
- `GET /api/guests` - Get all guests
- `POST /api/guests` - Save/update guest
- `DELETE /api/guests/:seatId/:tableId` - Delete specific guest
- `DELETE /api/guests` - Clear all data

### Table Management  
- `GET /api/tables` - Get all tables
- `POST /api/tables` - Create new table
- `DELETE /api/tables/:tableId` - Delete table
- `POST /api/tables/:tableId/notes` - Update table notes

### System
- `GET /api/health` - Health check
- `GET /api/relationships` - Get relationship categories

## 🔒 Security Features

- Phone number verification for guest operations
- Admin authentication system
- Data validation and sanitization
- Automatic data backup system
- Environment-based configuration

## 🐛 Development Notes

### Environment Detection
- **Development** (localhost): Auto-fills invitation code, direct access
- **Production**: Requires correct invitation code input

### Data Management
- All data stored in CSV files in `server/data/`
- Automatic backup system for data protection
- Real-time sync between frontend and backend

### Responsive Design
- Mobile-optimized interface
- Touch-friendly drag and drop
- Adaptive layout for different screen sizes

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private wedding project. External contributions are not accepted.

---

For deployment support or technical issues, please check the troubleshooting section in the documentation.