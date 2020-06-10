### node -express Project Setup

```bash
- npm init

- git init

- npm i nodemon -D

- npm i express dotenv
```

- touch .gitignore

- add _node_modules_ to **.gitignore**

- **dotenv**: Dotenv is a module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code.

### package.json

**scripts**

```json
"scripts": {
    "start": "NODE_ENV=production node server",
    "dev": "nodemon server"
}
```

- run the app in production environment.
- as part of development - use nodemon - nodemon automatically detects the changes v make.

* touch server.js
* mkdir -v config
* cd condig && touch config.env

**config.env**

```shell
NODE_ENV = development
PORT = 5000
```

- add _config/config.env_ to **.gitignore**

**server.js**

- basic set up

```javascript
const express = require('express');
const dotenv = require('dotenv');

// configure dotenv - laod env variables
dotenv.config({ path: './config/config.env' });

// initialze express app
const app = express();

// set port - listen to PORT 5000 always
const PORT = process.env.PORT || 5000;

// listen to port
app.listen(PORT, () => {
  console.log(`App runs in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
```

#### run the server

```shell
npm run dev - development mode
npm start  - production mode
```
