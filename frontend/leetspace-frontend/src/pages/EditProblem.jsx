import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import DateSolvedInput from "@/components/dateSelector.jsx";
import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import CodeEditor from "@/components/CodeEditor";
import axios from "axios";
import { useAuth } from "@/lib/useAuth";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProblem() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [retryLater, setRetryLater] = useState("");
  const [dateSolved, setDateSolved] = useState("");
  const [formError, setFormError] = useState("");
  const [solutions, setSolutions] = useState([{ code: "", language: "javascript" }]);

  const isDark = document.documentElement.classList.contains("dark");
  const [theme, setTheme] = useState(isDark ? "dark" : "light");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      setTheme(dark ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await axios.get(`/api/problems/${id}`, {
          baseURL: "http://localhost:8000",
        });
        const p = res.data;
        setTitle(p.title);
        setUrl(p.url);
        setDifficulty(p.difficulty);
        setTags(p.tags.join(", "));
        setNotes(p.notes || "");
        setRetryLater(p.retry_later || "");
        setDateSolved(p.date_solved || new Date().toLocaleDateString("en-CA"));
        setSolutions(p.solutions || [{ code: "", language: "javascript" }]);
      } catch (err) {
        console.error("❌ Error fetching problem:", err);
      }
    }
    fetchProblem();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !url.trim() || !difficulty || !retryLater) {
      setFormError("Please fill in all required fields: title, URL, difficulty, and retry later.");
      return;
    }

    setFormError("");

    const problemData = {
      user_id: user.uid,
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
      const res = await axios.put(`/api/problems/${id}`, problemData, {
        baseURL: "http://localhost:8000",
      });
      console.log("✅ Problem updated:", res.data);
      navigate(`/problems/${id}`);
    } catch (err) {
      console.error("❌ Error updating problem:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 bg-white dark:bg-zinc-900 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">✏️ Edit Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-lg mb-1 block">Problem Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} 
          className="text-xl font-semibold border-none shadow-none focus-visible:ring-0 bg-background text-foreground placeholder:text-neutral-400"/>
        </div>

        {/* URL */}
        <div>
          <Label htmlFor="url" className="text-lg mb-1 block">Problem URL</Label>
          <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} 
          className="text-xl font-semibold border-none shadow-none focus-visible:ring-0 bg-background text-foreground placeholder:text-neutral-400"/>
        </div>

        {/* Difficulty */}
        <div>
          <Label className="text-lg mb-1 block">Difficulty</Label>
          <div className="flex gap-2">
            {["Easy", "Medium", "Hard"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`px-4 py-1 cursor-pointer rounded-full text-sm border transition-all ${
                  difficulty === level
                    ? "bg-accent text-accent-foreground border-accent font-semibold shadow"
                    : "text-muted-foreground border-border hover:bg-muted/40 opacity-60"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor="tags" className="text-lg mb-1 block">Tags</Label>
          <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} 
          className="text-xl font-semibold border-none shadow-none focus-visible:ring-0 bg-background text-foreground placeholder:text-neutral-400"/>
        </div>

        {/* Notes */}
        <div data-color-mode={theme}>
          <Label htmlFor="notes" className="text-lg mb-1 block">Notes</Label>
          <MDEditor value={notes} onChange={setNotes} height={300} />
        </div>

        {/* Solutions */}
        <div>
          <Label className="text-lg mb-2 block">Solution(s)</Label>
          {solutions.map((sol, idx) => (
            <div key={idx} className="relative mb-10">
              {solutions.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer absolute top-2 right-2 z-10"
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
          <Button type="button" variant="ghost" onClick={addSolutionEditor} className="cursor-pointer">
            + Add Another Solution
          </Button>
        </div>

        {/* Date Solved */}
        <Label htmlFor="date_solved" className="text-lg mb-1 block">Date Solved</Label>
        <DateSolvedInput dateSolved={dateSolved} setDateSolved={setDateSolved} className="cursor-pointer" />

        {/* Retry Later */}
        <div>
          <Label className="text-lg mb-1 block">Retry Later?</Label>
          <div className="flex gap-2">
            {["Yes", "No"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRetryLater(option)}
                className={`px-4 py-1 cursor-pointer rounded-full text-sm border transition-all ${
                  retryLater === option
                    ? "bg-accent text-accent-foreground border-accent font-semibold shadow"
                    : "text-muted-foreground border-border hover:bg-muted/40 opacity-60"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {formError && (
          <div className="text-red-500 text-sm bg-red-100 dark:bg-red-900/30 p-2 rounded-md text-center">
            {formError}
          </div>
        )}

        {/* Submit */}
        <Button type="submit" className="w-full bg-black text-white cursor-pointer text-lg dark:bg-white dark:text-black">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
