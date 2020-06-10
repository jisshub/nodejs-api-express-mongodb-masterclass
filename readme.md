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

## creating routes using express

```javascript
// sending text
app.get('/', (req, res) => {
  res.send('hello nodejs');
});

// sending html

app.get('/', (req, res) => {
  res.send('<h1>hello nodejs</h1>');
});

// sending json ,use json()
app.get('/', (req, res) => {
  res.json({ name: 'jiss' });
});
```

### create simple route with status codes

```javascript
// create routes with status code
app.get('/', (req, res) => {
  res.status(400).json({ success: false, data: { name: 'jissmon jose' } });
});
```

### api structure

_/api/v1/bootcamps_
_/api/v1/courses_

- v1 means version of the api.

## create routes usiing diff. request methods

```javascript
// get request
app.get('/api/v1/bootcamps', (req, res) => {
  res.status(400).json({ success: false, data: { name: 'jissmon jose' } });
});

// post request
app.post('/api/v1/bootcamps', (req, res) => {
  res.status(200).json({ success: true, msg: 'posted new bootcamp' });
});

// put request
app.put('/api/v1/bootcamps/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `updated bootcamp with id ${req.params.id}` });
});

// delete request
app.delete('/api/v1/bootcamps/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `deleted bootcamp with id ${req.params.id}` });
});
```

## using express router

- create routes dir in root
- create bootcamp.js file in it.
- create routes using express Router.
- expoert routers to server

**bootcamp.js**

```javascript
const express = require('express');
// require express Router
const router = express.Router();

// set routers for each request

// get request - 1
router.get('', (req, res) => {
  res.status(200).json({ success: true, msg: 'show all bootcamps' });
});

// get request - 2
router.get('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `got bootcamp with id ${req.params.id}` });
});

// post request
router.post('', (req, res) => {
  res.status(200).json({ success: true, msg: 'posted new bootcamp' });
});

// put request
router.put('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `updated bootcamp with id ${req.params.id}` });
});

// delete request
router.delete('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `deleted bootcamp with id ${req.params.id}` });
});

// export the router here
module.exports = router;
```

**server.js**

```javascript
// require thr express router exported from bootcamps.js
const bootcamps = require('./routes/bootcamps');
// use express router
app.use('/api/v1/bootcamps', bootcamps);
```

- v doesnt have to set _/api/v1/bootcamps_
  for the all routes in bootcamp.js.
