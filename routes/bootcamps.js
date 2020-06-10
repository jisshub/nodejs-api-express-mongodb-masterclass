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
