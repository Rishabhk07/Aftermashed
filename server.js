/**
 * Created by rishabhkhanna on 14/11/16.
 */
const express = require('express');
const app = express();
const Parse = require('Parse/node');
const path = require('path');
// app.configure(function() {
//     app.use(express.static('public'));
//     // app.use(express.cookieParser());
//     // app.use(express.bodyParser());
//     // app.use(express.session({ secret: 'keyboard cat' }));
//     app.use(passport.initialize());
//     app.use(passport.session());
//     // app.use(app.router);
// });



var port = process.env.PORT || 3333;

var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
        clientID: "1320253381341248",
        clientSecret: '9ca8ba88d2bdeba99320d6985b05a2cd' ,
       callbackURL: "http://localhost:3333/auth/facebook/callback",
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
        enableProof: true
    },
    function(accessToken, refreshToken, profile, done) {
        Parse.initialize("ucfS6neahiGB0BOd1aAfV7HxQTye5K0U4r40N1O3" , "4igpUls0v3KRQI2o4dhNx8uTWUduMcyUuxQqsYSH");
        Parse.serverURL = 'https://parseapi.back4app.com/';
        var User = Parse.Object.extend("Test");
        var query = new Parse.Query(User);
        if(profile.id != null) {

            var user = JSON.parse(JSON.stringify(profile));

            console.log(user);
            query.equalTo("ObjectId", profile.id);
            query.find({
                success: function (results) {
                    console.log("Successfully retrieved " + results.length);
                    // Do something with the returned Parse.Object values
                    if (results.length == 0) {
                        console.log("leng == 0");
                        var classUser = Parse.Object.extend("Users");
                        var User = new classUser();
                        User.set("ObjectId", profile.id);
                        User.set("name", user.name.givenName);
                        User.set("email", user.emails[0].value);
                        User.set("token", accessToken);
                        User.save(null, {
                            success: function (user) {
                                // Execute any logic that should take place after the object is saved.
                                console.log("User created with id " + user.id);
                                return done(null, user);
                            },
                            error: function (user, error) {
                                // Execute any logic that should take place if the save fails.
                                // error is a Parse.Error with an error code and message.
                                console.log(error.message);
                                return done(error.message);
                            }
                        });
                    }else if(results.length > 0){
                        console.log(results);
                        return done(null , results);
                    }


                },
                error: function (error) {
                    console.log("Error: " + error.code + " " + error.message);
                        return done(error.message);
                }
            });
        }


    }
));

app.get('/auth/facebook', passport.authenticate('facebook' , {scope: ['email']}));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook',
        { successRedirect: '/',
        failureRedirect: '/fail' }));

app.use('/login' , (req , res)=>{
   if(req.user){
       res.send("helloe");
   }else{
       res.send("Bie");
   }
});

app.use('/fail' , (req , res)=>{res.send("Fail")});
app.use('/callback' , (req , res)=>{res.send("callback")});
app.use('/mashed' , (req , res)=>{res.send("mashed")});

app.use('/save' , (req , res)=>{
    Parse.initialize("ucfS6neahiGB0BOd1aAfV7HxQTye5K0U4r40N1O3" , "4igpUls0v3KRQI2o4dhNx8uTWUduMcyUuxQqsYSH");
    Parse.serverURL = 'https://parseapi.back4app.com/';
    var classUser = Parse.Object.extend("Test");
    var User = new classUser();
    User.set("Drupal","my gand");
    User.save(null, {
        success: function (user) {
            // Execute any logic that should take place after the object is saved.
            console.log("User created with id " + user);
            res.send("saved");
        },
        error: function (user, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            console.log(error.id + " " + error.message);
            res.send(error.message);
        }
    });

});

app.use('/' , express.static(__dirname + "/public"));

app.use('/',(req, res)=> {

    res.sendFile(__dirname + "/public/html/index.html");
});


app.listen(port , ()=>{
    console.log("magic happens at 3333");
});