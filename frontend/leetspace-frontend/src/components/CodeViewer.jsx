// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

// export default function CodeViewer({ code = "", language = "javascript", theme = "light" }) {
//   return (
//     <div className="rounded-md border bg-muted p-4 overflow-x-auto text-sm">
//       <SyntaxHighlighter
//         language={language}
//         style={theme === "dark" ? oneDark : oneLight}
//         customStyle={{ background: "transparent", padding: 0, margin: 0 }}
//         showLineNumbers
//       >
//         {code}
//       </SyntaxHighlighter>
//     </div>
//   );
// }

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark,oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy,Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CodeViewer({ code, language,theme = "light" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for insecure context (e.g. localhost over http)
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed"; // avoid scrolling
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };
  

  return (
    <div className="relative rounded-xl overflow-hidden border border-border">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-black dark:hover:text-white"
        onClick={handleCopy}
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </Button>

      <SyntaxHighlighter
        language={language}
        style={theme === "dark" ? materialDark : oneLight}
        customStyle={{
          padding: "1rem",
          margin: 0,
          background: "transparent",
          fontSize: "0.875rem",
          fontFamily: "monospace",
        }}
        wrapLines={true}
        showLineNumbers={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

