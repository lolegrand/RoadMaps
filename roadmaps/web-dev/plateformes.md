---
id: plateformes
parent: deploiement
label: Plateformes & Hosting
explored: false
order: 1
---

# Plateformes & Hosting

Les plateformes modernes gèrent automatiquement l'infrastructure, le CDN et les certificats TLS. La plupart offrent un tier gratuit généreux pour les projets personnels.

## Vercel — le standard pour Next.js et les SPAs

```json
// vercel.json — configuration de déploiement
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://api.example.com/$1" },
    { "source": "/(.*)",     "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "regions": ["cdg1"]   // Paris
}
```

```bash
# Déploiement
npm i -g vercel
vercel login
vercel                  # déploiement preview
vercel --prod           # déploiement production

# Variables d'environnement
vercel env add DATABASE_URL production
vercel env pull .env.local  # récupérer les variables en local
```

## Netlify — sites statiques + fonctions

```toml
# netlify.toml
[build]
  command     = "npm run build"
  publish     = "dist"
  environment = { NODE_VERSION = "22" }

[[redirects]]
  from   = "/*"
  to     = "/index.html"
  status = 200   # SPA redirect

[[redirects]]
  from   = "/api/*"
  to     = "https://api.example.com/:splat"
  status = 200
  force  = true

[[headers]]
  for    = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## Railway — Node.js + base de données

```bash
# Installer Railway CLI
npm i -g @railway/cli
railway login
railway init          # lier au projet Railway
railway up            # déployer

# Variables
railway variables set DATABASE_URL=...
railway variables set JWT_SECRET=...
```

```dockerfile
# Railway détecte automatiquement le Dockerfile
# Ou utilise Nixpacks (zéro config)
# railway.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## Variables d'environnement en production

```bash
# NE JAMAIS :
# - Committer des secrets dans git
# - Passer des secrets en arguments docker run (visibles dans ps)
# - Logger des secrets

# TOUJOURS :
# - Utiliser les secrets de la plateforme (chiffrés au repos)
# - Rotation régulière des secrets
# - Principe de moindre privilège (DB user en lecture seule si possible)
# - Audit des accès
```

## DNS & Domaine personnalisé

```bash
# Après avoir ajouté le domaine dans la plateforme
# Configurer le DNS chez votre registrar :

# Pour Vercel
CNAME   www     cname.vercel-dns.com
A       @       76.76.21.21

# Pour Netlify
CNAME   www     your-site.netlify.app
A       @       75.2.60.5

# Vérification
dig www.example.com CNAME
nslookup www.example.com

# HTTPS — automatique sur toutes ces plateformes (Let's Encrypt)
```

## Liens

- [vercel.com](https://vercel.com/)
- [netlify.com](https://netlify.com/)
- [railway.app](https://railway.app/)
- [render.com](https://render.com/)
- [fly.io](https://fly.io/)
