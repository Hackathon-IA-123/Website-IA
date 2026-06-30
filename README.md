# Website-IA — « Jean »

Assistant de chat IA en **Next.js 15 + TypeScript + Tailwind CSS v4**.

Ce projet combine :
- IA locale via **Ollama**
- authentification **Google** avec **Auth.js**
- persistance des conversations dans **PostgreSQL** via **Prisma**
- interface moderne avec thème clair/sombre

## Prérequis

- Node.js 20+
- Docker
- Ollama installé localement ou disponible via Docker
- identifiants Google OAuth

## 1. Configuration

1. Copier le modèle d’environnement :

```bash
cp .env.example .env
```

2. Générer `AUTH_SECRET` :

```bash
npx auth secret
```

3. Compléter dans `.env` :
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_URL` (par défaut `http://localhost:3000`)
- `OLLAMA_URL` et `OLLAMA_MODEL`

Le fichier [.env.example](.env.example) contient la configuration de base utilisée pour le développement local.

## 2. Exécution avec Docker

Pour démarrer l’ensemble du stack :

```bash
docker compose up -d
```

Cette commande lance :
- PostgreSQL
- Ollama
- l’application Next.js

Ouvrir ensuite :

```text
http://localhost:3000
```

### Reconstruire l’application

Si vous modifiez le code ou souhaitez forcer une rebuild :

```bash
docker compose up -d --build app
```

## 3. Développement local

Si vous utilisez uniquement Docker pour la base de données et le reste en local :

```bash
docker compose up -d db
npm install
npx prisma db push
npm run dev
```

## 4. Gestion d’Ollama

Depuis la machine hôte :

```bash
ollama pull qwen2:0.5b
ollama list
```

Par défaut, le projet utilise le modèle `qwen2:0.5b`.

## 5. Architecture

- `prisma/schema.prisma` : modèle de données (utilisateurs, sessions, conversations)
- `auth.ts` : configuration Auth.js + Prisma adapter
- `app/api/auth/[...nextauth]/route.ts` : endpoint d’authentification
- `app/api/chat/route.ts` : génération de réponses via Ollama
- `app/api/conversations` : routes de gestion des conversations
- `lib/prisma.ts` : client Prisma
- `app/page.tsx` : page principale et redirection login/chat
- `components/Rail.tsx` : navigation latérale et actions utilisateur

## 6. Notes

- Le conteneur `app` synchronise le schéma Prisma au démarrage.
- Si le service Docker `app` existe déjà, utilisez `--build` pour recharger les changements.
- Le bouton de déconnexion affiche une confirmation avant de sortir du compte.

