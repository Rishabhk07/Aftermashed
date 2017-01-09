/**
 * Created by rishabhkhanna on 15/11/16.
 */



login_check = function(){
  $.post('/login' , {} , function (ans) {
      console.log(ans);
      console.log(ans.ObjectId);
      $('#profile-pic').attr("src" , 'https://graph.facebook.com/' + ans.ObjectId + '/picture?height=250&width=250' );
      $('#dp').attr("src" , 'https://graph.facebook.com/' + ans.ObjectId + '/picture?height=250&width=250' );
  })

};

var add_data = function (object) {


    if(object.objectId == undefined) {
        $('.mdl-card__title-text').html("Sorry No Events Left ");
        $('.event-img').hide();
        $('.mdl-card__supporting-text').html("Yay you have voted for all our current events, come back soon for more events till then view events ratings in View Ratings Tab");
        $('#url').hide();
        card.data('id' , "");
        card.show(100);
        // $('.mdl-card__title-text').html("No More evets");
        // $('.mdl-card__supporting-text').html("Congrulations You have voted fo all the current evets in college see you soon after some more events ");
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



