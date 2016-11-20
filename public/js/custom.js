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
    });

    $('#datepicker').focus(function () {

        $('.date-label').hide(1)
    });

    $('#datepicker').datepicker();

});



