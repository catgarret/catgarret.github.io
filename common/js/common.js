$(document).ready(function() {

    /* Mobile Check */
    var UserAgent=navigator.userAgent;null==UserAgent.match(/iPhone|iPod|iPad|iPad2|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i)&&null==UserAgent.match(/LG|SAMSUNG|Samsung/)||(top.location.href="https://dongri.me/m/");

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

    /* anchor scroll smooth */
    $("a").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 400, function(){
                window.location.hash = hash;
            });
        }
    });

});

/* POPUP WINDOW */
function popupWindow(url, width, height) {
    var center_left = (screen.width / 2) - (width / 2);
    var center_top = (screen.height / 2) - (height / 2);
    window.open(url, "popup", "scrollbars=1, width="+width+", height="+height+", left="+center_left+", top="+center_top);
}