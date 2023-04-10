require("dotenv").config();
const cors = require("cors");
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");

const indexRouter = require('./routes/index');
const { AppError, sendResponse } = require("./helpers/untils");

const app = express();
const mongoURI = process.env.MONGODB_URI;

mongoose
 .connect(mongoURI)
 .then(() => console.log("DB connected"))
 .catch((error) => console.log(error));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())


app.use('/', indexRouter);

app.use((req, res, next) => {
    const err = new AppError(404,"Not Found","Bad Request");
    next(err);
  });

  app.use((err, req, res, next) => {
    console.log("ERROR", err);
      return sendResponse(
        res,
        err.statusCode ? err.statusCode : 500,
        false,
        null,
        { message: err.message },
        err.isOperational ? err.errorType : "Internal Server Error"
      );
  });

module.exports = app;
