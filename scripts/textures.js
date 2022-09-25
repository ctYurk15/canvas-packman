function createImage(src)
{
    const image = new Image();
    image.src = src;

    return image;
}

const texturer = new Texturer(
    [
        './img/powerups/powerup1.png',
        './img/powerups/powerup2.png',
        './img/powerups/powerup3.png',
    ],
    [
        './img/ghosts/ghost1.png',
        './img/ghosts/ghost2.png',
        './img/ghosts/ghost3.png',
    ]
);

const scared_ghost_texture = createImage('./img/ghosts/ghost-scared.png');