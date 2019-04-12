$(document).ready(function() {

    /* FACEBOOK CHAT POPUP */
    $("header .chat > a").click(function(){
        popupWindow(this.href,700, 650);
        return false;
    });


    /* GNB MORE */
    $("header .more > button").click(function() {
        $(this).attr("aria-expanded", function(i, attr) {
            return attr == 'true' ? 'false' : 'true'
        });

        $(this).toggleClass("ing");
        $("header .more > ul.list").toggleClass("ing");
    });

    /* TOP */
    $("#scrollTop").click( function() {
        $("html, body").animate( { scrollTop : 0 }, 400 );
        return false;
    });

});

/* POPUP WINDOW */
function popupWindow(url, width, height) {
    var center_left = (screen.width / 2) - (width / 2);
    var center_top = (screen.height / 2) - (height / 2);
    window.open(url, "popup", "scrollbars=1, width="+width+", height="+height+", left="+center_left+", top="+center_top);
}