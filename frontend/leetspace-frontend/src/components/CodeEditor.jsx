import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { githubDark } from "@uiw/codemirror-theme-github";
import { githubLight } from "@uiw/codemirror-theme-github";

const languageExtensions = {
  javascript,
  python,
  cpp,
};

export default function CodeEditor({
  code,
  onChange,
  language,
  onLangChange,
  theme = "light",
}) {
  const extensions = [languageExtensions[language]?.()] || [];

  return (
    <div className="relative group mb-6">
      {/* Floating Language Selector */}
      <div className="absolute top-2 left-2 z-10">
        <select
          value={language}
          onChange={(e) => onLangChange(e.target.value)}
          className="cursor-pointer text-xs bg-background border px-2 py-1 rounded-md shadow-sm"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      <div className="pt-10 rounded-md overflow-hidden text-sm">
        <CodeMirror
          value={code}
          height="300px"
          theme={theme === "dark" ? githubDark : githubLight}
          extensions={extensions}
          onChange={(val) => onChange(val)}
        />
      </div>
    </div>
  );
}
