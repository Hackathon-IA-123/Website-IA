# Website-IA — « Jean »

Chat IA (style inspiré des assistants modernes) en **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4**.

- Modèle IA servi par **Ollama** (local).
- Connexion **Google** (Auth.js v5).
- Conversations **persistées dans PostgreSQL** (Prisma) et **liées au compte** → on peut rouvrir une ancienne conversation.
- Thème clair/sombre, sélecteur Médical/Finance, chat temporaire (non enregistré).

## Prérequis

- Node.js 20+
- Docker (PostgreSQL et/ou déploiement)
- **Ollama** installé (https://ollama.com)
- Identifiants **Google OAuth**

## 1. Variables d'environnement

```bash
cp env.example .env
npx auth secret          # remplit AUTH_SECRET
```

Renseigner dans `.env` :
- `DATABASE_URL` (déjà OK pour la base Docker locale)
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — créés sur
  https://console.cloud.google.com/apis/credentials
  (type **Application Web**, URI de redirection
  `http://localhost:3000/api/auth/callback/google`)
- `OLLAMA_URL` / `OLLAMA_MODEL`

## 2. Modèle Ollama

```bash
ollama pull qwen2:0.5b           # rapide, pour démo
# (qualité supérieure : ollama pull qwen2.5:3b  -> OLLAMA_MODEL=qwen2.5:3b)
ollama list                      # voir les modèles installés
```

Ollama écoute sur `http://localhost:11434`.

## 3. Lancer en développement

```bash
docker compose up -d db          # 1) base de données
npm install                      # 2) dépendances (+ prisma generate)
npx prisma db push               # 3) crée les tables
npm run dev                      # 4) http://localhost:3000
```

## 4. Déploiement (tout en Docker)

```bash
# .env doit contenir AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
docker compose up --build
```

`docker-compose.yml` démarre **PostgreSQL** + l'**app** (qui synchronise le schéma
au démarrage). Ollama reste sur la machine hôte ; l'app le joint via
`host.docker.internal`.

## Architecture

| Élément | Fichier |
|---|---|
| Schéma DB (User/Account/Session + Conversation/Message) | [prisma/schema.prisma](prisma/schema.prisma) |
| Config Auth.js (Google + Prisma adapter) | [auth.ts](auth.ts) |
| Route NextAuth | [app/api/auth/[...nextauth]/route.ts](app/api/auth/%5B...nextauth%5D/route.ts) |
| Chat (auth + Ollama + persistance) | [app/api/chat/route.ts](app/api/chat/route.ts) |
| Conversations (liste / lecture / suppression) | [app/api/conversations](app/api/conversations) |
| Client Prisma | [lib/prisma.ts](lib/prisma.ts) |
| Page (login si déconnecté, sinon chat) | [app/page.tsx](app/page.tsx) |

Variables : voir [env.example](env.example).
