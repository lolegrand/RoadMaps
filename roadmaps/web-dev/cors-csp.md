---
id: cors-csp
parent: securite
label: CORS & Headers de sécurité
explored: false
order: 2
---

# CORS & Headers de sécurité

Les headers HTTP de sécurité sont la première ligne de défense côté navigateur. CORS contrôle qui peut appeler votre API depuis un autre domaine.

## CORS — Cross-Origin Resource Sharing

```javascript
// CORS côté serveur — Express
import cors from 'cors';

// ❌ Dangereux — tout le monde peut appeler l'API
app.use(cors({ origin: '*' }));

// ✅ Whitelist explicite
const allowedOrigins = [
  'https://app.example.com',
  'https://admin.example.com',
  process.env.NODE_ENV === 'development' && 'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (Postman, curl, mobile)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origine non autorisée: ${origin}`));
    }
  },
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  credentials: true,           // autoriser les cookies cross-origin
  maxAge:      86400,          // cache le preflight 24h
}));
```

## Content Security Policy (CSP)

```javascript
// Helmet.js — applique automatiquement les headers de sécurité
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:    ["'self'"],
      scriptSrc:     ["'self'", "'nonce-{NONCE}'"],  // nonce généré par requête
      styleSrc:      ["'self'", "'unsafe-inline'"],   // ou nonce
      imgSrc:        ["'self'", "data:", "https://cdn.example.com"],
      connectSrc:    ["'self'", "https://api.example.com"],
      fontSrc:       ["'self'", "https://fonts.gstatic.com"],
      objectSrc:     ["'none'"],
      frameAncestors:["'none'"],         // empêche le clickjacking
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,  // ajuster selon les besoins
}));
```

## Headers de sécurité essentiels

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  → Force HTTPS — les navigateurs refusent HTTP pendant 1 an

X-Content-Type-Options: nosniff
  → Le navigateur ne devrait pas deviner le MIME type

X-Frame-Options: DENY
  → Empêche d'inclure la page dans une iframe (clickjacking)
  → Remplacé par CSP frame-ancestors

Referrer-Policy: strict-origin-when-cross-origin
  → Limite l'URL envoyée dans le header Referer

Permissions-Policy: camera=(), microphone=(), geolocation=(self)
  → Désactive les APIs sensibles non utilisées
```

```bash
# Vérifier les headers d'un site
curl -I https://example.com | grep -i 'strict-transport\|content-security\|x-frame'

# Analyse complète
npx observatory-cli https://example.com
# Ou securityheaders.com
```

## Rate Limiting — protection contre le brute-force

```javascript
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

// Limiter les tentatives de connexion
const loginLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,  // 15 minutes
  limit:            10,               // 10 tentatives max
  message:          { error: 'Trop de tentatives, réessayez dans 15 minutes' },
  standardHeaders:  'draft-7',
  legacyHeaders:    false,
  skipSuccessfulRequests: true,
});

// Ralentissement progressif (slow down avant le blocage)
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 5,            // ralentir après 5 requêtes
  delayMs: (hits) => hits * 500,  // +500ms par requête supplémentaire
});

app.post('/auth/login', speedLimiter, loginLimiter, loginHandler);

// API globale
app.use('/api', rateLimit({ windowMs: 60 * 1000, limit: 100 }));
```

## Liens

- [MDN — CORS](https://developer.mozilla.org/fr/docs/Web/HTTP/CORS)
- [Helmet.js](https://helmetjs.github.io/)
- [securityheaders.com — analyser les headers](https://securityheaders.com/)
- [OWASP — CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
