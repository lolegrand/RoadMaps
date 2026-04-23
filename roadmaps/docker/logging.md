---
id: logging
parent: production
label: Logging & Monitoring
explored: false
order: 1
---

# Logging & Monitoring

Docker collecte les logs de stdout/stderr des conteneurs. En production, on les achemine vers un système centralisé (Loki, Elasticsearch, CloudWatch…).

## Drivers de log Docker

```bash
# Voir le driver actif
docker info | grep "Logging Driver"

# Changer le driver pour un conteneur
docker run --log-driver json-file \
           --log-opt max-size=10m \
           --log-opt max-file=3 \
           my-app

# Configurer globalement dans /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3",
    "compress": "true"
  }
}
```

| Driver | Usage |
|--------|-------|
| `json-file` | Défaut — fichiers locaux |
| `none` | Désactiver les logs |
| `syslog` | Syslog local ou distant |
| `journald` | systemd journald |
| `fluentd` | Fluentd / Fluent Bit |
| `awslogs` | AWS CloudWatch |
| `gcplogs` | Google Cloud Logging |
| `splunk` | Splunk |

## Stack de monitoring — Prometheus + Grafana

```yaml
# compose.yml — monitoring local
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    ports: ["9090:9090"]
    profiles: [monitoring]

  grafana:
    image: grafana/grafana:latest
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana-data:/var/lib/grafana
    ports: ["3001:3000"]
    profiles: [monitoring]

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    ports: ["8080:8080"]
    profiles: [monitoring]
```

```yaml
# prometheus.yml
scrape_configs:
  - job_name: cadvisor
    scrape_interval: 15s
    static_configs:
      - targets: ['cadvisor:8080']

  - job_name: my-app
    static_configs:
      - targets: ['api:3000']    # l'app expose /metrics
```

## Stack de logs — Loki + Grafana

```yaml
services:
  loki:
    image: grafana/loki:latest
    ports: ["3100:3100"]
    profiles: [monitoring]

  promtail:
    image: grafana/promtail:latest
    volumes:
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - ./promtail-config.yml:/etc/promtail/config.yml:ro
    profiles: [monitoring]
```

```bash
# Envoyer les logs Docker vers Loki
docker run \
  --log-driver=loki \
  --log-opt loki-url="http://localhost:3100/loki/api/v1/push" \
  --log-opt loki-labels="job=my-app,env=prod" \
  my-app
```

## Liens

- [docs.docker.com — Logging drivers](https://docs.docker.com/config/containers/logging/configure/)
- [Prometheus — Docker monitoring](https://prometheus.io/docs/guides/cadvisor/)
- [Grafana Loki](https://grafana.com/oss/loki/)
- [cAdvisor — Container Advisor](https://github.com/google/cadvisor)
