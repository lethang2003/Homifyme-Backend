var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var passport = require("passport");
const cors = require("cors");

var indexRouter = require("./routes/index");
var RoomRouter = require("./routes/RoomRouter");
var UserRouter = require("./routes/UserRouter");
var UploadRouter = require("./routes/UploadRouter");
var LandlordRouter = require("./routes/LandlordRouter");
var EntryRouter = require("./routes/EntryRouter");
var FavoriteRouter = require("./routes/FavoriteRouter");
var PaymentRouter = require("./routes/PaymentRouter");
var RevenueRouter = require("./routes/RevenueRouter");
var CommentRouter = require("./routes/CommentRouter");

//connect database
const connect = require("./loaders/DBConnect");

//comment out the following line to use the local database
var app = express();

app.use(cors({ origin: "https://homifyme.onrender.com", credentials: true }));
app.connect = connect;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", UserRouter);
app.use("/rooms", RoomRouter);
app.use("/upload", UploadRouter);
app.use("/landlords", LandlordRouter);
app.use("/entry", EntryRouter);
app.use("/favorites", FavoriteRouter);
app.use("/payments", PaymentRouter);
app.use("/revenue", RevenueRouter);
app.use("/comments", CommentRouter);

app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
