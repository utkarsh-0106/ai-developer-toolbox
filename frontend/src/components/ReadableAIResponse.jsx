import React from "react";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineFormat(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>")
    .replace(/(?<!\w)(\[\d+\])(?!\w)/g, '<span class="ai-citation">$1</span>');
}

function isTableSeparator(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function splitTableRow(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((x) => x.trim());
}

export default function ReadableAIResponse({ content, className = "" }) {
  if (!content) return <div className={`ai-response-empty ${className}`}>No response yet.</div>;

  const lines = String(content).replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim() || "code";
      const code = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      blocks.push(
        <div className="ai-code-card" key={`code-${i}`}>
          <div className="ai-code-header"><span>{language}</span><span>Code</span></div>
          <pre><code>{code.join("\n")}</code></pre>
        </div>
      );
      continue;
    }

    if (line.includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const header = splitTableRow(line);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      blocks.push(
        <div className="ai-table-wrap" key={`table-${i}`}>
          <table className="ai-table">
            <thead><tr>{header.map((c, n) => <th key={n} dangerouslySetInnerHTML={{__html: inlineFormat(c)}} />)}</tr></thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r}>{header.map((_, n) => <td key={n} dangerouslySetInnerHTML={{__html: inlineFormat(row[n] || "")}} />)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const Tag = `h${heading[1].length}`;
      blocks.push(React.createElement(Tag, {
        key: `h-${i}`,
        className: `ai-heading ai-heading-${heading[1].length}`,
        dangerouslySetInnerHTML: {__html: inlineFormat(heading[2])}
      }));
      i++;
      continue;
    }

    if (/^[-*+]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ""));
        i++;
      }
      blocks.push(<ul className="ai-list" key={`ul-${i}`}>{items.map((x,n) =>
        <li key={n} dangerouslySetInnerHTML={{__html: inlineFormat(x)}} />
      )}</ul>);
      continue;
    }

    if (/^\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ""));
        i++;
      }
      blocks.push(<ol className="ai-list ai-numbered-list" key={`ol-${i}`}>{items.map((x,n) =>
        <li key={n} dangerouslySetInnerHTML={{__html: inlineFormat(x)}} />
      )}</ol>);
      continue;
    }

    if (line.startsWith(">")) {
      const quote = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(<blockquote className="ai-blockquote" key={`q-${i}`}>
        {quote.map((x,n) => <div key={n} dangerouslySetInnerHTML={{__html: inlineFormat(x)}} />)}
      </blockquote>);
      continue;
    }

    const paragraph = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^#{1,4}\s+/.test(lines[i].trim()) &&
      !/^[-*+]\s+/.test(lines[i].trim()) &&
      !/^\d+[.)]\s+/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith(">") &&
      !(lines[i].includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1]))
    ) {
      paragraph.push(lines[i].trim());
      i++;
    }
    blocks.push(
      <p className="ai-paragraph" key={`p-${i}`}
        dangerouslySetInnerHTML={{__html: inlineFormat(paragraph.join(" "))}} />
    );
  }

  return <article className={`ai-readable-response ${className}`}>{blocks}</article>;
}
