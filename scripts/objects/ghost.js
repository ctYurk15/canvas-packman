class Ghost
{
    static speed = 1.5;
    constructor({position, velocity, texture, scared_texture})
    {
        this.position = position;
        this.velocity = velocity;
        this.texture = texture;
        this.scared_texture = scared_texture;
        this.radius = 15;
        this.speed = 1.5;
        this.scared = false;
        this.prevCollisions = [];
    }

    draw()
    {
        const texture = this.scared ? this.scared_texture : this.texture
        c.drawImage(texture, this.position.x-this.radius, this.position.y-this.radius);
    }

    update()
    {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}