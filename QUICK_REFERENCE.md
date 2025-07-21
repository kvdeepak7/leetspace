# LeetSpace Quick Reference Guide

## API Endpoints Quick Reference

### Problems API
```bash
# Base URL: http://localhost:8000

POST   /api/problems/              # Create problem
GET    /api/problems/              # Get user problems  
GET    /api/problems/{id}          # Get specific problem
PUT    /api/problems/{id}          # Update problem
DELETE /api/problems/{id}          # Delete problem
GET    /api/problems/stats         # Get user statistics
```

### Required Parameters
- **user_id**: Required for all endpoints (from Firebase Auth)
- **title**: Required for problem creation
- **url**: Required for problem creation (URL format)
- **difficulty**: Required (Easy/Medium/Hard)
- **date_solved**: Required (YYYY-MM-DD format)

---

## Component Quick Reference

### Core Components

#### CodeEditor
```jsx
<CodeEditor
  code={string}
  onChange={function}
  language="javascript|python|cpp"
  onLangChange={function}
  theme="light|dark"
/>
```

#### DataTable
```jsx
<DataTable 
  data={array} 
  columns={array} 
/>
```

#### DateSelector
```jsx
<DateSolvedInput
  dateSolved={string}     // YYYY-MM-DD format
  setDateSolved={function}
/>
```

### UI Components

#### Button
```jsx
<Button variant="default|outline|ghost|destructive" size="sm|default|lg">
  Text
</Button>
```

#### Input
```jsx
<Input 
  placeholder="text" 
  value={string} 
  onChange={function} 
  type="text|email|url|password"
/>
```

#### Select
```jsx
<Select value={value} onValueChange={function}>
  <SelectTrigger>
    <SelectValue placeholder="text" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

---

## Authentication Patterns

### useAuth Hook
```jsx
const { user, loading } = useAuth();

// User object structure:
// {
//   uid: string,
//   email: string,
//   displayName: string
// }
```

### Protection Pattern
```jsx
if (loading) return <div>Loading...</div>;
if (!user) return <div>Please sign in</div>;
return <ProtectedContent />;
```

### API Call Pattern
```jsx
const response = await axios.get('/api/problems', {
  baseURL: 'http://localhost:8000',
  params: { user_id: user.uid }
});
```

---

## Common Data Structures

### Problem Object
```javascript
{
  id: "string",
  user_id: "string",
  title: "string",
  url: "string",
  difficulty: "Easy|Medium|Hard",
  tags: ["string"],
  date_solved: "YYYY-MM-DD",
  notes: "string",
  solutions: [
    {
      language: "javascript|python|cpp",
      code: "string"
    }
  ],
  mistakes: "string",
  retry_later: "string"
}
```

### Statistics Object
```javascript
{
  total_solved: number,
  by_difficulty: {
    Easy: number,
    Medium: number,
    Hard: number
  },
  most_common_tags: ["string"],
  total_time_minutes: number,
  retry_later_count: number
}
```

---

## File Structure

```
backend/
├── main.py              # FastAPI app entry
├── routes/
│   └── problems.py      # API endpoints
├── schemas/
│   └── problem.py       # Pydantic models
├── db/
│   └── mongo.py         # Database connection
└── requirements.txt     # Dependencies

frontend/leetspace-frontend/src/
├── App.jsx              # Main app component
├── components/
│   ├── Navbar.jsx       # Navigation
│   ├── CodeEditor.jsx   # Code editor
│   ├── dateSelector.jsx # Date picker
│   ├── data-table/      # Table components
│   └── ui/              # UI primitives
├── pages/
│   ├── Problems.jsx     # Problems list
│   ├── AddProblem.jsx   # Add problem form
│   └── Home.jsx         # Landing page
├── lib/
│   ├── firebase.js      # Firebase config
│   ├── useAuth.jsx      # Auth hook
│   └── utils.js         # Utilities
└── context/
    └── AuthContext.jsx  # Auth context
```

---

## Environment Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
# Create .env with MONGO_URI=mongodb://localhost:27017/leetspace
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend/leetspace-frontend
npm install
npm run dev
```

---

## Common Patterns

### Form State Management
```jsx
const [formData, setFormData] = useState({
  title: '',
  difficulty: '',
  tags: ''
});

const updateField = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

### API Error Handling
```jsx
try {
  const response = await axios.post('/api/problems/', data);
  // Success handling
} catch (error) {
  if (error.response?.status === 404) {
    // Not found
  } else if (error.response?.status === 500) {
    // Server error
  }
}
```

### Dark Mode Classes
```jsx
className="bg-white dark:bg-zinc-900 text-black dark:text-white"
```

### Responsive Design
```jsx
className="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
```

---

## Useful Code Snippets

### Create Problem
```jsx
const createProblem = async (problemData) => {
  const { user } = useAuth();
  
  const data = {
    ...problemData,
    user_id: user.uid,
    tags: problemData.tags.split(',').map(t => t.trim()).filter(Boolean)
  };

  const response = await axios.post('/api/problems/', data, {
    baseURL: 'http://localhost:8000'
  });
  
  return response.data;
};
```

### Filter Problems
```jsx
const filteredProblems = problems.filter(problem => {
  const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase());
  const matchesDifficulty = !difficulty || problem.difficulty === difficulty;
  const matchesTags = !tags.length || tags.every(tag => problem.tags.includes(tag));
  
  return matchesSearch && matchesDifficulty && matchesTags;
});
```

### Format Date
```jsx
import { format } from 'date-fns';

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};
```

### Color Coding
```jsx
const getDifficultyColor = (difficulty) => {
  const colors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800'
  };
  return colors[difficulty] || 'bg-gray-100 text-gray-800';
};
```

---

## Testing Endpoints

### cURL Examples
```bash
# Create problem
curl -X POST "http://localhost:8000/api/problems/" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test123","title":"Two Sum","url":"https://leetcode.com/problems/two-sum/","difficulty":"Easy","date_solved":"2023-12-01"}'

# Get problems
curl "http://localhost:8000/api/problems/?user_id=test123&difficulty=Easy"

# Get stats
curl "http://localhost:8000/api/problems/stats?user_id=test123"
```

---

## Troubleshooting

### Common Issues

1. **CORS Error**: Check backend CORS configuration in `main.py`
2. **Auth Error**: Verify Firebase config in `firebase.js`
3. **Date Format**: Ensure dates are in YYYY-MM-DD format
4. **Missing user_id**: Check if user is authenticated before API calls
5. **MongoDB Connection**: Verify MONGO_URI in backend `.env`

### Debug Commands
```bash
# Check backend logs
uvicorn main:app --reload --log-level debug

# Check frontend console
# Open browser dev tools -> Console tab

# Test API directly
curl -v "http://localhost:8000/api/problems/stats?user_id=test"
```

This quick reference provides all the essential information for working with the LeetSpace application efficiently.