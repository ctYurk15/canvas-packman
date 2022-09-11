class Player
{
    constructor({position, velocity})
    {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.radians = 0.75;
        this.open_rate = 0.12;
        this.rotation = 0;
    }

    draw()
    {
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.rotation);
        c.translate(-this.position.x, -this.position.y);
        c.beginPath();
        c.arc(
          this.position.x, 
          this.position.y, 
          this.radius, 
          this.radians, 
          Math.PI * 2 - this.radians
        );
        c.lineTo(this.position.x, this.position.y);
        c.fillStyle = 'yellow';
        c.fill();
        c.closePath();
        c.restore();
    }

    update()
    {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.radians <= 0 || this.radians >= 0.75)
        {
          this.open_rate = -this.open_rate;
        }

        this.radians += this.open_rate;
    }
}