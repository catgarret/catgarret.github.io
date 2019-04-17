var nowState = 0; // 1: cover 2: project view
var projectId;
var craftsNum;
const projectCover = $("div#projectCover");
const craftList = $("#list");

$(document).ready(function() {
    /* LOAD LIST */
    craftList.load("./craft/craft_list.html");

    $(document).ajaxComplete(function(){

        /* LIST ALIGN SET */
        craftList.mixItUp({
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
                    $(".mCSB_container").css("width", $(".mCSB_container ul").outerWidth());
                }
            }
        });

        /* LIST GET NUM */
        craftsNum = $("#list ul li").length;

        $("div.documentTitle h3 span.num").animate({
            Counter: craftsNum
        }, {
            duration: 800,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });

        /* List Hover */
        const listLink = $("nav#list a");
        listLink.hover(
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
        listLink.click(function() {
            nowState = 1;

            /* Get ID */
            projectId = $(this).parent().data("id");

            var url = "./craft/" + projectId + ".html"
            var backgroundURl = projectId + "_background.jpg";


            $("#projectCover section.contentWrap").load(url, function() {
                $("body").css("overflow-y","hidden");

                projectCover.fadeIn(200);
                projectCover.css("display","flex");


                setTimeout(function(){
                    $("html").css("background-image", "url('./common/images/craft/" + backgroundURl + "')");
                }, 120);
            });

            return false;
        });

    });


    /* LIST CATEGORY */
    $("nav.category button").click(function(){
        $("nav.category li.active").removeClass("active");
        $(this).parent().addClass("active");

        $("button[aria-pressed]").attr("aria-pressed",false);
        $(this).attr("aria-pressed",true);

    });


    /* SCROLL BTN */
    $(".scrollBtn .left").click(function() {
        craftList.mCustomScrollbar("scrollTo","+=1700");
    });

    $(".scrollBtn .right").click(function() {
        craftList.mCustomScrollbar("scrollTo","-=1700");
    });


    /* Fade Effect */
    setTimeout(function(){
        $("nav#list, ul.scrollBtn").addClass("load");
    }, 300);

});

/* ESC KEY EVEMT */
$(document).keyup(function(e) {
    if (e.keyCode == 27 && nowState == 1) { // escape key maps to keycode `27`
        coverClose();
        nowState = 0;
    }
});

function coverClose() {
    projectCover.fadeOut(200);
    $("html").css("background-image", "none");
    $("div#projectCover section.contentWrap").empty();
    $("body").css("overflow-y","auto");
}

function projectClose() {
    $("#iframeView").addClass("bounceOutDown");
    setTimeout(function(){
        $("#iframeView").hide(0).removeClass("bounceOutDown");
        $("#iframeView iframe").attr("src", "about:blank");
    }, 2000);
}

/* LIST SCROLL */
function scrollBarMake() {
    craftList.mCustomScrollbar({
        axis: "x",
        theme: "dark-thin",
        autoExpandScrollbar: !0,
        moveDragger: true,
        advanced: {
            autoExpandHorizontalScroll: true,
            updateOnContentResize: true
        },
        mouseWheel: {
            enable: true,
            scrollAmount: 300
        },
        callbacks: {
            onUpdate: function () {
                craftList.mCustomScrollbar('scrollTo', '0', {
                    scrollInertia: 0
                });
            }
        }
    });
}

