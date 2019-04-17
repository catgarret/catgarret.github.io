$(document).ready(function() {

    BackgroundEffect();

    $(window).resize(function() {
        BackgroundEffect();
    });

});

function BackgroundEffect() {
    new Particles(document.getElementById("particles"), {
        // size of the particles
        size: {
            min: 0,
            max: 3
        },

        // density of particles on the canvas
        density: 800,

        // speed of the particules
        speed: 3,

        // number of times per second the canvas is refreshed
        fps: 60,

        // color of the particles
        color: "#dedede"

    });
}

