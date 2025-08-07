# Firebase Authentication Setup Guide

## Overview

Your LeetSpace API is now secured with Firebase Authentication. All endpoints require a valid Firebase ID token, and users can only access their own data.

## Backend Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Firebase Service Account Setup

You need to set up a Firebase service account for the backend to verify tokens:

#### Option A: Using Service Account Key (Recommended for Development)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `leetspaceauth`
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Save the JSON file securely

**Method 1: Environment Variable (Recommended)**
```bash
# Set the entire JSON as an environment variable
export FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"leetspaceauth",...}'
```

**Method 2: File Path**
```bash
# Save the file and set the path
export FIREBASE_SERVICE_ACCOUNT_PATH="/path/to/firebase-service-account.json"
```

#### Option B: Application Default Credentials (For Production)

For Google Cloud deployment, use Application Default Credentials (no setup needed).

### 3. Environment Variables

Create a `.env` file in the backend directory:

```env
# MongoDB connection
MONGO_URI=your_mongodb_connection_string

# Firebase Service Account (choose one method)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
# OR
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

## API Authentication

### How It Works

1. **Frontend**: User logs in via Firebase Auth
2. **Frontend**: Gets Firebase ID token from Firebase
3. **Frontend**: Sends token in Authorization header: `Bearer <id_token>`
4. **Backend**: Verifies token with Firebase Admin SDK
5. **Backend**: Extracts user info (UID, email, etc.)
6. **Backend**: Uses Firebase UID as `user_id` for data isolation

### Token Requirements

- **Header**: `Authorization: Bearer <firebase_id_token>`
- **Email Verification**: User must have verified email (configurable)
- **Token Expiry**: Tokens expire after 1 hour (Firebase default)

## API Endpoints

All endpoints now require authentication and automatically filter data by the authenticated user's Firebase UID.

### Problems API (`/api/problems`)

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/` | GET | Get user's problems | ✅ |
| `/` | POST | Create new problem | ✅ |
| `/{id}` | GET | Get specific problem (user's only) | ✅ |
| `/{id}` | PUT | Update problem (user's only) | ✅ |
| `/{id}` | DELETE | Delete problem (user's only) | ✅ |
| `/stats` | GET | Get user's statistics | ✅ |

### Analytics API (`/api/analytics`)

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/dashboard` | GET | Get user's dashboard stats | ✅ |

### System Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/` | GET | API welcome message | ❌ |
| `/health` | GET | Health check | ❌ |

## Frontend Integration

Your frontend is already set up correctly! The existing Firebase Auth integration will work seamlessly.

### Getting ID Token (Frontend)

```javascript
import { auth } from './lib/firebase';

// Get current user's ID token
const user = auth.currentUser;
if (user) {
  const idToken = await user.getIdToken();
  
  // Use in API calls
  const response = await fetch('/api/problems', {
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    }
  });
}
```

## Security Features

### ✅ Implemented Security Measures

1. **User Isolation**: Users can only access their own data
2. **Token Verification**: All tokens verified with Firebase Admin SDK
3. **Email Verification**: Requires verified email (configurable)
4. **Automatic User ID**: Uses Firebase UID, prevents user_id manipulation
5. **CORS Protection**: Configured for your frontend domain
6. **Query Filtering**: All database queries automatically filtered by user

### 🛡️ Data Protection

- **Problems**: Filtered by `user_id` (Firebase UID)
- **Analytics**: Only shows authenticated user's data
- **Conflicts**: Checked only within user's own problems
- **Updates/Deletes**: Only affect user's own data

## Testing

### 1. Get Firebase ID Token

```bash
# From your frontend app's developer console:
const user = firebase.auth().currentUser;
const token = await user.getIdToken();
console.log(token);
```

### 2. Test API with cURL

```bash
# Replace YOUR_ID_TOKEN with actual token
curl -H "Authorization: Bearer YOUR_ID_TOKEN" \
     -H "Content-Type: application/json" \
     http://localhost:8000/api/problems
```

### 3. Test Unauthorized Access

```bash
# Should return 401 Unauthorized
curl http://localhost:8000/api/problems
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if token is included in Authorization header
   - Verify token is not expired (refresh if needed)
   - Ensure email is verified

2. **Firebase Admin SDK Issues**
   - Verify service account key is correctly set
   - Check environment variable format
   - Ensure Firebase project ID matches

3. **CORS Issues**
   - Update CORS origins in `main.py` for production
   - Ensure proper headers are sent from frontend

### Debug Mode

Enable debug logging in `firebase_auth.py` if needed:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Production Deployment

### Environment Variables

```bash
# Production environment
MONGO_URI=mongodb+srv://...
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Or use Application Default Credentials on Google Cloud
# (no FIREBASE_SERVICE_ACCOUNT_KEY needed)
```

### CORS Configuration

Update `main.py` for production:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

## Migration Notes

### What Changed

- ❌ Removed: Custom JWT authentication system
- ❌ Removed: User registration/login endpoints
- ❌ Removed: `user_id` query parameters
- ✅ Added: Firebase Admin SDK integration
- ✅ Added: Automatic user context from Firebase tokens
- ✅ Added: Enhanced security and data isolation

### Frontend Changes Required

**None!** Your existing Firebase Auth frontend integration works perfectly with the new backend.