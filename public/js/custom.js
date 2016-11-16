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

    $('.mash').click(function () {
        console.log("Hello");
        $('.disappear').hide(50);
    })

});



