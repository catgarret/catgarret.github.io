function BackgroundEffect(){new Particles(document.getElementById("particles"),{size:{min:0,max:3},density:800,speed:3,fps:60,color:"#dedede"})}$(document).ready(function(){BackgroundEffect(),$(window).resize(function(){BackgroundEffect()})});