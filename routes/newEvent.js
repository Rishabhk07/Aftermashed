/**
 * Created by rishabhkhanna on 14/11/16.
 */
const express = require('express');
const route = express.Router();
const Parse = require(' Parse/node');
const Model = require('../Model/EventModel');

route.use('/' , (req , res )=>{
    res.send("Make a New Event Here");
});

route.use('/save'  ,(req , res)=>{
    let name = req.body.name;
    let likes = 0;
    let dislikes = 0;
    var Event = Parse.Object.extend("Events");
    var thisEvent = new Event();
    thisEvent.set("Name" , name);
    thisEvent.set("likes" , 0);
    thisEvent.set("dislikes" , 0);
    thisEvent.save(
        null , {
            success: (event)=>{
                console.log("new Event is saved with id = " + event.id);
            },
            error: ()=>{

            }
        }
    )
});
