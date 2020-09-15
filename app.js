require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (e, hash) {
    const newUser = User({
      email: req.body.username,
      password: hash,
    });
    newUser.save(function (e) {
      if (e) {
        console.log(e);
      } else {
        res.render("secrets");
      }
    });
  });
});
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (e, foundUser) {
    if (e) {
      console.log(e);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (e, result) {
          //result ==true
          if (result === true) {
            console.log(password);
            console.log(foundUser.password);
            res.render("secrets");
          }
        });
      }
    }
  });
});

app.listen(3000, function () {
  console.log("Server encendido");
});
