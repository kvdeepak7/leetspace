# LeetSpace Component Reference Guide

## Table of Contents

1. [Data Table Components](#data-table-components)
2. [Form Components](#form-components)
3. [Utility Functions](#utility-functions)
4. [Authentication Hooks](#authentication-hooks)
5. [UI Component Library](#ui-component-library)
6. [Component Integration Examples](#component-integration-examples)

---

## Data Table Components

### 1. Column Definitions (`src/components/data-table/columns.jsx`)

Defines the structure and rendering for the problems data table.

**Exports:**
- `columns` - Array of column definitions for TanStack Table

**Column Structure:**
```jsx
export const columns = [
  {
    accessorKey: "title",
    header: "Title"
  },
  {
    accessorKey: "difficulty", 
    header: "Difficulty",
    cell: ({ row }) => (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colorMap[row.original.difficulty]}`}>
        {row.original.difficulty}
      </span>
    )
  },
  {
    accessorKey: "tags",
    header: "Tags", 
    cell: ({ row }) => (
      <div>{row.original.tags.join(", ")}</div>
    )
  },
  {
    accessorKey: "Action",
    header: "",
    id: "actions",
    cell: ({ row }) => <ActionsDropdown />
  }
];
```

**Difficulty Color Mapping:**
```jsx
const colorMap = {
  Easy: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800', 
  Hard: 'bg-red-100 text-red-800'
};
```

**Features:**
- Color-coded difficulty badges
- Tag display with comma separation
- Actions dropdown with edit/delete options
- Dark mode support
- Responsive design

**Usage:**
```jsx
import { columns } from '@/components/data-table/columns';
import { DataTable } from '@/components/data-table/data-table';

function ProblemsTable({ problems }) {
  return <DataTable data={problems} columns={columns} />;
}
```

**Extending Columns:**
```jsx
// Add custom column
const customColumns = [
  ...columns,
  {
    accessorKey: "date_solved",
    header: "Date Solved",
    cell: ({ row }) => (
      <span>{new Date(row.original.date_solved).toLocaleDateString()}</span>
    )
  }
];
```

---

## Form Components

### 1. DateSelector Component (`src/components/dateSelector.jsx`)

A calendar-based date picker component for selecting problem solve dates.

**Props:**
```jsx
{
  dateSolved: string,      // Date string in YYYY-MM-DD format
  setDateSolved: function  // State setter function
}
```

**Features:**
- Calendar popup interface
- Date formatting with date-fns
- Prevents future date selection
- Dark mode support
- Accessibility compliant

**Implementation:**
```jsx
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, parse } from "date-fns";

export default function DateSolvedInput({ dateSolved, setDateSolved }) {
  const parsedDate = dateSolved ? new Date(dateSolved) : new Date();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          {dateSolved ? format(parsedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateSolved ? parse(dateSolved, "yyyy-MM-dd", new Date()) : undefined}
          onSelect={(date) => {
            if (date) {
              const corrected = new Date(date);
              corrected.setDate(corrected.getDate() + 1);
              const formatted = corrected.toLocaleDateString("en-CA");
              setDateSolved(formatted);
            }
          }}
          disabled={(date) => date > new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
```

**Usage:**
```jsx
import DateSolvedInput from '@/components/dateSelector';

function ProblemForm() {
  const [dateSolved, setDateSolved] = useState(new Date().toISOString().split("T")[0]);

  return (
    <form>
      <Label>Date Solved</Label>
      <DateSolvedInput 
        dateSolved={dateSolved} 
        setDateSolved={setDateSolved} 
      />
    </form>
  );
}
```

**Date Format Handling:**
- Input: ISO date string (YYYY-MM-DD)
- Display: Localized format via date-fns
- Storage: ISO format for API compatibility

---

## Utility Functions

### 1. CSS Class Utility (`src/lib/utils.js`)

Utility function for conditional CSS class merging.

**Function:**
```jsx
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

**Purpose:**
- Combines multiple CSS classes
- Resolves Tailwind CSS conflicts
- Handles conditional classes

**Usage Examples:**
```jsx
import { cn } from '@/lib/utils';

// Basic usage
const className = cn("px-4 py-2", "bg-blue-500", "text-white");

// Conditional classes
const buttonClass = cn(
  "px-4 py-2 rounded",
  {
    "bg-blue-500": variant === "primary",
    "bg-gray-500": variant === "secondary"
  },
  disabled && "opacity-50"
);

// Tailwind conflict resolution
const mergedClass = cn("p-4", "px-2"); // Results in "py-4 px-2"
```

**In Component Libraries:**
```jsx
// Button component example
export function Button({ className, variant, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium",
        {
          "bg-primary text-primary-foreground": variant === "default",
          "border border-input bg-background": variant === "outline"
        },
        className
      )}
      {...props}
    />
  );
}
```

---

## Authentication Hooks

### 1. useAuth Hook (`src/lib/useAuth.jsx`)

Custom hook providing Firebase authentication state and context.

**Exports:**
- `AuthProvider` - Context provider component
- `useAuth` - Hook for accessing authentication state

**State Structure:**
```jsx
{
  user: {
    uid: string,
    email: string,
    displayName: string,
    // ... other Firebase user properties
  } | null,
  loading: boolean
}
```

**Implementation:**
```jsx
import { useState, useEffect, useContext, createContext } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

**Usage Patterns:**

**1. App Wrapper:**
```jsx
import { AuthProvider } from '@/lib/useAuth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Your routes */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

**2. Component Authentication:**
```jsx
import { useAuth } from '@/lib/useAuth';

function ProtectedComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to continue.</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.displayName || user.email}!</h1>
      <p>User ID: {user.uid}</p>
    </div>
  );
}
```

**3. Conditional Rendering:**
```jsx
function Navbar() {
  const { user } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/problems">My Problems</Link>
          <button onClick={() => signOut(auth)}>Logout</button>
        </>
      ) : (
        <Link to="/auth">Login</Link>
      )}
    </nav>
  );
}
```

**4. API Integration:**
```jsx
function useApiCall() {
  const { user } = useAuth();

  const fetchProblems = async () => {
    if (!user) return;

    const response = await axios.get('/api/problems', {
      params: { user_id: user.uid }
    });
    return response.data;
  };

  return { fetchProblems };
}
```

---

## UI Component Library

### Component Architecture

The UI components follow a consistent pattern based on Radix UI primitives and Tailwind CSS styling.

### 1. Button Variants

```jsx
// Usage examples
<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Subtle Action</Button>
<Button variant="destructive">Delete Action</Button>

// Sizes
<Button size="sm">Small Button</Button>
<Button size="default">Default Button</Button>
<Button size="lg">Large Button</Button>
```

### 2. Form Controls

**Input Component:**
```jsx
<div className="grid gap-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>
```

**Textarea Component:**
```jsx
<div className="grid gap-2">
  <Label htmlFor="description">Description</Label>
  <Textarea
    id="description"
    placeholder="Enter description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />
</div>
```

**Select Component:**
```jsx
<Select value={difficulty} onValueChange={setDifficulty}>
  <SelectTrigger>
    <SelectValue placeholder="Select difficulty" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Easy">Easy</SelectItem>
    <SelectItem value="Medium">Medium</SelectItem>
    <SelectItem value="Hard">Hard</SelectItem>
  </SelectContent>
</Select>
```

### 3. Layout Components

**Card Component:**
```jsx
<Card>
  <CardHeader>
    <CardTitle>Problem Statistics</CardTitle>
    <CardDescription>Your coding progress overview</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid gap-4">
      <div className="flex justify-between">
        <span>Total Solved:</span>
        <span className="font-bold">{totalSolved}</span>
      </div>
    </div>
  </CardContent>
</Card>
```

**Table Component:**
```jsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Title</TableHead>
      <TableHead>Difficulty</TableHead>
      <TableHead>Date Solved</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {problems.map((problem) => (
      <TableRow key={problem.id}>
        <TableCell>{problem.title}</TableCell>
        <TableCell>{problem.difficulty}</TableCell>
        <TableCell>{problem.date_solved}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## Component Integration Examples

### 1. Complete Form with Validation

```jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeEditor } from '@/components/CodeEditor';
import DateSolvedInput from '@/components/dateSelector';
import { useAuth } from '@/lib/useAuth';

function ProblemForm({ onSubmit }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    difficulty: '',
    tags: '',
    notes: '',
    dateSolved: new Date().toISOString().split('T')[0],
    retryLater: ''
  });
  const [solutions, setSolutions] = useState([
    { code: '// Your solution here', language: 'javascript' }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const problemData = {
      ...formData,
      user_id: user.uid,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      solutions
    };

    await onSubmit(problemData);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Problem</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Problem Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Two Sum"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="url">Problem URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://leetcode.com/problems/..."
            />
          </div>

          <div className="grid gap-2">
            <Label>Difficulty</Label>
            <Select 
              value={formData.difficulty} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="array, hash-table, dynamic-programming"
            />
          </div>

          <div className="grid gap-2">
            <Label>Date Solved</Label>
            <DateSolvedInput
              dateSolved={formData.dateSolved}
              setDateSolved={(date) => setFormData(prev => ({ ...prev, dateSolved: date }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add your notes, approach, time complexity, etc."
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label>Solution</Label>
            <CodeEditor
              code={solutions[0].code}
              language={solutions[0].language}
              onChange={(code) => setSolutions([{ ...solutions[0], code }])}
              onLangChange={(language) => setSolutions([{ ...solutions[0], language }])}
              theme="light"
            />
          </div>

          <Button type="submit" className="w-full">
            Save Problem
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### 2. Data Display with Actions

```jsx
import { useState } from 'react';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function ProblemsDisplay({ problems, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.title}</div>
      )
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: ({ row }) => {
        const difficulty = row.original.difficulty;
        const variant = difficulty === 'Easy' ? 'default' : 
                       difficulty === 'Medium' ? 'secondary' : 'destructive';
        return <Badge variant={variant}>{difficulty}</Badge>;
      }
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {row.original.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{row.original.tags.length - 3}
            </Badge>
          )}
        </div>
      )
    },
    {
      accessorKey: "date_solved",
      header: "Date Solved",
      cell: ({ row }) => (
        <div>{new Date(row.original.date_solved).toLocaleDateString()}</div>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(row.original.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => window.location.href = '/add-problem'}>
          Add Problem
        </Button>
      </div>
      
      <DataTable data={filteredProblems} columns={columns} />
    </div>
  );
}
```

This component reference guide provides detailed documentation for all the additional components and utilities in the LeetSpace application, with practical usage examples and integration patterns.