---
id: kubernetes-intro
parent: ecosysteme
label: Kubernetes (intro)
explored: false
order: 2
---

# Kubernetes (intro)

Kubernetes (K8s) est le standard de l'industrie pour l'orchestration de conteneurs en production. Il gère le scheduling, la scalabilité, la haute disponibilité et les mises à jour sur des clusters de milliers de nœuds.

## Vocabulaire clé

| Concept Kubernetes | Analogie Docker |
|-------------------|----------------|
| Pod | 1 ou plusieurs conteneurs co-localisés |
| Deployment | docker service (sans Swarm) |
| Service | Exposition réseau (LoadBalancer, ClusterIP) |
| ConfigMap | Variables d'environnement / fichiers de config |
| Secret | Variables sensibles (chiffrées) |
| PersistentVolumeClaim | Volume nommé |
| Namespace | Isolation logique dans le cluster |
| Ingress | Reverse proxy / routing HTTP |
| Node | Machine hôte |

## Passer de Docker Compose à Kubernetes

```yaml
# compose.yml
services:
  api:
    image: my-app:latest
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgresql://user:pass@db:5432/mydb
    depends_on: [db]
```

```yaml
# Kubernetes — Deployment + Service équivalents
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: my-app:latest
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url
          resources:
            requests: { cpu: "100m", memory: "128Mi" }
            limits:   { cpu: "500m", memory: "512Mi" }
          livenessProbe:
            httpGet: { path: /health, port: 3000 }
            initialDelaySeconds: 15
          readinessProbe:
            httpGet: { path: /ready, port: 3000 }
---
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 3000
```

## Démarrer localement

```bash
# Minikube — cluster K8s local
brew install minikube kubectl
minikube start --driver=docker
minikube dashboard

# kind — K8s dans Docker (CI friendly)
brew install kind
kind create cluster

# k3d — k3s dans Docker (léger)
brew install k3d
k3d cluster create dev

# Commandes kubectl de base
kubectl get pods
kubectl get deployments
kubectl apply -f deployment.yml
kubectl delete -f deployment.yml
kubectl logs -f deployment/api
kubectl exec -it pod/api-xxx -- bash
kubectl port-forward service/api 3000:80
```

## Outils de développement local K8s

```bash
# Tilt — live update du cluster local à chaque changement de code
brew install tilt
# Tiltfile
docker_build('my-app', '.')
k8s_yaml('k8s/')
k8s_resource('api', port_forwards=3000)

# Skaffold — build, push, deploy automatisés
brew install skaffold
skaffold dev          # watch mode
skaffold run          # one-shot
```

## Liens

- [kubernetes.io — Concepts](https://kubernetes.io/docs/concepts/)
- [Kompose — convertir Compose en K8s](https://kompose.io/)
- [minikube](https://minikube.sigs.k8s.io/)
- [Tilt](https://tilt.dev/)
- [Helm — package manager K8s](https://helm.sh/)
