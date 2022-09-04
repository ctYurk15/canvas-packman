const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Boundary
{

    static width = 40;
    static height = 40;

    constructor({position})
    {
        this.position = position;
        this.width = 40;
        this.height = 40;
    }

    draw()
    {
        c.fillStyle = 'blue';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Player
{
    constructor({position, velocity})
    {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
    }

    draw()
    {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'yellow';
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

const boundaries = [];
const player = new Player({position: {x: Boundary.width*1.5, y: Boundary.height*1.5}, velocity: {x: 0, y: 0}});

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
};

let last_key = '';

const map = [
    ['-', '-', '-', '-', '-', '-', ],
    ['-', ' ', ' ', ' ', ' ', '-', ],
    ['-', ' ', '-', '-', ' ', '-', ],
    ['-', ' ', ' ', ' ', ' ', '-', ],
    ['-', '-', '-', '-', '-', '-', ],
];

map.forEach(function(row, i){
    row.forEach(function(symbol, j){
        
        switch(symbol)
        {
            case '-':
                boundaries.push(new Boundary({position: {x: Boundary.width * j, y: Boundary.height * i}}))
                break;
        }

    });
});

function animate()
{
    requestAnimationFrame(animate);
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);

    boundaries.forEach(function(boundary){
        boundary.draw();
    });
    player.update();
    player.velocity = {x: 0, y: 0};

    if(keys.w.pressed && last_key == 'w')
    {
        player.velocity.y = -5;
    }
    else if(keys.a.pressed && last_key == 'a')
    {
        player.velocity.x = -5;
    }
    else if(keys.s.pressed && last_key == 's')
    {
        player.velocity.y = 5;
    }
    else if(keys.d.pressed && last_key == 'd')
    {
        player.velocity.x = 5;
    }
}

animate()


window.addEventListener('keydown', function({key}){
    
    switch(key)
    {
        case 'w':
            last_key = 'w';
            keys.w.pressed = true;
            break;
        case 'a':
            last_key = 'a';
            keys.a.pressed = true;
            break;
        case 's':
            last_key = 's';
            keys.s.pressed = true;
            break;
        case 'd':
            last_key = 'd';
            keys.d.pressed = true;
            break;
    }

    console.log(keys);
});

window.addEventListener('keyup', function({key}){
    
    switch(key)
    {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }

    console.log(keys);
});