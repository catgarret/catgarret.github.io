let feedContents=$("#feedContents");function feedUpdate(e){var t;e?(t="http://fetchrss.com/rss/5cb715b88a93f8ae498b45685cb715988a93f8f5488b4567.xml",feedContents.addClass("tumblr")):t="https://medium.com/feed/guleum",feedContents.addClass("loading").rss(t,{limit:6,ssl:!0,dateFormat:"ddd, D MMM YYYY HH:mm:ss Z",entryTemplate:'<article><a href="{url}" target="_blank"><figure>{teaserImage}</figure></a><h3><a href="{url}" target="_blank">{title}</a></h3><time>{date}</time><p>{shortBodyPlain}…</p><a class="readMore" href="{url}" target="_blank">READMORE →</a></article>'},function(){feedContents.removeClass("loading"),$("#feedContents article:nth-child(1)").addClass("firstExtend"),$("#feedContents article:nth-child(2)").addClass("lastExtend"),$("#feedContents article:nth-child(3)").addClass("normal01"),$("#feedContents article:nth-child(4)").addClass("normal02"),e?$("#feedContents article:nth-child(5)").addClass("tumblrExtend"):$("#feedContents article:nth-child(5)").addClass("normal03"),$("#feedContents article:nth-child(6)").addClass("normal04"),$(e),$("#feedContents article p").text(function(e,t){return t.replace("(Feed generated with FetchRSS)","")}),$("#feedContents article").fadeIn(300)})}$(document).ready(function(){feedUpdate(),$("section#feed nav.category button").click(function(){feedContents.removeClass("tumblr"),$("nav.category li.active").removeClass("active"),$(this).parent().addClass("active"),$("button[aria-pressed]").attr("aria-pressed",!1),$(this).attr("aria-pressed",!0),feedContents.empty(),$("#feedContents article").fadeOut(300),"medium"==$(this).parent().data("id")?(feedUpdate(),$("section#feed ul.linkTo li").hide(0),$("section#feed ul.linkTo li.medium").show(0)):(feedUpdate("tumblr"),$("section#feed ul.linkTo li").hide(0),$("section#feed ul.linkTo li.tumblr").show(0))}),$.instagramFeed({username:"dongri.photo",container:"#galleryContents",items:9,display_profile:!1,display_biography:!1,display_gallery:!0,get_raw_json:!1,callback:null,styling:!1})});