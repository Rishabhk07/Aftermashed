/**
 * Created by rishabhkhanna on 14/11/16.
 */
"use strict";

var Event = ((name)=>{
    var Eventname = name || "";
    var likes = 0;
    var dislikes = 0;

    return {
     getEventName : ()=>(Eventname),
     getLikes : ()=>(likes),
     getDislikes : ()=>(dislikes)
    }
});


