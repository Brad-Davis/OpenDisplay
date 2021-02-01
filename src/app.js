
require('./db.js');
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const path = require("path");
const fs = require("fs");
const port = 3000;
const p = path.join(__dirname, "public");
const mongoose = require('mongoose');
const Display = mongoose.model('Display');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(express.static(p));

app.use(express.urlencoded({ extended: false }));
const hbs = exphbs.create({
    extname      :'hbs',
    layoutsDir   : path.join(__dirname, "public", "views"),
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//homepage
app.get("/", function(req, res, next){
    res.render(path.join(p, "views", "home.hbs"), {layout: 'layout'});
});

//sends to form to create a new display
app.get("/new-display", function(req, res, next){
    res.render(path.join(p, "views", "newDisplay.hbs"), {layout: 'layout'});
});

//Creating and adding a new display to the database
app.post("/new-display", function(req, res, next) {
    let user = "";//guest display creator
    //sets user to the id of the logged in user 
    if (req.cookies.id){
        user = req.cookies.id;
    }
    new Display({
        user: user,
        name: req.body.name,
        colors: [req.body.color1, req.body.color2, req.body.color3],
        theme: req.body.theme,
        responsive: req.body.responsive
    }).save(function(err, review){
        if(err){
           res.redirect('/new-display');
        }
        res.redirect('/my-displays');
    });
});

//
app.get("/my-displays", function(req, res, next){
    let user = ""; // gets displays made by guests if not logged in
    if (req.cookies.id){
        user = req.cookies.id; //sets user to id of the logged in user
    }
    Display.find({user: user}, function(err, display){
        res.render(path.join(p, "views", "myDisplays.hbs"), {layout: 'layout', display: display});
    });
});

//goes to login page
app.get("/login", function(req, res, next){
    res.render(path.join(p, "views", "login.hbs"), {layout: 'layout'});
})

//sends login information
app.post("/login", function(req, res, next){
    User.findOne({ //finds the user in the database with the username
        username: req.body.username
    }).then(function (user) {
        if (!user) {
            //didn't work
            res.send('Incorrect username');
            res.redirect('/login');
        } else {
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (result == true) {
                    res.cookie('user', req.body.username);
                    res.append('Set-Cookie', 'user=' + user.username);
                    res.append('Set-Cookie', "id=" + user._id);
                    res.redirect('/');
                } else {
                    res.send('Incorrect password');
                    res.redirect('/login');
                }
            });
        }
    });
});

//create a new user
app.get("/new-user", function(req, res, next){
    res.render(path.join(p, "views", "newUser.hbs"), {layout: 'layout'});
});

//create new user
app.post("/new-user", function(req, res, next){
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.passwordSignUp, salt, function(err, hash) {
            if(err){
                //user redirect after error
                res.redirect("/new-user");
            }
            //add to user database
            User.create({
                username: req.body.usernameSignUp,
                password: hash
            }).then(function (data){
                if(data){
                    res.append('Set-Cookie', 'user=' + req.body.usernameSignUp);
                    res.append('Set-Cookie', "id=" + user._id);
                    res.redirect('/');
                }
            });
        });
    });
});

//showing display
app.get("/display", function(req, res, next){
    //find the display 
    Display.findOne({_id: req.query.id}).then(function(display){
        if(!display){
            res.redirect("/my-displays");
            //ERROR
        } else {
            res.render(path.join(p, "views", "display.hbs"), {display: display, color1: display.colors[0], color2: display.colors[1], color3: display.colors[2], layout: ""});
        }
    })
});

//Handlebars.regi

//login page: storing and comparing email and password,and redirecting to home page after login


  

app.listen(process.env.PORT || 3000);
