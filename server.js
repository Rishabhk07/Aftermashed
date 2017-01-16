/**
 * Created by rishabhkhanna on 14/11/16.
 */
const express = require('express');
const app = express();
const Parse = require('parse/node');
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    console.log("user id in serializer is " + user.id);
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
       callbackURL: "/auth/facebook/callback",
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified' , 'picture.type(large)'],
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



app.get('/auth/facebook', passport.authenticate('facebook' , {scope: ['email' , 'public_profile']}));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook',
        {   successRedirect: '/mashed',
            failureRedirect: '/fail'
        })
);

const vote = require('./routes/compare');

app.post('/vote' , vote);

app.use('/fail' , (req , res)=>{
   res.send("Error in Loggin in" + error.message)
});

app.use('/login' , (req , res)=>{
   // console.log(req.user.access_token);
   if(req.isAuthenticated()){
       console.log(JSON.stringify(req.user));
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


app.use('/mashed',  isLogin ,(req , res)=>{
    var user = Parse.Object.extend("Users");
    var query = new Parse.Query(user);
    query.get(req.user.id , {
       success:(user)=>{

           var relation = user.relation("Events_Voted");
            // var query = Parse.Query("Events_Voted");
           relation.query().find({
               success: (list)=>{
                   console.log("inside mashed route");
                    console.log(list);
                       // list contains the posts that the current user likes.
                        var id = [];
                        // id.push(Mo8ec0dSwO);


                   if(list.length  > 0 ) {
                       console.log("inside lis[0] find");

                       console.log(list[0].id);
                       for (var i = 0; i < list.length; i++) {
                           id.push(list[i].id);
                           console.log("id pushed: " + id.toString());
                       }
                   }

                       // console.log(id.toString());

                       var Event = Parse.Object.extend("Events");
                       var query = new Parse.Query(Event);
                        console.log("search for events started");
                        query.notContainedIn("objectId", id);

                       query.first({
                           success: function(object) {

                               console.log( "event result : " + JSON.stringify(object));

                               if(object == undefined){
                                    object = {
                                        objectId: "",
                                        Name: "",
                                        ImageUrl: "",
                                        description: "",
                                        fb_url: ""
                                    }
                               }
                                    res.render('mashed', JSON.parse(JSON.stringify(object)) );

                           },
                           error: function(error) {
                               console.log("Error: " + error.code + " " + error.message);


                           }
                       });

               },
               error: (myobject , error)=>{

                 console.log("could not find any list of events left to rate");

               }
           })
       },
        error: (myobject , error)=>{
            console.log("Could Find User in mashed");
        }
    });

});

app.use('/rating', isLogin , (req , res)=>{

    var events = Parse.Object.extend("Events");
    var query = new Parse.Query(events);
    query.find({
        success: function(results) {
            console.log("Successfully retrieved " + results.length);
            // Do something with the returned Parse.Object values
            // console.log(JSON.stringify(JSON.parse(results)));
            console.log("Date of the event is " + (JSON.stringify(results[0])));

            res.render('rating', {allEvents : JSON.parse(JSON.stringify(results))} );
            // res.send(results);
        },
        error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });

});

app.get('/contact' , (req, res)=>{
   res.render('contact');
});

app.get('/about' , (req , res)=>{
    res.render('about');
});
app.use('/newevent' , (req , res)=>{

   res.render('createEvent');
});

app.use('/logout',(req , res)=>{
   req.logout();
    res.redirect('/')
});

app.use('/',(req, res)=> {
    if(req.isAuthenticated()){
        res.redirect('/mashed');
    }else {
        res.sendFile(__dirname + "/public/html/index.html");
    }
});





// app.use((req , res)=>{res.send("Fail")});

app.listen(port , ()=>{
    console.log("magic happens at 3333");
});
