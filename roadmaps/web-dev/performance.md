---
id: performance
parent: root
label: Performance Web
explored: false
order: 7
---

# Performance Web

La performance web impacte directement l'expérience utilisateur, le SEO et les conversions. Google utilise les Core Web Vitals comme signal de ranking.

## Core Web Vitals (2024)

| Métrique | Mesure | Bon | À améliorer |
|----------|--------|-----|-------------|
| **LCP** Largest Contentful Paint | Chargement du contenu principal | < 2.5s | > 4s |
| **INP** Interaction to Next Paint | Réactivité aux interactions | < 200ms | > 500ms |
| **CLS** Cumulative Layout Shift | Stabilité visuelle | < 0.1 | > 0.25 |

```bash
# Mesurer
npx lighthouse https://example.com --view
# Ou via Chrome DevTools → Lighthouse → Generate report
# Ou PageSpeed Insights : pagespeed.web.dev
```

## Liens

- [web.dev — Core Web Vitals](https://web.dev/articles/vitals)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
