# LeetSpace 🚀

**Smart Coding Practice Tracker with AI-Powered Insights**

LeetSpace transforms your chaotic coding practice into an organized, insights-driven learning experience. Track your LeetCode solutions, get intelligent recommendations, and identify patterns in your problem-solving journey.

## ✨ Features

- **Smart Problem Tracking**: Log your solutions with multiple programming languages
- **AI-Powered Insights**: Get weakness detection and learning velocity analysis  
- **Intelligent Recommendations**: Personalized next problem suggestions based on your history
- **Progress Analytics**: Comprehensive stats with strength/weakness identification
- **Beautiful Dashboard**: Clean, modern interface with dark/light themes
- **Secure Authentication**: Firebase-based user management

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Firebase project (for authentication)

### 1. Clone and Setup
```bash
git clone <your-repo>
cd leetspace
cp .env.example .env
```

### 2. Configure Firebase
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication with Email/Password
3. Update `.env` with your Firebase config

### 3. Run with Docker
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- MongoDB: localhost:27017

### 4. First Use
1. Visit http://localhost:5173
2. Sign up for an account
3. Start logging your coding problems!

## 📊 What Makes LeetSpace Different

Unlike simple problem trackers, LeetSpace provides:

### Intelligence Layer
- **Weakness Detection**: Identifies topics you struggle with
- **Learning Velocity**: Tracks your improvement over time
- **Smart Recommendations**: Suggests next problems based on your gaps

### Real Insights
- **Pattern Recognition**: Spots your solving patterns
- **Difficulty Progression**: Guides your skill development
- **Consistency Tracking**: Monitors your practice habits

### Example Insights You'll Get:
```
🎯 Your learning velocity: 3.2 problems/week
🔍 Weakness areas: Dynamic Programming, Graph Traversal  
💪 Strength areas: Array Manipulation, Two Pointers
📈 Next goal: Ready for Hard problems
🔥 Consistency score: 85% (last 30 days)
```

## 🔧 Development

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup  
```bash
cd frontend/leetspace-frontend
npm install
npm run dev
```

### Database
The app uses MongoDB. Sample data can be loaded with:
```bash
cd backend
python seed_data.py
```

## 📖 API Documentation

Key endpoints:
- `GET /api/problems/` - Get user's problems with filtering
- `POST /api/problems/` - Add new problem
- `GET /api/problems/stats` - Get intelligent insights
- `GET /api/problems/recommendations/next` - Get smart recommendations

## 🛣️ Roadmap

**Phase 1: Foundation** ✅
- [x] Basic CRUD operations
- [x] User authentication
- [x] Problem tracking

**Phase 2: Intelligence** 🚧  
- [x] Smart analytics
- [x] Weakness detection
- [x] Intelligent recommendations
- [ ] Spaced repetition system

**Phase 3: Advanced Features** 📋
- [ ] Interview simulation mode
- [ ] Company-specific problem sets
- [ ] Social features (study groups)
- [ ] Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details.

---

**Built with**: FastAPI, React, MongoDB, Firebase, Docker