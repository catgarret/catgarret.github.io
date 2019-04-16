var nowState = 0; // 1: cover , 2: project view
var projectId;

$(document).ready(function() {

    /* LOAD LIST */
    $("nav#list").load("./craft/craft_list.html", function() {

        /* LIST GET NUM */
        var craftsNum = $("#list ul li").length;
        
    });

    $("div.documentTitle h3 span.num").animate({
        Counter: craftsNum
    }, {
        duration: 800,
        easing: 'swing',
        step: function (now) {
            $(this).text(Math.ceil(now));
        }
    });

    /* LIST CATEGORY */
    $("nav.category button").click(function(){
        $("nav.category li.active").removeClass("active");
        $(this).parent().addClass("active");

        $("button[aria-pressed]").attr("aria-pressed",false);
        $(this).attr("aria-pressed",true);

    });

    $("#list").mixItUp({
        selectors: {
            target: '.item'
        },
        animation: {
            enable: false
        },
        callbacks: {
            onMixLoad: function(state){
                scrollBarMake();
            },
            onMixEnd: function(state){
                $('.mCSB_container').css('width', $('.mCSB_container ul').outerWidth());
            }
        }
    });

    /* SCROLL BTN */
    $(".scrollBtn .left").click(function() {
        $("#list").mCustomScrollbar("scrollTo","+=1700");
    });

    $(".scrollBtn .right").click(function() {
        $("#list").mCustomScrollbar("scrollTo","-=1700");
    });


    /* Fade Effect */
    ScrollReveal().reveal("#list, ul.scrollBtn", { origin: 'right', distance: '200px', duration: 750, opacity: 0, delay: 500 });


    /* List Hover */
    $("nav#list a").hover(
        function () {
            /* Get ID */
            projectId = $(this).parent().data("id");

            /* Hover Title Scramble Effect*/
            $(this).find("span:nth-child(1)").scramble();
            $(this).find("span:nth-child(2)").scramble();

            /* BACKGROUND Change */
            var backgroundURl = projectId + "_background.jpg";
            $("html").css("background-image", "url('./common/images/craft/" + backgroundURl + "')");
    },

        function () {
            $("html").css("background-image", "none");
        }
    );

    /* List Click */
    $("nav#list a").click(function() {
        nowState = 1;

        /* Get ID */
        projectId = $(this).parent().data("id");
        var url = "./craft/" + projectId + ".html"
        var backgroundURl = projectId + "_background.jpg";

        $("#projectCover").load(url, function() {
            $("body").css("overflow-y","hidden");

            $("div.backdrop").fadeIn(200);
            $("div.backdrop").css("display","flex");

            setTimeout(function(){
                $("html").css("background-image", "url('./common/images/craft/" + backgroundURl + "')");
            }, 120);
        });

        return false;
    });

    $("div.backdrop a.projectView").click(function() {
        var url = $(this).attr("href");
        $("#iframeView iframe").attr("src", url);
        $("#iframeView").show(0).addClass("bounceInUp");
        nowState = 2;
        setTimeout(function(){
            $("#iframeView").removeClass("bounceInUp");
        }, 2000);

        return false;
    });

    /* CLOSE BUTTON */
    $("div.backdrop button.close").click(function() { coverClose(); });
    $("#iframeView button.close").click(function() { projectClose(); });

});

/* ESC KEY EVEMT */
$(document).keyup(function(e) {
    if (e.keyCode == 27) { // escape key maps to keycode `27`
        if(nowState == 1) { coverClose(); }
        if(nowState == 2) { projectClose(); }
    }
});

function coverClose() {
    $("div.backdrop").fadeOut(200);
    $("html").css("background-image", "none");
    $("div.backdrop section.contentWrap").empty();
    $("body").css("overflow-y","auto");
    nowState = 0;
}

function projectClose() {
    $("#iframeView").addClass("bounceOutDown");
    nowState = 1;
    setTimeout(function(){
        $("#iframeView").hide(0).removeClass("bounceOutDown");
        $("#iframeView iframe").attr("src", "about:blank");
    }, 2000);
}

/* LIST SCROLL */
function scrollBarMake() {
    $("#list").mCustomScrollbar({
        axis: "x",
        theme: "dark-thin",
        autoExpandScrollbar: !0,
        moveDragger: true,
        advanced: {
            autoExpandHorizontalScroll: true,
            updateOnContentResize: true
        },
        mouseWheel: {
            enable: false,
            scrollAmount: 600
        },
        callbacks: {
            onUpdate: function () {
                $("#list").mCustomScrollbar('scrollTo', '0', {
                    scrollInertia: 0
                });
            }
        }
    });
}

