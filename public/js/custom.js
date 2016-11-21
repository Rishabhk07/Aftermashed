/**
 * Created by rishabhkhanna on 15/11/16.
 */

login_check = function(){
  $.post('/login' , {} , function (ans) {
      console.log(ans);
  })
};

$(function () {

    login_check();

    var like = $('.like');
    var dislike = $('.dislike');
    var card = $('.card');


    like.click(function () {
        like.attr("disabled" , "disabled");
        $.post('/vote' , {
          vote : 1,
            objectId: card.data('id')
        }, function (object) {
            console.log(object);
            like.attr(disabled);
            card.data('id' , object.objectId);
            console.log(object.objectId);
        })
    });

    dislike.click(function () {
        dislike.attr("disabled" , "disabled");

        $.post('/vote' , {
            vote : 0,
            objectId: card.data('id')
        }, function (object) {
            console.log(object);
            dislike.removeAttr(disabled);
            console.log(object.objectId);
            card.data('id' , object.objectId);


        })
    })

});



