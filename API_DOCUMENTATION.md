# LeetSpace API & Component Documentation

## Table of Contents

1. [Overview](#overview)
2. [Backend API Documentation](#backend-api-documentation)
3. [Frontend Components Documentation](#frontend-components-documentation)
4. [Database Schema](#database-schema)
5. [Authentication](#authentication)
6. [Setup and Usage](#setup-and-usage)
7. [Examples](#examples)

---

## Overview

LeetSpace is a full-stack application for tracking coding problems and solutions. It consists of:

- **Backend**: FastAPI-based REST API with MongoDB
- **Frontend**: React application with modern UI components
- **Authentication**: Firebase Auth integration
- **Database**: MongoDB with Motor async driver

---

## Backend API Documentation

### Base URL
```
http://localhost:8000
```

### Problems API (`/api/problems`)

#### 1. Create Problem
**POST** `/api/problems/`

Creates a new problem entry for a user.

**Request Body:**
```json
{
  "user_id": "string (required)",
  "title": "string (required)",
  "url": "string (URL format, required)",
  "difficulty": "string (required, one of: Easy, Medium, Hard)",
  "tags": ["string"] (optional, default: []),
  "date_solved": "date (YYYY-MM-DD format, required)",
  "notes": "string (optional)",
  "solutions": [
    {
      "language": "string",
      "code": "string"
    }
  ] (optional),
  "mistakes": "string (optional)",
  "retry_later": "string (optional)"
}
```

**Response:**
```json
{
  "id": "string",
  "user_id": "string",
  "title": "string",
  "url": "string",
  "difficulty": "string",
  "tags": ["string"],
  "date_solved": "date",
  "notes": "string",
  "solutions": [
    {
      "language": "string",
      "code": "string"
    }
  ],
  "mistakes": "string",
  "retry_later": "string"
}
```

**Example:**
```bash
curl -X POST "http://localhost:8000/api/problems/" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "abc123",
    "title": "Two Sum",
    "url": "https://leetcode.com/problems/two-sum/",
    "difficulty": "Easy",
    "tags": ["array", "hash-table"],
    "date_solved": "2023-12-01",
    "notes": "Used hashmap for O(n) solution",
    "solutions": [
      {
        "language": "python",
        "code": "def twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i"
      }
    ],
    "retry_later": "No"
  }'
```

#### 2. Get Problems
**GET** `/api/problems/`

Retrieves problems for a specific user with optional filtering and sorting.

**Query Parameters:**
- `user_id` (required): User identifier
- `difficulty` (optional): Filter by difficulty (Easy, Medium, Hard)
- `tags` (optional): Filter by tags (can be multiple)
- `retry_later` (optional): Filter by retry status
- `search` (optional): Search in title and notes
- `sort_by` (optional, default: "date_solved"): Sort field
- `order` (optional, default: "desc"): Sort order (asc, desc)

**Response:**
```json
[
  {
    "id": "string",
    "user_id": "string",
    "title": "string",
    "url": "string",
    "difficulty": "string",
    "tags": ["string"],
    "date_solved": "date",
    "notes": "string",
    "solutions": [
      {
        "language": "string",
        "code": "string"
      }
    ],
    "mistakes": "string",
    "retry_later": "string"
  }
]
```

**Examples:**
```bash
# Get all problems for user
curl "http://localhost:8000/api/problems/?user_id=abc123"

# Get easy problems with array tag
curl "http://localhost:8000/api/problems/?user_id=abc123&difficulty=Easy&tags=array"

# Search problems
curl "http://localhost:8000/api/problems/?user_id=abc123&search=two%20sum"

# Sort by title ascending
curl "http://localhost:8000/api/problems/?user_id=abc123&sort_by=title&order=asc"
```

#### 3. Get Problem by ID
**GET** `/api/problems/{id}`

Retrieves a specific problem by its ID.

**Path Parameters:**
- `id`: Problem ID (MongoDB ObjectId)

**Response:**
```json
{
  "id": "string",
  "user_id": "string",
  "title": "string",
  "url": "string",
  "difficulty": "string",
  "tags": ["string"],
  "date_solved": "date",
  "notes": "string",
  "solutions": [
    {
      "language": "string",
      "code": "string"
    }
  ],
  "mistakes": "string",
  "retry_later": "string"
}
```

**Example:**
```bash
curl "http://localhost:8000/api/problems/507f1f77bcf86cd799439011"
```

#### 4. Update Problem
**PUT** `/api/problems/{id}`

Updates an existing problem. All fields are optional.

**Path Parameters:**
- `id`: Problem ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "title": "string (optional)",
  "url": "string (optional)",
  "difficulty": "string (optional)",
  "tags": ["string"] (optional),
  "date_solved": "date (optional)",
  "notes": "string (optional)",
  "solutions": [
    {
      "language": "string",
      "code": "string"
    }
  ] (optional),
  "mistakes": "string (optional)",
  "retry_later": "boolean (optional)"
}
```

**Response:**
```json
{
  "id": "string",
  "user_id": "string",
  "title": "string",
  "url": "string",
  "difficulty": "string",
  "tags": ["string"],
  "date_solved": "date",
  "notes": "string",
  "solutions": [
    {
      "language": "string",
      "code": "string"
    }
  ],
  "mistakes": "string",
  "retry_later": "string"
}
```

**Example:**
```bash
curl -X PUT "http://localhost:8000/api/problems/507f1f77bcf86cd799439011" \
  -H "Content-Type: application/json" \
  -d '{
    "difficulty": "Medium",
    "notes": "Updated solution with better time complexity"
  }'
```

#### 5. Delete Problem
**DELETE** `/api/problems/{id}`

Deletes a problem by its ID.

**Path Parameters:**
- `id`: Problem ID (MongoDB ObjectId)

**Response:**
```json
{
  "detail": "Problem deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE "http://localhost:8000/api/problems/507f1f77bcf86cd799439011"
```

#### 6. Get User Statistics
**GET** `/api/problems/stats`

Retrieves statistics for a user's problem-solving activity.

**Query Parameters:**
- `user_id` (required): User identifier

**Response:**
```json
{
  "total_solved": "number",
  "by_difficulty": {
    "Easy": "number",
    "Medium": "number",
    "Hard": "number"
  },
  "most_common_tags": ["string"],
  "total_time_minutes": "number",
  "retry_later_count": "number"
}
```

**Example:**
```bash
curl "http://localhost:8000/api/problems/stats?user_id=abc123"
```

**Example Response:**
```json
{
  "total_solved": 25,
  "by_difficulty": {
    "Easy": 10,
    "Medium": 12,
    "Hard": 3
  },
  "most_common_tags": ["array", "string", "hash-table", "dynamic-programming", "tree"],
  "total_time_minutes": 1240,
  "retry_later_count": 5
}
```

---

## Frontend Components Documentation

### Core Pages

#### 1. App Component (`src/App.jsx`)

The main application component that sets up routing and theme providers.

**Props:** None

**Features:**
- Conditional navbar rendering (hidden on auth page)
- Theme provider integration
- Authentication provider integration
- React Router setup

**Routes:**
- `/` - Home page
- `/auth` - Authentication page
- `/problems` - Problems listing
- `/add-problem` - Add new problem
- `/problems/:id` - Problem detail view

**Usage:**
```jsx
import AppWrapper from './App';

function Main() {
  return <AppWrapper />;
}
```

#### 2. Home Component (`src/pages/Home.jsx`)

Landing page component (implementation not shown in provided code).

#### 3. Problems Component (`src/pages/Problems.jsx`)

Displays a table of all problems for the authenticated user.

**Props:** None

**Dependencies:**
- `useAuth` hook for user authentication
- `DataTable` component for problem display
- Axios for API calls

**Features:**
- Fetches problems from API
- Sorts by date solved (newest first)
- Loading state management
- Dark mode support

**Usage:**
```jsx
import Problems from './pages/Problems';

// Used in routing
<Route path="/problems" element={<Problems />} />
```

#### 4. AddProblem Component (`src/pages/AddProblem.jsx`)

Form component for adding new problems.

**Props:** None

**Features:**
- Multi-field form with validation
- Multiple solution editors
- Markdown editor for notes
- Date picker for solve date
- Tag input with comma separation
- Difficulty and retry status selection
- Dark/light theme detection
- Navigation after successful submission

**State Management:**
```jsx
const [title, setTitle] = useState("");
const [url, setUrl] = useState("");
const [difficulty, setDifficulty] = useState("");
const [tags, setTags] = useState("");
const [notes, setNotes] = useState("");
const [dateSolved, setDateSolved] = useState(new Date().toISOString().split("T")[0]);
const [retryLater, setRetryLater] = useState("");
const [solutions, setSolutions] = useState([
  { code: "// write your solution here", language: "javascript" }
]);
```

**Usage:**
```jsx
import AddProblem from './pages/AddProblem';

// Used in routing
<Route path="/add-problem" element={<AddProblem />} />
```

### UI Components

#### 1. Navbar Component (`src/components/Navbar.jsx`)

Navigation component with authentication and theme controls.

**Props:** None

**Features:**
- Logo and brand display
- Navigation links (Problems, Add Problem)
- Theme toggle (light/dark)
- User authentication status
- Logout functionality

**Dependencies:**
- Firebase Auth
- React Router
- Theme Provider
- Lucide React icons

**Usage:**
```jsx
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      {/* Other components */}
    </>
  );
}
```

#### 2. CodeEditor Component (`src/components/CodeEditor.jsx`)

Code editor component with syntax highlighting and language support.

**Props:**
```jsx
{
  code: string,              // Current code content
  onChange: function,        // Code change handler
  language: string,          // Programming language
  onLangChange: function,    // Language change handler
  theme: string             // Theme (light/dark)
}
```

**Supported Languages:**
- JavaScript
- Python
- C++

**Features:**
- Syntax highlighting
- Language switching
- Theme support (GitHub light/dark)
- Floating language selector

**Usage:**
```jsx
import CodeEditor from './components/CodeEditor';

function MyComponent() {
  const [code, setCode] = useState("console.log('Hello World');");
  const [language, setLanguage] = useState("javascript");
  
  return (
    <CodeEditor
      code={code}
      onChange={setCode}
      language={language}
      onLangChange={setLanguage}
      theme="light"
    />
  );
}
```

#### 3. DataTable Component (`src/components/data-table/data-table.jsx`)

Advanced data table with filtering, sorting, and pagination.

**Props:**
```jsx
{
  data: array,     // Array of data objects
  columns: array   // Column definitions
}
```

**Features:**
- Search/filtering
- Column sorting
- Pagination
- Column visibility toggle
- Row click navigation
- Dark mode support
- Responsive design

**Usage:**
```jsx
import { DataTable } from './components/data-table/data-table';
import { columns } from './components/data-table/columns';

function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  
  return (
    <DataTable data={problems} columns={columns} />
  );
}
```

#### 4. UI Components (`src/components/ui/`)

Collection of reusable UI components built with Radix UI and styled with Tailwind CSS:

**Button** (`button.jsx`)
```jsx
import { Button } from './components/ui/button';

<Button variant="outline" size="sm">Click me</Button>
```

**Input** (`input.jsx`)
```jsx
import { Input } from './components/ui/input';

<Input placeholder="Enter text..." value={value} onChange={handleChange} />
```

**Label** (`label.jsx`)
```jsx
import { Label } from './components/ui/label';

<Label htmlFor="input-id">Field Label</Label>
```

**Card** (`card.jsx`)
```jsx
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

**Additional UI Components:**
- `badge.jsx` - Status badges
- `table.jsx` - Table components
- `select.jsx` - Dropdown selects
- `textarea.jsx` - Text areas
- `popover.jsx` - Popup components
- `dropdown-menu.jsx` - Context menus
- `calendar.jsx` - Date picker
- `skeleton.jsx` - Loading skeletons

### Context and Hooks

#### 1. AuthContext (`src/context/AuthContext.jsx`)

Provides authentication state throughout the application.

**Exports:**
- `AuthProvider` - Context provider component
- `useAuth` - Hook for accessing auth state

**State:**
```jsx
{
  user: object | null,    // Firebase user object
  loading: boolean        // Loading state
}
```

**Usage:**
```jsx
import { AuthProvider, useAuth } from './context/AuthContext';

// Wrap app
function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}

// Use in components
function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Welcome, {user.email}</div>;
}
```

#### 2. ThemeProvider (`src/components/ThemeProvider.jsx`)

Manages light/dark theme state and switching.

**Features:**
- Theme persistence
- System theme detection
- Theme toggle functionality

**Usage:**
```jsx
import { ThemeProvider, useTheme } from './components/ThemeProvider';

// Wrap app
function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}

// Use in components
function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

---

## Database Schema

### Problems Collection

```javascript
{
  _id: ObjectId,           // MongoDB auto-generated ID
  user_id: String,         // Firebase user ID
  title: String,           // Problem title
  url: String,             // Problem URL (LeetCode, etc.)
  difficulty: String,      // "Easy", "Medium", or "Hard"
  tags: [String],          // Array of tag strings
  date_solved: Date,       // Date problem was solved
  notes: String,           // User notes (Markdown supported)
  solutions: [             // Array of solution objects
    {
      language: String,    // Programming language
      code: String         // Solution code
    }
  ],
  mistakes: String,        // Common mistakes or lessons learned
  retry_later: String      // "Yes", "No", or other status
}
```

**Indexes:**
- `user_id` - For efficient user-specific queries
- `difficulty` - For difficulty filtering
- `tags` - For tag-based filtering
- `date_solved` - For date-based sorting

---

## Authentication

### Firebase Authentication

The application uses Firebase Authentication for user management.

**Configuration** (`src/lib/firebase.js`):
```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Firebase configuration
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

**Authentication Flow:**
1. User signs in via Firebase Auth
2. Firebase provides user object with `uid`
3. `uid` is used as `user_id` in API calls
4. AuthContext provides user state to all components

**Protected Routes:**
All API endpoints expect a valid `user_id` parameter. The frontend components check authentication status before making API calls.

---

## Setup and Usage

### Backend Setup

1. **Install Dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Environment Variables:**
Create `.env` file with:
```env
MONGO_URI=mongodb://localhost:27017/leetspace
```

3. **Start Server:**
```bash
uvicorn main:app --reload --port 8000
```

### Frontend Setup

1. **Install Dependencies:**
```bash
cd frontend/leetspace-frontend
npm install
```

2. **Environment Variables:**
Configure Firebase in `src/lib/firebase.js`

3. **Start Development Server:**
```bash
npm run dev
```

### Production Deployment

**Backend:**
```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
npm run build
npm run preview
```

---

## Examples

### Complete Problem Creation Workflow

1. **Frontend Component:**
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const problemData = {
    user_id: user.uid,
    title: "Two Sum",
    url: "https://leetcode.com/problems/two-sum/",
    difficulty: "Easy",
    tags: ["array", "hash-table"],
    notes: "Used hashmap approach",
    solutions: [{
      language: "python",
      code: "def twoSum(nums, target):\n    # solution here"
    }],
    date_solved: "2023-12-01",
    retry_later: "No"
  };

  try {
    const response = await axios.post("/api/problems/", problemData, {
      baseURL: "http://localhost:8000"
    });
    console.log("Problem created:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

2. **API Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "user_id": "firebase_user_uid",
  "title": "Two Sum",
  "url": "https://leetcode.com/problems/two-sum/",
  "difficulty": "Easy",
  "tags": ["array", "hash-table"],
  "date_solved": "2023-12-01",
  "notes": "Used hashmap approach",
  "solutions": [{
    "language": "python",
    "code": "def twoSum(nums, target):\n    # solution here"
  }],
  "retry_later": "No"
}
```

### Custom Component Integration

```jsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CodeEditor } from '@/components/CodeEditor';
import { useAuth } from '@/lib/useAuth';

function CustomProblemForm() {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  
  return (
    <form>
      <Input placeholder="Problem title" />
      
      <CodeEditor
        code={code}
        onChange={setCode}
        language={language}
        onLangChange={setLanguage}
        theme="light"
      />
      
      <Button type="submit">
        Save Problem
      </Button>
    </form>
  );
}
```

### Error Handling

```jsx
// API Error Handling
try {
  const response = await axios.get(`/api/problems/${id}`);
  setProblem(response.data);
} catch (error) {
  if (error.response?.status === 404) {
    console.error('Problem not found');
  } else if (error.response?.status === 500) {
    console.error('Server error');
  } else {
    console.error('Network error');
  }
}
```

```python
# Backend Error Handling
from fastapi import HTTPException

@router.get("/{id}")
async def get_problem(id: str):
    try:
        doc = await collection.find_one({"_id": ObjectId(id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Problem not found")
        return ProblemInDB(**doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

This documentation provides comprehensive coverage of all public APIs, components, and usage patterns in the LeetSpace application. For additional questions or clarifications, refer to the source code or contact the development team.