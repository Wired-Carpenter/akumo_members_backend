Run instruction

Web

```
yarn
yarn dev
```

Backend

```
npm i -g knex
yarn
docker-compose up -d // Start MySQL server
Browser: Go to localhost:8080, Create a new database named "akumo_members_dev"
knex migrate:latest
yarn start
```
