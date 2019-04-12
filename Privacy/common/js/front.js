$(document).ready(function() {
    IntroMovie();
    FrontCardAnimation();
});

/* CARD FLIP ANIMATION */
function FrontCardAnimation() {
    var i = 1;
    setInterval(function() {
        var target = $("div.animation span:nth-of-type(" + i + ")");
        target.show(0).delay(400).hide(0);
        i++;
        if(i>=8) { i=0; }

    }, 400);
}

/* Referrer Check */
function ReferrerCheck() {
    var initreferrer = document.referrer;
    if(initreferrer.indexOf("dongri.me") === -1 ) return false;
    else true;
}

/* Into movie */
function IntroMovie() {
    var referrer = ReferrerCheck();
    if(referrer) {
        $("#introMovie").hide(0);
        $("#wrap").show(0);
    } else {
        /* Into movie */
        $("#introMovie video").on('ended',function(){
            $("#introMovie").hide(0);
            $("#wrap").fadeIn(300);
        });
    }
}
