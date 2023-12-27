# Getting Started

```bash
# Install dependencies
npm install

# Create a new Docker container
docker run --name api-brain-ag-postgres -e POSTGRESQL_USERNAME=docker -e POSTGRESQL_PASSWORD=docker -e POSTGRESQL_DATABASE=api-brain-ag -p 5432:5432 bitnami/postgresql:latest

# Start Docker container
docker start api-brain-ag-postgres
```
