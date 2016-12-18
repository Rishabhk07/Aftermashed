/**
 * Created by rishabhkhanna on 15/11/16.
 */



login_check = function(){
  $.post('/login' , {} , function (ans) {
      console.log(ans);
  })
};

var add_data = function (object) {


    if(object.objectId == undefined) {
            // $('.set-width').html("yay , You have voted for all the events");
            // console.log("undefined called");
        $('.mdl-card__title-text').html("No More evets");
        $('.mdl-card__supporting-text').html("Congrulations You have voted fo all the current evets in college see you soon after some more events ");
    }else{
        $('.mdl-card__title-text').html(object.Name);
        $('.event-img').prop("src", object.ImageUrl);
        $('.mdl-card__supporting-text').html(object.description);
        $('#url').prop("href", object.fb_url);
        card.data('id' , object.objectId);
        card.show(1000);
    }

};

var snackbar = function(value){
    var notification = document.querySelector('.mdl-js-snackbar');
    if(value == 1){
        msg = "Liked";
    }else{
        msg = "Dislike"
    }
    var data = {
        message: "you have " + msg + " this event",
    };
    notification.MaterialSnackbar.showSnackbar(data);
};

var like = $('.like');
var dislike = $('.dislike');
var card = $('.card');

$(function () {

    login_check();

    like = $('.like');
    dislike = $('.dislike');
    card = $('.card');


    like.click(function () {
        like.prop("disabled" , true);
        snackbar(1);
        card.hide(1000);
        $.post('/vote' , {
          vote : 1,
            objectId: card.data('id')

        }, function (object) {
            console.log(object);
            like.prop("disabled" , false);
            card.data('id' , object.objectId);
            console.log(object.objectId);
            add_data(object);


        })
    });

    dislike.click(function () {
        dislike.prop("disabled" , true);
        card.hide(1000);
        snackbar(0);
        $.post('/vote' , {
            vote : 0,
            objectId: card.data('id')
        }, function (object) {
            console.log(object);
            dislike.prop("disabled" , false);
            console.log(object.objectId);
            add_data(object);

        })
    })

});



