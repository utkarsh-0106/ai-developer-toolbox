# AI Developer Toolbox — Answer Readability Patch

This is a frontend-only readability upgrade for the current AI Engineering UI.

It adds a drop-in `ReadableAIResponse` component that renders AI answers with:
- clear headings
- readable paragraphs
- bullets and numbered steps
- inline code
- code blocks
- simple Markdown tables
- citation badges
- blockquotes
- responsive spacing

It requires **no new npm dependency**.

## Apply

From the project root:

```bash
bash scripts/apply-readability-patch.sh
```

The script backs up the current Home.jsx and index.css before modifying them.

It does not modify:
- MongoDB
- authentication
- repository indexing
- RAG retrieval
- AI providers
- backend routes
- repository data
