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

## creating controller methods

_creating controller methods for each routes_.

- create controller folder
- create bootcamps.js for creatng controller.
- in this files, v create controller method associated with each routes in routes folder.

_controller/bootcamps.js_

```javascript
// create controller method for each routes
// and export

// @desc - get all bootcamps
// @access- public - no authentication required
// route - GET /api/v1/bootcamps

exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: `show all bootcamps` });
};

// @desc - get a bootcamps
// @access- public - no authentication required
// route - GET /api/v1/bootcamps/:id

exports.getSingleBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `got bootcamp with id ${req.params.id}` });
};

// @desc - post a bootcamp
// @access- private - authentication required
// route - POST /api/v1/bootcamps

exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'posted new bootcamp' });
};

// @desc - update a bootcamp
// @access- private - authentication required
// route - PUT /api/v1/bootcamps/:id

exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `updated bootcamp with id ${req.params.id}` });
};

// @desc - delete a bootcamp
// @access- private - authentication required
// route - PUT /api/v1/bootcamps/:id

exports.deleteBootcamp = (res, req, next) => {
  res
    .status(200)
    .json({ success: true, msg: `deleted bootcamp with id ${req.params.id}` });
};
```

- now v need to require this controller methods in routes files.

_routes/bootcamps.js_

```javascript
// require controller methods using destructuring
const {
  getBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require('../controllers/bootcamps');

// set routers for get and post that having no params
router.route('/').get(getBootcamps).post(createBootcamp);

// set a seperate routers for put, delete, get with params having id.
router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);
```

## middleware

- function that has access to request response cycle.

**server.js**

```javascript
// define a middleware
const logger = (req, res, next) => {
  req.hello = 'hello node';
  console.log(req.hello);
  // call next() to move to next middleware in the cycle
  next();
};

// using above middleware
app.use(logger);
```

this _req.hello_ object can be accesses anywhere from controllers.

**controllers/bootcamps.js**

```javascript
exports.getBootcamps = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `show all bootcamps`, middlware: req.hello });
};
```

**use middleswares in separte folder**

- create middleswarew directpory.
- create a js file
- define middleware and export it
- require the middleware in server.js
- use the middleware there.

### using thrid party middleware _morgan_

```shell
npm i morgan
```

**definition**

- Morgan is a HTTP request logger middleware for node.js.

**server.js**

```javascript
// require morgan middleware
const morgan = require('morgan');
// use morgan middlware
if (process.env.NODE_ENV === 'development') {
  // use morgan- pass any argument.
  app.use(morgan('tiny'));
}
```
