# 🚐 VanLife Admin Dashboard - Quick Start

## ⚠️ Important: HTTP Server Required

The modular dashboard uses ES6 modules which require an HTTP server due to CORS restrictions.
**DO NOT** open `admin.html` directly in the browser - it will fail with CORS errors.

## 🚀 Quick Start (Choose One)

### Option 1: Use the Batch Script (Recommended)
```
Double-click: start-server.bat
```
This will:
- Start the HTTP server on port 8000
- Automatically open your browser to the dashboard
- Show all available URLs

### Option 2: Use PowerShell
```
Right-click start-server.ps1 → Run with PowerShell
```

### Option 3: Manual Command Line
```bash
cd "c:\Users\sandr\New Website"
python -m http.server 8000
```
Then open: http://localhost:8000/admin-index.html

## 📋 Available Pages

| Page | URL | Description |
|------|-----|-------------|
| **Landing** | http://localhost:8000/admin-index.html | Main page with dashboard selection |
| **Modular** | http://localhost:8000/admin.html | New ES6 modular dashboard |
| **Legacy** | http://localhost:8000/admin-legacy.html | Original monolithic dashboard |
| **Testing** | http://localhost:8000/test-modular-dashboard.html | Module testing suite |

## 🔧 Troubleshooting

### "CORS policy" Error
- **Problem**: Accessing via `file://` protocol
- **Solution**: Use HTTP server (see Quick Start above)

### "Connection Refused" Error  
- **Problem**: Server not running
- **Solution**: Run `start-server.bat` or `python -m http.server 8000`

### Port 8000 Already in Use
- **Problem**: Another service using port 8000
- **Solution**: Change port: `python -m http.server 8001`

### Python Not Found
- **Problem**: Python not installed or not in PATH
- **Solutions**: 
  - Install Python from python.org
  - Use VS Code Live Server extension
  - Use Node.js: `npx http-server -p 8000`

## 🎯 Production Deployment

For production, deploy to any web server (Apache, Nginx, Netlify, Vercel, etc.)
The ES6 modules will work correctly on any proper HTTP server.

---
📞 **Need Help?** Check the full documentation in `MODULAR_ARCHITECTURE.md`
