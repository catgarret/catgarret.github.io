$(window).scroll(function(){

    /* Scroll Animation FadeIn-Out */
    $("p.scrollAni").css("opacity", 1 - $(window).scrollTop() / 60);

    var scrollNow = $(document).scrollTop();
    var nav = $("nav.information");
    var nowActive = $("nav.information li.active");
    var floatingImg = $("div.floatingImg");

    $("#scrollChk").text( "scrollTop:" + scrollNow);


    /* Profile Image */
    if(scrollNow >= 100) {
        floatingImg.addClass("scroll");
    } else {
        floatingImg.removeClass("scroll");
    }

   //if($(window).scrollTop() + $(window).height() == $(document).height()) {
    if(scrollNow >= 4726) {
        floatingImg.fadeOut(300);
    } else {
        floatingImg.show(0);
    }


    /* Profile Information Navigation Sticky */
    if(scrollNow >= 950) {
        nav.addClass("fixed");
    } else {
        nav.removeClass("fixed");
    }

    if(scrollNow >= 950 && scrollNow < 1747 ) {
        nowActive.removeClass("active");
        $("nav.information ul li:nth-child(1)").addClass("active");
    } else if (scrollNow >= 1747 && scrollNow < 2683) {
        nowActive.removeClass("active");
        $("nav.information ul li:nth-child(2)").addClass("active");
    } else if (scrollNow >= 2683 && scrollNow < 3588) {
        nowActive.removeClass("active");
        $("nav.information ul li:nth-child(3)").addClass("active");
    } else if (scrollNow >= 3588) {
        nowActive.removeClass("active");
        $("nav.information ul li:nth-child(4)").addClass("active");
    }

});


$(document).ready(function() {

    /* Information Full Scroll */
    $.smartscroll({
        mode: "vp",
        autoHash: true,
        sectionScroll: true,
        initialScroll: true,
        sectionWrapperSelector: "div.information",
        sectionClass: "section",
        animationSpeed: 300,
        headerHash: "about"
    });

    /* Lazy Fadein */
    ScrollReveal().reveal("h3", { origin: 'bottom', distance: '50px', duration: 750, opacity: 0 });
    ScrollReveal().reveal("table", { origin: 'bottom', distance: '50px', duration: 750, opacity: 0, delay: 300 });
    ScrollReveal().reveal("#lastCover img", { duration: 1000, opacity: 0 });
    ScrollReveal().reveal("#lastCover a", { duration: 750, opacity: 0, delay: 200 });


});
