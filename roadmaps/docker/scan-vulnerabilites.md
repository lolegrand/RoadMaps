---
id: scan-vulnerabilites
parent: securite
label: Scan de vulnérabilités
explored: false
order: 2
---

# Scan de vulnérabilités

Scanner les images avant de les déployer permet de détecter les CVEs (Common Vulnerabilities and Exposures) dans les paquets OS et les dépendances applicatives.

## Docker Scout (officiel, Docker Desktop)

```bash
# Analyser une image locale
docker scout cves my-app:latest

# Résumé des vulnérabilités
docker scout quickview my-app:latest

# Comparer avec la version précédente
docker scout compare my-app:latest my-app:v1.0.0

# Recommandations d'images de base
docker scout recommendations my-app:latest

# Intégration CI — exit code non-zéro si vulnérabilités critiques
docker scout cves --exit-code --only-severity critical,high my-app:latest
```

## Trivy (open-source, Aqua Security)

```bash
# Installer
brew install aquasecurity/trivy/trivy

# Scanner une image
trivy image nginx:alpine
trivy image --severity HIGH,CRITICAL my-app:latest

# Scanner un Dockerfile (avant le build)
trivy config Dockerfile

# Scanner un répertoire (IaC, configs)
trivy fs .
trivy fs --scanners config,secret .

# Format JSON pour l'intégration CI
trivy image --format json --output report.json my-app:latest

# Ignorer des CVEs connues (faux positifs, risque accepté)
# .trivyignore
# CVE-2023-12345
# CVE-2023-67890
```

## Grype (open-source, Anchore)

```bash
brew install anchore/grype/grype

grype my-app:latest
grype my-app:latest --fail-on high
grype dir:.             # scanner le répertoire courant
grype sbom:./sbom.json  # à partir d'un SBOM
```

## SBOM — Software Bill of Materials

```bash
# Générer un SBOM (inventaire de toutes les dépendances)
docker sbom my-app:latest                     # format SPDX
docker sbom my-app:latest --format cyclonedx  # CycloneDX

# Avec Syft (Anchore)
brew install syft
syft my-app:latest -o spdx-json > sbom.json
syft my-app:latest -o cyclonedx-json >> sbom.cyclonedx.json

# Scanner le SBOM avec Grype
grype sbom:./sbom.json
```

## Intégration CI/CD — GitHub Actions

```yaml
# .github/workflows/security.yml
- name: Scan image avec Trivy
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: my-app:${{ github.sha }}
    format: sarif
    output: trivy-results.sarif
    severity: CRITICAL,HIGH
    exit-code: '1'    # fail le pipeline si trouvé

- name: Upload résultats → GitHub Security
  uses: github/codeql-action/upload-sarif@v2
  with:
    sarif_file: trivy-results.sarif
```

## Liens

- [docs.docker.com — Docker Scout](https://docs.docker.com/scout/)
- [Trivy — GitHub](https://github.com/aquasecurity/trivy)
- [Grype — GitHub](https://github.com/anchore/grype)
- [Syft — SBOM generator](https://github.com/anchore/syft)
