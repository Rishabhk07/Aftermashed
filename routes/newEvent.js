/**
 * Created by rishabhkhanna on 14/11/16.
 */
const express = require('express');
const route = express.Router();
const Parse = require('parse/node');
const Model = require('../Model/EventModel');

route.use('/' , (req , res )=>{
    res.send("Make a New Event Here");
});

route.use('/save'  ,(req , res)=>{
    let name = req.body.name;
    let likes = 0;
    let dislikes = 0;
    let desc = req.body.desc;
    let fb = req.body.fb;
    let type = req.body.type;
    let date = req.body.date;
    let days = req.body.days;
    var Event = Parse.Object.extend("Events");
    var thisEvent = new Event();
    thisEvent.set("Name" , name);
    thisEvent.set("likes" , 0);
    thisEvent.set("dislikes" , 0);
    thisEvent.set("description" , desc);
    thisEvent.set("fb_url" , fb);
    thisEvent.set("days" , days);
    thisEvent.set("Date" , date);
    thisEvent.set("category" , type);

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
