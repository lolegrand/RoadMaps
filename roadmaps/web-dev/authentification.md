---
id: authentification
parent: apis-protocoles
label: Authentification Web
explored: false
order: 3
---

# Authentification Web

L'authentification vérifie l'identité ; l'autorisation vérifie les permissions. Les approches principales sont les sessions (stateful), les tokens JWT (stateless) et OAuth2/OIDC (délégation).

## Sessions vs JWT — choisir la bonne approche

| | Sessions | JWT |
|---|---|---|
| Stockage serveur | En base / Redis | Aucun (stateless) |
| Révocation | Immédiate (delete en base) | Complexe (blacklist ou courte durée) |
| Scalabilité | Nécessite un store partagé | Pas de store (n'importe quel serveur) |
| Taille cookie | Petit (session ID) | Plus grand (claims encodés) |
| Cas d'usage | Apps web traditionnelles | APIs REST, microservices |

## Sessions — implémentation Express

```javascript
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

app.use(session({
  store:  new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure:   process.env.NODE_ENV === 'production', // HTTPS only
    httpOnly: true,       // pas accessible par JS
    sameSite: 'strict',   // protection CSRF
    maxAge:   7 * 24 * 60 * 60 * 1000,  // 7 jours
  },
}));

// Login
app.post('/auth/login', async (req, res) => {
  const user = await verifyCredentials(req.body);
  req.session.userId = user.id;
  req.session.role   = user.role;
  res.json({ ok: true });
});

// Middleware de protection
const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  next();
};

// Logout
app.post('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});
```

## Mots de passe — bonnes pratiques

```javascript
import { hash, verify } from 'argon2';  // argon2 > bcrypt > scrypt

// Hachage
const hashedPassword = await hash(plainPassword, {
  type:        argon2.argon2id,   // variante recommandée
  memoryCost:  65536,             // 64 MB
  timeCost:    3,                 // 3 itérations
  parallelism: 4,
});

// Vérification — résistant aux timing attacks
const isValid = await verify(hashedPassword, plainPassword);
```

## OAuth2 / OIDC — connexion via Google, GitHub…

```javascript
// Utiliser une librairie — ne jamais implémenter manuellement
// next-auth, auth.js, lucia-auth, better-auth

// Exemple avec better-auth (2024)
import { betterAuth } from 'better-auth';
export const auth = betterAuth({
  database: prismaAdapter(prisma),
  socialProviders: {
    google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET },
    github: { clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET },
  },
  emailAndPassword: { enabled: true },
  session: {
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
});
```

## CSRF — protection

```javascript
// Tokens CSRF — valider que la requête vient bien du frontend
import { doubleCsrf } from 'csrf-csrf';

const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  cookieName: '__Host-csrf',
  cookieOptions: { secure: true, sameSite: 'strict' },
});

app.get('/csrf-token', (req, res) => res.json({ token: generateToken(req, res) }));
app.use('/api', doubleCsrfProtection);   // protège toutes les routes API
```

## Liens

- [OWASP — Authentication Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [auth.js](https://authjs.dev/)
- [better-auth](https://www.better-auth.com/)
- [argon2 — npm](https://www.npmjs.com/package/argon2)
