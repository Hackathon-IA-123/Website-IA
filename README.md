# Website-IA — « Jean »

Application de chat IA en **Next.js 15 + TypeScript + Tailwind CSS v4**.

Fonctionnalités principales :
- assistant IA servi par **Ollama**
- authentification **Google** via Auth.js
- conversations persistées dans **PostgreSQL** avec Prisma
- interface avec thème clair/sombre et expérience de chat moderne

## Prérequis

- Node.js 20+
- Docker Desktop / Docker Engine
- compte Google OAuth
- Ollama installé localement ou le stack Docker fourni

## 1. Configuration de l’environnement

Copiez le fichier d’exemple puis renseignez les variables nécessaires :

```bash
cp .env.example .env
npx auth secret
```

Variables obligatoires dans `.env` :
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_URL` (par défaut `http://localhost:3000`)
- `AUTH_TRUST_HOST=true`
- `OLLAMA_URL` et `OLLAMA_MODEL`

Le fichier [.env.example](.env.example) contient déjà la configuration adaptée au développement local et au mode Docker.

## 2. Démarrage rapide avec Docker

Le projet peut être lancé entièrement via Docker Compose :

```bash
docker compose up -d
```

Cela démarre :
- la base PostgreSQL
- Ollama
- l’application Next.js

L’application sera disponible sur :
- http://localhost:3000

## 3. Développement local (optionnel)

Si vous préférez travailler en local sans Docker pour l’app :

```bash
docker compose up -d db
npm install
npx prisma db push
npm run dev
```

## 4. Modèle Ollama

Si vous souhaitez précharger un modèle manuellement :

```bash
ollama pull qwen2:0.5b
ollama list
```

Par défaut, l’application utilise `qwen2:0.5b` via la variable `OLLAMA_MODEL`.

## 5. Structure du projet

- [prisma/schema.prisma](prisma/schema.prisma) : schéma Prisma des utilisateurs, sessions et conversations
- [auth.ts](auth.ts) : configuration Auth.js avec Google et Prisma
- [app/api/auth/[...nextauth]/route.ts](app/api/auth/[...nextauth]/route.ts) : route NextAuth
- [app/api/chat/route.ts](app/api/chat/route.ts) : génération de réponse via Ollama
- [app/api/conversations](app/api/conversations) : endpoints de conversations
- [lib/prisma.ts](lib/prisma.ts) : client Prisma
- [app/page.tsx](app/page.tsx) : point d’entrée de l’interface

## 6. Notes utiles

- Le schéma Prisma est synchronisé automatiquement au démarrage de l’application Docker.
- Pour reconstruire l’image applicative :

```bash
docker compose up -d --build app
```
