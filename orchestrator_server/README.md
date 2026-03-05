# LectureAI Backend

Backend service for generating lecture plans and assessments using FastAPI, LangGraph, LangChain, Ollama, and ChromaDB.

## Prerequisites

- Python 3.11+
- [Ollama](https://ollama.com) running locally
  - Gemma 3 model (e.g. `gemma3:latest`)
  - Embedding model (e.g. `nomic-embed-text` or `mxbai-embed-large`)

## Setup

```bash
python -m venv .venv
source .venv/bin/activate 
pip install -r requirements.txt
```

## Running the API

From the project root:

```bash
uvicorn backend.app.main:app --reload
```

By default, the API will expose:

- `POST /api/v1/plan` – Generate a lecture plan.
- `POST /api/v1/upload` – Upload and index a PDF for RAG.
- `POST /api/v1/assessments` – Generate MCQs based on a lecture plan + PDFs.

## Example Requests (via curl)

### Generate a Plan

```bash
curl -X POST http://localhost:8000/api/v1/plan \
  -H "Content-Type: application/json" \
  -d '{
    "module_title": "Fundamentals of OOP",
    "audience": "Undergraduate",
    "duration_minutes": 600
  }'
```

### Upload a PDF

```bash
curl -X POST "http://localhost:8000/api/v1/upload" \
  -F "file=@/path/to/notes.pdf" \
  -F "document_set_id=my_oop_notes"
```

### Generate Assessments

```bash
curl -X POST http://localhost:8000/api/v1/assessments \
  -H "Content-Type: application/json" \
  -d '{
    "lecture_plan": { ... },
    "document_set_id": "my_oop_notes",
    "num_questions": 10,
    "focus_topics": ["Polymorphism", "Encapsulation"]
  }'
```

## Running Tests

Tests use `pytest`. From the project root:

```bash
pytest
```


