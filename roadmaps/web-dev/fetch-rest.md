---
id: fetch-rest
parent: apis-protocoles
label: Fetch API & REST
explored: false
order: 1
---

# Fetch API & REST

`fetch()` est l'API native des navigateurs et de Node.js 18+ pour effectuer des requêtes HTTP. REST (Representational State Transfer) est le style architectural d'API le plus répandu.

## fetch() — utilisation complète

```javascript
// GET basique
const response = await fetch('/api/products');
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const products = await response.json();

// POST avec body JSON
const newProduct = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Request-ID': crypto.randomUUID(),
  },
  body: JSON.stringify({ name: 'Widget', price: 9.99 }),
}).then(async res => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw Object.assign(new Error(error.message ?? 'API error'), { status: res.status, data: error });
  }
  return res.json();
});

// Upload de fichier
const form = new FormData();
form.append('file', fileInput.files[0]);
form.append('metadata', JSON.stringify({ alt: 'Photo produit' }));
await fetch('/api/upload', { method: 'POST', body: form });
// Ne pas setter Content-Type — le navigateur le gère avec le boundary multipart

// Annulation avec AbortController
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);
try {
  const res = await fetch('/api/slow-endpoint', { signal: controller.signal });
  return await res.json();
} finally {
  clearTimeout(timeoutId);
}
```

## Client HTTP réutilisable

```typescript
// api-client.ts — wrapper fetch avec retry, auth, error handling
class ApiClient {
  private baseUrl: string;
  private getToken: () => string | null;

  constructor(baseUrl: string, getToken: () => string | null) {
    this.baseUrl = baseUrl;
    this.getToken = getToken;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers = new Headers(init.headers);
    headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(`${this.baseUrl}${path}`, { ...init, headers });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const error = new ApiError(data.message ?? response.statusText, response.status, data);
      throw error;
    }
    if (response.status === 204) return null as T;
    return response.json() as Promise<T>;
  }

  get<T>(path: string)                    { return this.request<T>(path); }
  post<T>(path: string, body: unknown)    { return this.request<T>(path, { method: 'POST',  body: JSON.stringify(body) }); }
  patch<T>(path: string, body: unknown)   { return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }); }
  delete<T>(path: string)                 { return this.request<T>(path, { method: 'DELETE' }); }
}

class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

## Conception d'une API REST

```
Règles de nommage :
GET    /api/v1/products              → liste
POST   /api/v1/products              → créer
GET    /api/v1/products/:id          → détail
PATCH  /api/v1/products/:id          → modifier
DELETE /api/v1/products/:id          → supprimer
GET    /api/v1/products/:id/reviews  → sous-ressource

Query params pour la collection :
GET /api/v1/products?page=2&limit=20&sort=price&order=asc&category=electronics
```

```json
// Réponse paginée standard
{
  "data": [...],
  "meta": {
    "total": 1547,
    "page": 2,
    "limit": 20,
    "totalPages": 78
  },
  "links": {
    "self":  "/api/v1/products?page=2",
    "next":  "/api/v1/products?page=3",
    "prev":  "/api/v1/products?page=1",
    "first": "/api/v1/products?page=1",
    "last":  "/api/v1/products?page=78"
  }
}
```

## Liens

- [MDN — Fetch API](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API)
- [MDN — Using Fetch](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch)
- [REST API Design — Best Practices](https://restfulapi.net/)
