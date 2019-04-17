/* CLOSE BUTTON */
$("#projectCover button.close").click(function() { nowState = 0; coverClose(); });
$("#iframeView button.close").click(function() { nowState = 1; projectClose(); });


/* Background Click Close */
$("#projectCover").click(function(e) {
    if (e.target == this) {
        nowState = 0; coverClose();
    }
});

/* ESC KEY EVEMT */
$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        nowState = 1;
        projectClose();
    }
});

/* PROJECT VIEW */
$("div#projectCover a.projectView").click(function() {
    nowState = 2;
    var url = $(this).attr("href");
    $("#iframeView iframe").attr("src", url);
    $("#iframeView").show(0).addClass("bounceInUp");
    setTimeout(function(){
        $("#iframeView").removeClass("bounceInUp");
    }, 2000);

    return false;
});
