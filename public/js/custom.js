/**
 * Created by rishabhkhanna on 15/11/16.
 */


var canVote = true;
login_check = function(){
  $.post('/login' , {} , function (ans) {
      if(ans == "Bie"){
          $('#profile-pic').hide();
          $('#dp').hide();
          $('.logout').hide();
      }else {
          $('#profile-pic').attr("src", 'https://graph.facebook.com/' + ans.ObjectId + '/picture?height=250&width=250');
          $('#dp').attr("src", 'https://graph.facebook.com/' + ans.ObjectId + '/picture?height=250&width=250');
          $('.logout').show();
      }
  })

};

var add_data = function (object) {


    if(object.objectId == undefined) {
        $('.mdl-card__title-text').html("Sorry No Events Left ");
        $('.event-img').hide();
        $('.mdl-card__supporting-text').html("Yay you have voted for all our current events, come back soon for more events till then view events ratings in View Ratings Tab, you can also suggest events to add at aftermashed@gmail.com");
        $('#url').hide();
        card.data('id' , "");
        card.show(100);
        canVote = false;
        // $('.mdl-card__title-text').html("No More evets");
        // $('.mdl-card__supporting-text').html("Congrulations You have voted fo all the current evets in college see you soon after some more events ");
    }else{
        $('.mdl-card__title-text').html(object.Name);
        $('.event-img').prop("src", object.ImageUrl);
        $('.mdl-card__supporting-text').html(object.description);
        $('#url').prop("href", object.fb_url);
        card.data('id' , object.objectId);
        card.show(100);
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
    var startMash = $('.start-mash');
    var facebook = $('.facebook');

    facebook.hide();


    like.click(function () {
        if(canVote == true){
            like.prop("disabled" , true);
            snackbar(1);
            card.hide(100);
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
        }
    });

    dislike.click(function () {
        if(canVote == true) {
            dislike.prop("disabled", true);
            card.hide(100);
            snackbar(0);
            $.post('/vote', {
                vote: 0,
                objectId: card.data('id')
            }, function (object) {
                console.log(object);
                dislike.prop("disabled", false);
                console.log(object.objectId);
                add_data(object);

            })
        }
    });

    startMash.click(function () {
        facebook.show(100);
    })



});



