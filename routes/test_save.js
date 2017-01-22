/**
 * Created by rishabhkhanna on 21/11/16.
 */
app.use('/save' , (req , res)=>{
    Parse.initialize("aftermash");
    Parse.serverURL = 'http://aftermashed.com:1337/parse';
    var classUser = Parse.Object.extend("Test");
    var User = new classUser();
    User.set("Ass","my gand");
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