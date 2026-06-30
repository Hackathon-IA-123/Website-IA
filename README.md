# Website-IA

## Prerequisites
- Docker installed and running
- Node.js 18+

## Setup

### 1. Start Ollama
```bash
docker run -d -p 11434:11434 --name ollama ollama/ollama
docker exec ollama ollama pull qwen2:0.5b
```

### 2. Configure environment
Create a `.env.local` at the root of the project:
```bash
LLM_BACKEND=ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2:0.5b
```

### 3. Install and run
```bash
npm install
npm run dev
```

## Test the API
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"dis bonjour"}]}' \
  --no-buffer
```

## Switching to Triton (production)
Update `.env.local`:
```bash
LLM_BACKEND=triton
TRITON_URL=http://<triton-host>:8000
TRITON_MODEL=phi35_financial
```
Then restart the dev server.