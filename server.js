/**
 * Created by rishabhkhanna on 14/11/16.
 */
const express = require('express');
const app = express();
const Parse = require('Parse/node');
const path = require('path');

var port = process.env.PORT || 3333;

var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
        clientID: 1320253381341248,
        clientSecret: "9ca8ba88d2bdeba99320d6985b05a2cd" ,
        callbackURL: "http://localhost:333/"
    },
    function(accessToken, refreshToken, profile, done) {
        if(profile != null){
            console.log(profile.name);
        }
    }
));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/',
        failureRedirect: '/login' }));

app.use('/' , express.static(__dirname + "/public"));

app.use('/',(req, res)=> {
    Parse.initialize("ucfS6neahiGB0BOd1aAfV7HxQTye5K0U4r40N1O3", "4igpUls0v3KRQI2o4dhNx8uTWUduMcyUuxQqsYSH");
    Parse.serverURL = "https://parseapi.back4app.com/";
    res.sendFile(__dirname + "/public/html/index.html");
});


app.listen(port , ()=>{
    console.log("magic happens at 3333");
});