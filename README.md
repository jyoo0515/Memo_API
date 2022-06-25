# Memo API
## How to Start

### 1. Install dependencies
```(bash)
$ npm install
```
Also, install [Docker](https://www.docker.com/) if not installed

### 2. Create .env file
#### Example
```
TZ=Asia/Seoul
PORT=5000
POSTGRES_DB=memo
POSTGRES_USER=test
POSTGRES_PASSWORD=test

DB_SCHEMA=memo
DB_USER=test
DB_PASSWORD=test
DB_HOST=database

JWT_SECRET=random_string
```
#### How to create JWT_SECRET
```
$ node
$ require('crypto').randomBytes(64).toString('hex')
$ .exit
```

### 3. Run application
```(bash)
$ docker-compose up --build
```

### 4. Check Swagger document
Go to http://localhost:5000/docs to check out the api document an run tests

## Testing
```(bash)
$ npm run test
```