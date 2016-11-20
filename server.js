/**
 * Created by rishabhkhanna on 14/11/16.
 */
const express = require('express');
const app = express();
const Parse = require('Parse/node');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const  expressSession = require('express-session');


var port = process.env.PORT || 3333;

var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;

    //
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser());
app.use(expressSession({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine' , 'hbs');


// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    Parse.initialize("ucfS6neahiGB0BOd1aAfV7HxQTye5K0U4r40N1O3" , "4igpUls0v3KRQI2o4dhNx8uTWUduMcyUuxQqsYSH");
    Parse.serverURL = 'https://parseapi.back4app.com/';
    var User = Parse.Object.extend("Users");
    var query = new Parse.Query(User);
        query.equalTo("objectId" , id);
        query.find({
            success: function (results) {
                console.log("Successfully retrieved " + results.length);
                // Do something with the returned Parse.Object values
                    console.log("results is with id : " + (results[0].id));
                    return done(null , results[0]);
                }
        });

});


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
        var User = Parse.Object.extend("Users");
        var query = new Parse.Query(User);
        if(profile.id != null) {

            var user = JSON.parse(JSON.stringify(profile));

            console.log(user);
            query.equalTo("ObjectId" , profile.id);
            query.find({
                success: function (results) {
                    console.log("Successfully retrieved " + results.length);
                    // Do something with the returned Parse.Object values
                    if (results.length == 0) {
                        console.log("leng == 0");
                        var classUser = Parse.Object.extend("Users");
                        var User = new classUser();
                        console.log(profile.id + user.name.givenName + user.emails[0].value + accessToken);
                        User.set("ObjectId", profile.id);
                        User.set("name", user.name.givenName);
                        User.set("email", user.emails[0].value);
                        User.set("token", accessToken);
                        User.save(null, {
                            success: function (user ) {
                                // Execute any logic that should take place after the object is saved.
                                console.log("User created with id " + user.id);
                                return done(null, user);
                            },
                            error: function (user, error) {
                                // Execute any logic that should take place if the save fails.
                                // error is a Parse.Error with an error code and message.
                                console.log("saving error" + Parse.Error);
                                return done(error.message);
                            }
                        });
                    }else if(results.length > 0){
                        console.log(results);
                        return done(null , results[0]);
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
        {   successRedirect: '/mashed',
            failureRedirect: '/fail'
        })
);





app.use('/login' , (req , res)=>{
   // console.log(req.user.access_token);
   if(req.isAuthenticated()){
        res.send(req.user);
   }else{
       res.send("Bie");
   }
});

const isLogin = (req , res , next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/');
    }
};
app.use('/fail' , (req , res)=>{res.send("Fail")});

app.use('/mashed',  isLogin ,(req , res)=>{
    res.render('mashed');
});



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

app.use('/newevent' , (req , res)=>{
   res.render('createEvent');
});

app.use('/',(req, res)=> {
    res.sendFile(__dirname + "/public/html/index.html");
});


app.listen(port , ()=>{
    console.log("magic happens at 3333");
});