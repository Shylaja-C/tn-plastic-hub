Project: TNPlasticHub. FastAPI backend in /backend, Next.js (App Router, TypeScript,
Tailwind, existing shadcn components) frontend in /frontend. Frontend calls
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1.

Working rules (to save credits):
- NEVER open or search node_modules, .next, .venv, package-lock.json, tsconfig.tsbuildinfo.
- Read only the files named in the task. Do not scan the whole repo.
- Make minimal edits; do not rewrite files that already work. Do not add dependencies.
- Reuse existing components in src/components/ui and helpers in src/lib/api.ts.
- Do not run `npm install`, `npm run build` or the dev server repeatedly. Verify once
  at the end of a task: `npx tsc --noEmit` (frontend) or `python -c "import app.main"`
  (backend, with DATABASE_URL=postgresql+psycopg2://u:p@localhost/x).
- No browser/screenshot testing unless I ask.
- Finish with a short changelog (file: one line each). No long explanations.
- Never print or commit contents of .env files.
