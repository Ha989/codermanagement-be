var express = require('express');
const { sendResponse } = require('../helpers/untils');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const { err } = req.params;
  try {
     if (err === 'error') {
        throw new AppError(404, 'Access denied', 'Authentication Error');
     } else {
     sendResponse(
        res,
        200,
        {data: "success"},
        null,
        "Welcome to Coder Management",
     );
    }
  } catch (error) {
     next(error);
  }
});

const userAPI = require('./user.api');
const taskAPI = require('./task.api.js');

router.use('/user', userAPI);
router.use('/task', taskAPI);


module.exports = router;
