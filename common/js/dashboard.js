let feedContents = $("#feedContents");

$(document).ready(function() {

    feedUpdate();

    $("section#feed nav.category button").click(function(){
        feedContents.removeClass("tumblr");

        $("nav.category li.active").removeClass("active");
        $(this).parent().addClass("active");

        $("button[aria-pressed]").attr("aria-pressed",false);
        $(this).attr("aria-pressed",true);

        feedContents.empty();
        $("#feedContents article").fadeOut(300);

        if($(this).parent().data("id") == "medium") {
            feedUpdate();
            $("section#feed ul.linkTo li").hide(0);
            $("section#feed ul.linkTo li.medium").show(0);
        } else {
            feedUpdate("tumblr");
            $("section#feed ul.linkTo li").hide(0);
            $("section#feed ul.linkTo li.tumblr").show(0);
        }
    });

    $.instagramFeed({
        'username': 'dongri.photo',
        'container': "#galleryContents",
        'items': 9,
        'display_profile': false,
        'display_biography': false,
        'display_gallery': true,
        'get_raw_json': false,
        'callback': null,
        'styling': false
    });

});

function feedUpdate(option) {
    const medium = "https://medium.com/feed/guleum";
    const tumblr = "http://fetchrss.com/rss/5cb715b88a93f8ae498b45685cb715988a93f8f5488b4567.xml";
    var url;

    if(option) { url = tumblr; feedContents.addClass("tumblr"); }
    else url = medium;

    feedContents.addClass("loading").rss(url, {
        limit: 6,
        ssl: true,
        dateFormat: 'ddd, D MMM YYYY HH:mm:ss Z',
        entryTemplate: '<article><a href="{url}" target="_blank"><figure>{teaserImage}</figure></a><h3><a href="{url}" target="_blank">{title}</a></h3><time>{date}</time><p>{shortBodyPlain}…</p><a class="readMore" href="{url}" target="_blank">READMORE →</a></article>'
    }, function() {

        feedContents.removeClass("loading");
        $("#feedContents article:nth-child(1)").addClass("firstExtend");
        $("#feedContents article:nth-child(2)").addClass("lastExtend");
        $("#feedContents article:nth-child(3)").addClass("normal01");
        $("#feedContents article:nth-child(4)").addClass("normal02");
        if(option) $("#feedContents article:nth-child(5)").addClass("tumblrExtend");
        else $("#feedContents article:nth-child(5)").addClass("normal03");
        $("#feedContents article:nth-child(6)").addClass("normal04");


        $(option)
        {
            $("#feedContents article p").text(function (i, text) {
                return text.replace("(Feed generated with FetchRSS)", "");
            });
        }

        $("#feedContents article").fadeIn(300);
    });
}