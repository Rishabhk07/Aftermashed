/**
 * Created by rishabhkhanna on 14/11/16.
 */
const express = require('express');
const app = express();
const Parse = require('Parse/node');
const path = require('path');



app.use('/',(req, res)=> {
    Parse.initialize("ucfS6neahiGB0BOd1aAfV7HxQTye5K0U4r40N1O3", "4igpUls0v3KRQI2o4dhNx8uTWUduMcyUuxQqsYSH");
    Parse.serverURL = "https://parseapi.back4app.com/";
});


app.listen("3333" , ()=>{
    console.log("magic happens at 3333");
});