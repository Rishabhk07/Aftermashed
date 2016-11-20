/**
 * Created by rishabhkhanna on 14/11/16.
 */
const express = require('express');
const route = express.Router();
const Parse = require(' Parse/node');

let thisEvent = Parse.Object.event("Events");

route.use('/like' , (req , res)=>{
let userId = req.body.id;
let objectId = req.body.objectId;
var query = new Parse.Query();
query.get(objectId , {
    success:(event)=>{
        event.increment("likes");
    },
    error : (object , error)=>{

    }
})

});

route.use('/dislike' , (req , res)=>{
    let userId = req.body.id;
    let objectId = req.body.objectId;

    let objectId = req.body.objectId;
    var query = new Parse.Query();
    query.get(objectId , {
        success:(event)=>{
            event.increment("dislikes");
        },
        error : (object , error)=>{

        }
    })
});

route.use('/change' , (req , res)=>{

});

