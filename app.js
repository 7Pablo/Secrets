//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String,
});

const secret = "Thisisourlittlesecret";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });


const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password,
    });

    newUser.save()
        .then(() => {
            res.render("secrets");
            console.log("User registered successfully");
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne( {email: username})
        .then((user) => {
            if(user){
                if(user.password === password){
                    res.render("secrets");
                    console.log("Login successfully");
                } else {
                    res.redirect("/login");
                    console.log("Incorrect password");
                }
            } else {
                res.redirect("/login");
                console.log("User with this username does not exists")
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

app.listen(port, () => {
    console.log("Server running on port " + port);
});