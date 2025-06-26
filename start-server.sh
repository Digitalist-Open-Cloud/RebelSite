#!/bin/bash

# RebelMetrics Local Development Server
echo "🚀 Starting RebelMetrics Local Development Server"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found - Starting server on http://localhost:8000"
    echo "📁 Serving files from: $(pwd)"
    echo ""
    echo "🌍 Available URLs:"
    echo "   English:  http://localhost:8000/"
    echo "   Swedish:  http://localhost:8000/sv/"
    echo "   German:   http://localhost:8000/de/"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Python found - Starting server on http://localhost:8000"
    echo "📁 Serving files from: $(pwd)"
    echo ""
    echo "🌍 Available URLs:"
    echo "   English:  http://localhost:8000/"
    echo "   Swedish:  http://localhost:8000/sv/"
    echo "   German:   http://localhost:8000/de/"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m http.server 8000
elif command -v node &> /dev/null; then
    echo "✅ Node.js found - Starting server on http://localhost:8000"
    echo "📁 Serving files from: $(pwd)"
    echo ""
    echo "🌍 Available URLs:"
    echo "   English:  http://localhost:8000/"
    echo "   Swedish:  http://localhost:8000/sv/"
    echo "   German:   http://localhost:8000/de/"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    npx http-server -p 8000
else
    echo "❌ No suitable server found"
    echo ""
    echo "Please install one of the following:"
    echo "  • Python 3: brew install python3 (macOS) or apt install python3 (Linux)"
    echo "  • Node.js: brew install node (macOS) or apt install nodejs (Linux)"
    echo ""
    echo "Or use one of these manual commands:"
    echo "  • python3 -m http.server 8000"
    echo "  • python -m http.server 8000"
    echo "  • npx http-server -p 8000"
    echo "  • php -S localhost:8000"
fi 