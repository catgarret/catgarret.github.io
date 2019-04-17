/**
 * Created by IntelliJ IDEA.
 *
 * User: phil
 * Date: 15/11/12
 * Time: 11:04 AM
 *
 */
!function(e){var n,o,i,t=!1,r=0,l=0,u=0,a=null,m=0,s=function(){t&&(requestAnimFrame(s),(m<-.1||m>.1)&&((r+=m)>0?r=m=0:r<o&&(m=0,r=o),n.scrollTop(-r),m*=.95,a&&a()))},w=function(e){e.preventDefault();var o=e.originalEvent,t=o.detail?-1*o.detail:o.wheelDelta/40,a=t<0?-1:1;a!=i&&(m=0,i=a),r=-n.scrollTop(),m+=1*((l+=t)-u),u=l};window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)};var d,c;d=[],c=null;e.fn.smoothWheel=function(){var i=jQuery.extend({},arguments[0]);return this.each(function(m,d){"ontouchstart"in window||((n=e(this)).bind("mousewheel",w),n.bind("DOMMouseScroll",w),l=u=n.get(0).scrollTop,r=-l,o=n.get(0).clientHeight-n.get(0).scrollHeight,i.onRender&&(a=i.onRender),i.remove?(log("122","smoothWheel","remove",""),t=!1,n.unbind("mousewheel",w),n.unbind("DOMMouseScroll",w)):t||(t=!0,s()))})}}(jQuery);