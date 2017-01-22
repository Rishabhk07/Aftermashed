/**
 * Created by rishabhkhanna on 14/11/16.
 */
const express = require('express');
const route = express.Router();
const Parse = require('parse/node');

route.use('/' , (req , res)=>{

    let userId = req.user.id;
    let vote = req.body.vote;
    let objectId = req.body.objectId;

    console.log("Vote called");
    console.log(userId);
    console.log(vote);
    console.log(objectId);


    var Event = Parse.Object.extend("Events");
    var query = new Parse.Query(Event);
    query.get(objectId , {
        success: function(thisEvent) {
            // The object was retrieved successfully.
            // voting for current event
            console.log(thisEvent);
            if(vote == 1){
                thisEvent.increment('Likes');

            }else if(vote == 0){
                thisEvent.increment('Dislikes');
            }
            thisEvent.save();
            // retriving current user

            var GameScore = Parse.Object.extend("Users");
            var query = new Parse.Query(GameScore);
            query.get(userId, {
                success: function(user) {
                    // The object was retrieved successfully.

                    var relation = user.relation("Events_Voted");
                    relation.add(thisEvent);
                    user.save();


                    relation.query().find({
                        success: function(list) {
                            // list contains the posts that the current user likes.
                            var id = [];
                            // console.log(list[0].id);
                            for(var i = 0 ; i < list.length ; i++){
                                id.push(list[i].id);
                            }
                            id.push(objectId);
                            // console.log(id);

                            var Event = Parse.Object.extend("Events");
                            var query = new Parse.Query(Event);

                                query.notContainedIn("objectId" , id);


                            query.first({
                                success: function(object) {
                                 console.log( "event result : " + JSON.stringify(object));
                                    res.send(object)
                                },
                                error: function(error) {
                                    console.log("Error: " + error.code + " " + error.message);
                                }
                            });
                        }
                    });
                },
                error: function(object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                    console.log("user cant be retrieved");
                }
            });
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.

            console.log("Vote cannot be Counted right now" + error.message);
        }
    });

});



module.exports = route;
