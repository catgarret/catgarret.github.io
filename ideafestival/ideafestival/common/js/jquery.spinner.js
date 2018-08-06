/**
 * StyleFix 1.0.3 & PrefixFree 1.0.7
 * @author Lea Verou
 * MIT license
 */
!function e(t,r,n){function i(o,s){if(!r[o]){if(!t[o]){var f="function"==typeof require&&require;if(!s&&f)return f(o,!0);if(a)return a(o,!0);var l=new Error("Cannot find module '"+o+"'");throw l.code="MODULE_NOT_FOUND",l}var u=r[o]={exports:{}};t[o][0].call(u.exports,function(e){var r=t[o][1][e];return i(r||e)},u,u.exports,e,t,r,n)}return r[o].exports}for(var a="function"==typeof require&&require,o=0;o<n.length;o++)i(n[o]);return i}({1:[function(e,t,r){!function(){function e(e,t){return[].slice.call((t||document).querySelectorAll(e))}if(window.addEventListener){var t=window.StyleFix={link:function(e){try{if("stylesheet"!==e.rel||e.hasAttribute("data-noprefix"))return}catch(e){return}var r,n=e.href||e.getAttribute("data-href"),i=n.replace(/[^\/]+$/,""),a=(/^[a-z]{3,10}:/.exec(i)||[""])[0],o=(/^[a-z]{3,10}:\/\/[^\/]+/.exec(i)||[""])[0],s=/^([^?]*)\??/.exec(n)[1],f=e.parentNode,l=new XMLHttpRequest;l.onreadystatechange=function(){4===l.readyState&&r()},r=function(){var r=l.responseText;if(r&&e.parentNode&&(!l.status||l.status<400||l.status>600)){if(r=t.fix(r,!0,e),i){r=r.replace(/url\(\s*?((?:"|')?)(.+?)\1\s*?\)/gi,function(e,t,r){return/^([a-z]{3,10}:|#)/i.test(r)?e:/^\/\//.test(r)?'url("'+a+r+'")':/^\//.test(r)?'url("'+o+r+'")':/^\?/.test(r)?'url("'+s+r+'")':'url("'+i+r+'")'});var n=i.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,"\\$1");r=r.replace(RegExp("\\b(behavior:\\s*?url\\('?\"?)"+n,"gi"),"$1")}var u=document.createElement("style");u.textContent=r,u.media=e.media,u.disabled=e.disabled,u.setAttribute("data-href",e.getAttribute("href")),f.insertBefore(u,e),f.removeChild(e),u.media=e.media}};try{l.open("GET",n),l.send(null)}catch(e){"undefined"!=typeof XDomainRequest&&((l=new XDomainRequest).onerror=l.onprogress=function(){},l.onload=r,l.open("GET",n),l.send(null))}e.setAttribute("data-inprogress","")},styleElement:function(e){if(!e.hasAttribute("data-noprefix")){var r=e.disabled;e.textContent=t.fix(e.textContent,!0,e),e.disabled=r}},styleAttribute:function(e){var r=e.getAttribute("style");r=t.fix(r,!1,e),e.setAttribute("style",r)},process:function(){e('link[rel="stylesheet"]:not([data-inprogress])').forEach(StyleFix.link),e("style").forEach(StyleFix.styleElement),e("[style]").forEach(StyleFix.styleAttribute)},register:function(e,r){(t.fixers=t.fixers||[]).splice(void 0===r?t.fixers.length:r,0,e)},fix:function(e,r,n){for(var i=0;i<t.fixers.length;i++)e=t.fixers[i](e,r,n)||e;return e},camelCase:function(e){return e.replace(/-([a-z])/g,function(e,t){return t.toUpperCase()}).replace("-","")},deCamelCase:function(e){return e.replace(/[A-Z]/g,function(e){return"-"+e.toLowerCase()})}};setTimeout(function(){e('link[rel="stylesheet"]').forEach(StyleFix.link)},10),document.addEventListener("DOMContentLoaded",StyleFix.process,!1)}}(),function(e){function t(e,t,n,i,a){if((e=r[e]).length){var o=RegExp(t+"("+e.join("|")+")"+n,"gi");a=a.replace(o,i)}return a}if(window.StyleFix&&window.getComputedStyle){var r=window.PrefixFree={prefixCSS:function(e,n,i){var a=r.prefix;if(r.functions.indexOf("linear-gradient")>-1&&(e=e.replace(/(\s|:|,)(repeating-)?linear-gradient\(\s*(-?\d*\.?\d*)deg/gi,function(e,t,r,n){return t+(r||"")+"linear-gradient("+(90-n)+"deg"})),e=t("functions","(\\s|:|,)","\\s*\\(","$1"+a+"$2(",e),e=t("keywords","(\\s|:)","(\\s|;|\\}|$)","$1"+a+"$2$3",e),e=t("properties","(^|\\{|\\s|;)","\\s*:","$1"+a+"$2:",e),r.properties.length){var o=RegExp("\\b("+r.properties.join("|")+")(?!:)","gi");e=t("valueProperties","\\b",":(.+?);",function(e){return e.replace(o,a+"$1")},e)}return n&&(e=t("selectors","","\\b",r.prefixSelector,e),e=t("atrules","@","\\b","@"+a+"$1",e)),e=(e=e.replace(RegExp("-"+a,"g"),"-")).replace(/-\*-(?=[a-z]+)/gi,r.prefix)},property:function(e){return(r.properties.indexOf(e)>=0?r.prefix:"")+e},value:function(e,n){return e=t("functions","(^|\\s|,)","\\s*\\(","$1"+r.prefix+"$2(",e),e=t("keywords","(^|\\s)","(\\s|$)","$1"+r.prefix+"$2$3",e),r.valueProperties.indexOf(n)>=0&&(e=t("properties","(^|\\s|,)","($|\\s|,)","$1"+r.prefix+"$2$3",e)),e},prefixSelector:function(e){return e.replace(/^:{1,2}/,function(e){return e+r.prefix})},prefixProperty:function(e,t){var n=r.prefix+e;return t?StyleFix.camelCase(n):n}};!function(){var e={},t=[],n=getComputedStyle(document.documentElement,null),i=document.createElement("div").style,a=function(r){if("-"===r.charAt(0)){t.push(r);var n=r.split("-"),i=n[1];for(e[i]=++e[i]||1;n.length>3;){n.pop();var a=n.join("-");o(a)&&-1===t.indexOf(a)&&t.push(a)}}},o=function(e){return StyleFix.camelCase(e)in i};if(n.length>0)for(var s=0;s<n.length;s++)a(n[s]);else for(var f in n)a(StyleFix.deCamelCase(f));var l={uses:0};for(var u in e){var d=e[u];l.uses<d&&(l={prefix:u,uses:d})}r.prefix="-"+l.prefix+"-",r.Prefix=StyleFix.camelCase(r.prefix),r.properties=[];for(s=0;s<t.length;s++){if(0===(f=t[s]).indexOf(r.prefix)){var c=f.slice(r.prefix.length);o(c)||r.properties.push(c)}}"Ms"==r.Prefix&&!("transform"in i)&&!("MsTransform"in i)&&"msTransform"in i&&r.properties.push("transform","transform-origin"),r.properties.sort()}(),function(){function e(e,t){return i[t]="",i[t]=e,!!i[t]}var t={"linear-gradient":{property:"backgroundImage",params:"red, teal"},calc:{property:"width",params:"1px + 5%"},element:{property:"backgroundImage",params:"#foo"},"cross-fade":{property:"backgroundImage",params:"url(a.png), url(b.png), 50%"}};t["repeating-linear-gradient"]=t["repeating-radial-gradient"]=t["radial-gradient"]=t["linear-gradient"];var n={initial:"color","zoom-in":"cursor","zoom-out":"cursor",box:"display",flexbox:"display","inline-flexbox":"display",flex:"display","inline-flex":"display",grid:"display","inline-grid":"display","min-content":"width"};r.functions=[],r.keywords=[];var i=document.createElement("div").style;for(var a in t){var o=t[a],s=o.property,f=a+"("+o.params+")";!e(f,s)&&e(r.prefix+f,s)&&r.functions.push(a)}for(var l in n){!e(l,s=n[l])&&e(r.prefix+l,s)&&r.keywords.push(l)}}(),function(){function t(e){return a.textContent=e+"{}",!!a.sheet.cssRules.length}var n={":read-only":null,":read-write":null,":any-link":null,"::selection":null},i={keyframes:"name",viewport:null,document:'regexp(".")'};r.selectors=[],r.atrules=[];var a=e.appendChild(document.createElement("style"));for(var o in n){!t(f=o+(n[o]?"("+n[o]+")":""))&&t(r.prefixSelector(f))&&r.selectors.push(o)}for(var s in i){var f;!t("@"+(f=s+" "+(i[s]||"")))&&t("@"+r.prefix+f)&&r.atrules.push(s)}e.removeChild(a)}(),r.valueProperties=["transition","transition-property"],e.className+=" "+r.prefix,StyleFix.register(r.prefixCSS)}}(document.documentElement),function(){var e=!1,t="animation",r=prefix="",n=["Webkit","Moz","O","ms","Khtml"];$(window).load(function(){var i=document.body.style;if(void 0!==i.animationName&&(e=!0),!1===e)for(var a=0;a<n.length;a++)if(void 0!==i[n[a]+"AnimationName"]){prefix=n[a],t=prefix+"Animation",r="-"+prefix.toLowerCase()+"-",e=!0;break}});var i=function(e){return $("<style>").attr({class:"keyframe-style",id:e,type:"text/css"}).appendTo("head")};$.keyframe={getVendorPrefix:function(){return r},isSupported:function(){return e},generate:function(e){var n=e.name||"",a="@"+r+"keyframes "+n+" {";for(var o in e)if("name"!==o){a+=o+" {";for(var s in e[o])a+=s+":"+e[o][s]+";";a+="}"}a=PrefixFree.prefixCSS(a+"}");var f=$("style#"+e.name);f.length>0?(f.html(a),$("*").filter(function(){this.style[t+"Name"]}).each(function(){var e,t;e=$(this),t=e.data("keyframeOptions"),e.resetKeyframe(function(){e.playKeyframe(t)})})):i(n).append(a)},define:function(e){if(e.length)for(var t=0;t<e.length;t++){var r=e[t];this.generate(r)}else this.generate(e)}};var a="animation-play-state",o="running";$.fn.resetKeyframe=function(e){$(this).css(r+a,o).css(r+"animation","none"),e&&setTimeout(e,1)},$.fn.pauseKeyframe=function(){$(this).css(r+a,"paused")},$.fn.resumeKeyframe=function(){$(this).css(r+a,o)},$.fn.playKeyframe=function(e,t){var n=function(e){return[(e=$.extend({duration:"0s",timingFunction:"ease",delay:"0s",iterationCount:1,direction:"normal",fillMode:"forwards"},e)).name,e.duration,e.timingFunction,e.delay,e.iterationCount,e.direction,e.fillMode].join(" ")},i="";if($.isArray(e)){for(var s=[],f=0;f<e.length;f++)s.push("string"==typeof e[f]?e[f]:n(e[f]));i=s.join(", ")}else i="string"==typeof e?e:n(e);var l=r+"animation",u=["webkit","moz","MS","o",""],d=function(e,t,r){for(var n=0;n<u.length;n++){u[n]||(t=t.toLowerCase());var i=u[n]+t;e.off(i).on(i,r)}};return this.each(function(n,s){var f=$(s).addClass("boostKeyframe").css(r+a,o).css(l,i).data("keyframeOptions",e);t&&(d(f,"AnimationIteration",t),d(f,"AnimationEnd",t))}),this},i("boost-keyframe").append(" .boostKeyframe{"+r+"transform:scale3d(1,1,1);}")}.call(this)},{}],2:[function(e,t,r){(function(t){"use strict";var r=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}();function n(e){return e&&e.__esModule?e:{default:e}}var i=n("undefined"!=typeof window?window.jQuery:void 0!==t?t.jQuery:null),a=(n(e("jquerykeyframes")),function(){function e(t,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e);var n=Date.now();this.options=r,this.$element=(0,i.default)(t),this.realRadius=this.options.radius-this.options.strokeWidth,this.rotateName="spin-rotate-"+n,this.dashName="spin-dash-"+n,this.defineKeyframes(),this.createSvg()}return r(e,[{key:"defineKeyframes",value:function(){var e=8*this.options.radius,t=[1,(4.7*this.realRadius).toFixed(1),(4.7*this.realRadius).toFixed(1)],r=["0",(0-1.75*this.realRadius).toFixed(1),(0-6.23*this.realRadius).toFixed(1)];i.default.keyframe.define([{name:this.rotateName,from:{transform:"rotate(0deg)"},to:{transform:"rotate(360deg)"}},{name:this.dashName,"0%":{"stroke-dasharray":t[0]+","+e,"stroke-dashoffset":r[0]},"50%":{"stroke-dasharray":t[1]+","+e,"stroke-dashoffset":r[1]},"100%":{"stroke-dasharray":t[2]+","+e,"stroke-dashoffset":r[2]}}])}},{key:"createSvg",value:function(){var e=this.options,t=e.radius,r=e.strokeWidth,n=8*this.options.radius;this.$element.append(this.makeSvg("svg",{width:2*t,height:2*t}));var i=this.$element.find("svg");i.append(this.makeSvg("circle",{cx:t,cy:t,r:this.realRadius,fill:"none","stroke-width":r}));var a=i.find("circle").css({"stroke-dasharray":"1,"+n,"stroke-dashoffset":"0","stroke-linecap":"round",stroke:this.options.color});i.playKeyframe(this.rotateName+" "+this.options.duration+"s linear infinite");var o=this.options.duration/4*3;a.playKeyframe(this.dashName+" "+o.toFixed(1)+"s ease-in-out infinite")}},{key:"makeSvg",value:function(e,t){var r=document.createElementNS("http://www.w3.org/2000/svg",e);for(var n in t)r.setAttribute(n,t[n]);return r}}]),e}());function o(e){var t=this;return this.each(function(){var r=(0,i.default)(t),n=i.default.extend({},a.DEFAULTS,e);r.data("spinnerHandler")||r.data("spinnerHandler",new a(t,n))})}a.VERSION="0.0.1",a.DEFAULTS={radius:25,strokeWidth:5,duration:2,color:"#3f88f8"},i.default.fn.spinner=o,i.default.fn.spinner.Constructor=a,(0,i.default)(window).on("load",function(){(0,i.default)("[data-spinner]").each(function(){var e=(0,i.default)(this),t=e.data("spinner");console.log(t),e.data("spinnerHandler")||o.call(e,t,this)})})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{jquerykeyframes:1}]},{},[2]);
