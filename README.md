# Book Rental App

## Run the application

### 1) Install the dependencies

```bash
$ npm i
```

### 2) Rename .env.example to .env & fill in the values

### 3) Push the database schema to your mysql datatabase

```bash
$ npx prisma db push
```

### 4) Build the application

```bash
$ npx nx run-many --target=build --configuration=production --all=true --parallel=true --maxParallel=3
```

### 5) Run the application

```bash
$ npx nx serve backend-api --configuration=production
$ npx nx serve webapp --configuration=production
```
