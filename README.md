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
knex seed:run
yarn start
```

Admin user:
admin@akumo.com
akumo123
