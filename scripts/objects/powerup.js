class PowerUp
{
    constructor({position, texture})
    {
        this.position = position;
        this.texture = texture;
        this.radius = 8;
    }

    draw()
    {
        c.drawImage(this.texture, this.position.x-this.radius*2, this.position.y-this.radius*2);
    }
}