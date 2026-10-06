# Repository Q&A

The current implementation adds a read-only repository question-answering flow on top of the existing GitHub indexing pipeline.

## Flow

1. A signed-in user previews a public GitHub repository.
2. The repository is indexed into MongoDB as repository-scoped chunks.
3. The user asks a question for the indexed repository.
4. Retrieval is scoped by:
   - authenticated `userId`
   - selected `repositoryId`
   - repository's latest indexed commit SHA
5. The retrieval service selects relevant chunks using lightweight lexical matching.
6. Only the selected chunks are sent to the existing AI provider layer.
7. The answer includes `[1]`, `[2]`, etc. source references and the UI shows the retrieved file paths.

## API

`POST /api/repository/qa`

Requires:

```text
Authorization: Bearer <existing auth token>
```

Body:

```json
{
  "repositoryId": "<MongoDB Repository _id>",
  "question": "How does authentication work in this repository?"
}
```

Response includes:

- `response`
- `sources`
- repository identity, branch, and indexed commit SHA

## Security

Repository Q&A never queries chunks without the authenticated user's ID and the selected repository ID. It also restricts retrieval to the repository's latest indexed commit.

This is intentionally a simple first RAG/retrieval layer. Embeddings, vector search, reranking, streaming, and deeper repository navigation can be added later without changing the public repository indexing contract.
