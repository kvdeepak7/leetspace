import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import DateSolvedInput from "@/components/dateSelector.jsx";
import { useState,useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import CodeEditor from "@/components/CodeEditor";
import axios from "axios";
import { useAuth } from "@/lib/useAuth";
import { useNavigate } from "react-router-dom";


export default function AddProblem() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const corrected = new Date();
  corrected.setDate(corrected.getDate() + 1); // ✅ add 1 day
  const formatted = corrected.toLocaleDateString("en-CA"); // "YYYY-MM-DD"
  const [dateSolved, setDateSolved] = useState(formatted);
  const [retryLater, setRetryLater] = useState("");
  const isDark = document.documentElement.classList.contains("dark");
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  const [formError, setFormError] = useState("");
  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      setTheme(dark ? "dark" : "light");
    });
  
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  
    return () => observer.disconnect();
  }, []);

  const [solutions, setSolutions] = useState([
    { code: "// write your solution here", language: "javascript" },
  ]);

  const handleSolutionChange = (index, value) => {
    const updated = [...solutions];
    updated[index].code = value;
    setSolutions(updated);
  };

  const handleLanguageChange = (index, value) => {
    const updated = [...solutions];
    updated[index].language = value;
    setSolutions(updated);
  };

  const addSolutionEditor = () => {
    setSolutions([...solutions, { code: "", language: "javascript" }]);
  };

  const deleteSolutionEditor = (index) => {
    if (solutions.length === 1) return;
    const updated = solutions.filter((_, i) => i !== index);
    setSolutions(updated);
  };
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !url.trim() || !difficulty || !retryLater) {
      setFormError("Please fill in all required fields: title, URL, difficulty, and retry later.");
      return;
    }
  
    setFormError("");

    const problemData = {
      user_id: user.uid, // ✅ required by backend
      title,
      url,
      difficulty,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      notes,
      solutions,
      date_solved: dateSolved,
      retry_later: retryLater,
    };

    try {
      const res = await axios.post("/api/problems/", problemData, {
        baseURL: "http://localhost:8000",
      });
      console.log("✅ Problem saved:", res.data);
      navigate(`/problems/${res.data.id}`);
    } catch (err) {
      console.error("❌ Error saving problem:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 bg-white dark:bg-zinc-900 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">➕ Add a New Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-lg mb-1 block">Problem Title</Label>
          <Input
            id="title"
            placeholder="e.g. Two Sum"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold border-none shadow-none focus-visible:ring-0 bg-background text-foreground placeholder:text-neutral-400"
          />
        </div>
        <div>
          <Label htmlFor="url" className="text-lg mb-1 block">Problem URL </Label>
          <Input
            id="url"
            placeholder="e.g. https://leetcode.com/problems/two-sum"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="text-xl font-semibold border-none shadow-none focus-visible:ring-0 bg-background text-foreground placeholder:text-neutral-400"
          />
        </div>

        <div>
          <Label className="text-lg mb-1 block">Difficulty</Label>
          <div className="flex gap-2">
            {["Easy", "Medium", "Hard"].map((level) => {
              const selected = difficulty === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-1 cursor-pointer rounded-full text-sm border transition-all
                    ${selected
                      ? "bg-accent text-accent-foreground border-accent font-semibold shadow"
                      : "text-muted-foreground border-border hover:bg-muted/40 opacity-60"}`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label htmlFor="tags" className="text-lg mb-1 block">Tags</Label>
          <Input
            id="tags"
            placeholder="e.g. array, hash map"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="text-xl font-semibold border-none shadow-none focus-visible:ring-0 bg-background text-foreground placeholder:text-neutral-400"
          />
        </div>

        <div data-color-mode={theme}>
          <Label htmlFor="notes" className="text-lg mb-1 block">Notes (Markdown supported)</Label>
          <div className="border rounded-xl bg-background placeholder:text-muted-foreground [&:placeholder-shown]:text-muted-foreground [&:not(:placeholder-shown)]:placeholder-transparent text-foreground">
            <MDEditor value={notes} onChange={setNotes} height={300} />
          </div>
        </div>

        <div>
          <Label className="text-lg mb-2 block">Solution(s)</Label>
          {solutions.map((sol, idx) => (
            <div key={idx} className="relative mb-10">
              {solutions.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer absolute top-2 right-2 z-10 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteSolutionEditor(idx)}
                >
                  ✕
                </Button>
              )}
              <CodeEditor
                code={sol.code}
                language={sol.language}
                theme={theme}
                onChange={(val) => handleSolutionChange(idx, val)}
                onLangChange={(val) => handleLanguageChange(idx, val)}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="ghost"
            className="text-sm cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={addSolutionEditor}
          >
            + Add Another Solution
          </Button>
        </div>

        <Label htmlFor="date_solved" className="text-lg mb-1 block">Date Solved</Label>
        <DateSolvedInput dateSolved={dateSolved} setDateSolved={setDateSolved} />

        <div>
          <Label className="text-lg mb-1 block">Retry Later?</Label>
          <div className="flex gap-2">
            {["Yes", "No"].map((option) => {
              const selected = retryLater === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRetryLater(option)}
                  className={`cursor-pointer px-4 py-1 rounded-full text-sm border transition-all
                    ${selected
                      ? "bg-accent text-accent-foreground border-accent font-semibold shadow"
                      : "text-muted-foreground border-border hover:bg-muted/40 opacity-60"}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
        {formError && (
          <div className="text-red-500 text-sm bg-red-100 dark:bg-red-900/30 p-2 rounded-md text-center">
            {formError}
          </div>
        )}
        <Button type="submit" className="w-full cursor-pointer bg-black text-white text-lg dark:bg-white dark:text-black">
          Submit Problem
        </Button>
      </form>
    </div>
  );
}
