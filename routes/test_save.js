/**
 * Created by rishabhkhanna on 21/11/16.
 */
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