#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOME_FILE="$ROOT/frontend/src/pages/Home.jsx"
CSS_FILE="$ROOT/frontend/src/index.css"
COMP="$ROOT/frontend/src/components/ReadableAIResponse.jsx"

[ -f "$HOME_FILE" ] || { echo "❌ Home.jsx not found"; exit 1; }
cp "$HOME_FILE" "$HOME_FILE.readability-backup"
cp "$CSS_FILE" "$CSS_FILE.readability-backup"
cp "$(dirname "$0")/../frontend/src/components/ReadableAIResponse.jsx" "$COMP"
cat "$(dirname "$0")/../frontend/src/readable-ai-response.css" >> "$CSS_FILE"

python3 - "$HOME_FILE" <<'PY'
from pathlib import Path
import sys
p=Path(sys.argv[1])
s=p.read_text()
if "ReadableAIResponse" not in s:
    marker='import {'
    s=s.replace(marker,'import ReadableAIResponse from "../components/ReadableAIResponse";\n\nimport {',1)
s=s.replace("<pre>{answer}</pre>","<ReadableAIResponse content={answer} />")
s=s.replace('<pre>{loading ? "Working through repository context..." : (text || "Run the tool to generate an engineering result.")}</pre>','<ReadableAIResponse content={loading ? "Working through repository context..." : (text || "Run the tool to generate an engineering result.")} />')
p.write_text(s)
PY
echo "✅ Readability patch applied. Restart Vite and refresh localhost:5173."
