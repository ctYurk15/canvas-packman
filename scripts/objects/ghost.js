class Ghost
{
    static speed = 1.5;
    constructor({position, velocity, color = 'red'})
    {
        this.position = position;
        this.velocity = velocity;
        this.color = color;
        this.radius = 15;
        this.speed = 1.5;
        this.scared = false;
        this.prevCollisions = [];
    }

    draw()
    {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.scared ? 'blue' : this.color;
        c.fill();
        c.closePath();
    }

    update()
    {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}