const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const scoreEl = document.querySelector("#scoreEl");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Boundary
{

    static width = 40;
    static height = 40;

    constructor({position, image})
    {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image;
    }

    draw()
    {
        c.fillStyle = 'blue';
        //c.fillRect(this.position.x, this.position.y, this.width, this.height);
       // console.log(this.image);
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

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

class Ghost
{
    static speed = 2;
    constructor({position, velocity, color = 'red'})
    {
        this.position = position;
        this.velocity = velocity;
        this.color = color;
        this.radius = 15;
        this.speed = 2;
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

class Pellet
{
    constructor({position})
    {
        this.position = position;
        this.radius = 3;
    }

    draw()
    {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
}

class PowerUp
{
    constructor({position})
    {
        this.position = position;
        this.radius = 8;
    }

    draw()
    {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
}

const pellets = [];
const boundaries = [];
const powerUps = [];
const ghosts = [
  new Ghost({
    position: {x: Boundary.width*6 + Boundary.width/2, y: Boundary.height*1.5},
    velocity: {x: Ghost.speed, y: 0}
  }),
  new Ghost({
    position: {x: Boundary.width*6 + Boundary.width/2, y: Boundary.height*3 + Boundary.height/2},
    velocity: {x: Ghost.speed, y: 0},
    color: 'pink'
  }),
];
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
let score = 0;

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
  ]

function createImage(src)
{
    const image = new Image();
    image.src = src;

    return image;
}

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      switch (symbol) {
        case '-':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeHorizontal.png')
            })
          )
          break
        case '|':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeVertical.png')
            })
          )
          break
        case '1':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner1.png')
            })
          )
          break
        case '2':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner2.png')
            })
          )
          break
        case '3':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner3.png')
            })
          )
          break
        case '4':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/pipeCorner4.png')
            })
          )
          break
        case 'b':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/block.png')
            })
          )
          break
        case '[':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capLeft.png')
            })
          )
          break
        case ']':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capRight.png')
            })
          )
          break
        case '_':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capBottom.png')
            })
          )
          break
        case '^':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/capTop.png')
            })
          )
          break
        case '+':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/pipeCross.png')
            })
          )
          break
        case '5':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorTop.png')
            })
          )
          break
        case '6':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorRight.png')
            })
          )
          break
        case '7':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('./img/pipeConnectorBottom.png')
            })
          )
          break
        case '8':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/pipeConnectorLeft.png')
            })
          )
          break
        case '.':
            pellets.push(
              new Pellet({
                position: {
                  x: j * Boundary.width + Boundary.width/2,
                  y: i * Boundary.height + Boundary.height/2
                },
              })
            );
            break
        case 'p':
            powerUps.push(
              new PowerUp({
                position: {
                  x: j * Boundary.width + Boundary.width/2,
                  y: i * Boundary.height + Boundary.height/2
                },
              })
            );
            break
      }
    })
  })

function circleCollideWithRectangle({circle, rectangle})
{
    const padding = Boundary.width / 2 - circle.radius - 1;
    return circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding
    && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding
    && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding
    && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width  + padding
}

let animation_id;
function animate()
{
    animation_id = requestAnimationFrame(animate);
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    

    if(keys.w.pressed && last_key == 'w')
    {
        for(let i = 0; i < boundaries.length; i++)
        {
            let boundary = boundaries[i];

            if(circleCollideWithRectangle({
                circle: {...player, velocity:{
                    x: 0,
                    y: -5
                }}, rectangle: boundary
            }))
            {
                player.velocity.y = 0;
                break
            }
            else player.velocity.y = -5;
        }
        
    }
    else if(keys.a.pressed && last_key == 'a')
    {
        for(let i = 0; i < boundaries.length; i++)
        {
            let boundary = boundaries[i];

            if(circleCollideWithRectangle({
                circle: {...player, velocity:{
                    x: -5,
                    y: 0
                }}, rectangle: boundary
            }))
            {
                player.velocity.x = 0;
                break
            }
            else player.velocity.x = -5;
        }
    }
    else if(keys.s.pressed && last_key == 's')
    {
        for(let i = 0; i < boundaries.length; i++)
        {
            let boundary = boundaries[i];

            if(circleCollideWithRectangle({
                circle: {...player, velocity:{
                    x: 0,
                    y: 5
                }}, rectangle: boundary
            }))
            {
                player.velocity.y = 0;
                break
            }
            else player.velocity.y = 5;
        }
    }
    else if(keys.d.pressed && last_key == 'd')
    {
        for(let i = 0; i < boundaries.length; i++)
        {
            let boundary = boundaries[i];

            if(circleCollideWithRectangle({
                circle: {...player, velocity:{
                    x: 5,
                    y: 0
                }}, rectangle: boundary
            }))
            {
                player.velocity.x = 0;
                break
            }
            else player.velocity.x = 5;
        }
    }

    //touch the pellets
    for(let i = pellets.length-1; i >= 0; i--)
    {
        const pellet = pellets[i];

        pellet.draw();

        if(Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y) < pellet.radius + player.radius)
        {
            //console.log('trigger');
            score += 10;
            scoreEl.innerHTML = score;
            pellets.splice(i, 1);
        }
    }

    //touch the power-ups 
    for(let i = powerUps.length-1; i >= 0; i--)
    {
        const powerUp = powerUps[i];

        powerUp.draw();

        if(Math.hypot(powerUp.position.x - player.position.x, powerUp.position.y - player.position.y) < powerUp.radius + player.radius)
        {
            //console.log('trigger');
            powerUps.splice(i, 1);

            //make ghost ghost scared
            ghosts.forEach(function(ghost){
              ghost.scared = true;

              setTimeout(function(){
                ghost.scared = false;
              }, 5000);
            });
        }
    }

    //detect collision between ghost & player
    for(let i = ghosts.length - 1; i >= 0; i--)
    {
      const ghost = ghosts[i];
      ghost.update();

      if(Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius)
      {
          if(ghost.scared)
          {
            ghosts.splice(i, 1);
          }
          else
          {
            alert('Game over!');
            cancelAnimationFrame(animation_id);
          }
      }

      const collisions = [];
      boundaries.forEach(function(boundary){
          
        if(!collisions.includes('right') && circleCollideWithRectangle({
          circle: {...ghost, velocity:{
              x: ghost.speed,
              y: 0
          }}, rectangle: boundary
        }))
        {
            //player.velocity.y = 0;
            collisions.push('right');
        }

        if(!collisions.includes('left') && circleCollideWithRectangle({
          circle: {...ghost, velocity:{
              x: -ghost.speed,
              y: 0
          }}, rectangle: boundary
        }))
        {
            //player.velocity.y = 0;
            collisions.push('left');
        }

        if(!collisions.includes('up') && circleCollideWithRectangle({
          circle: {...ghost, velocity:{
              x: 0,
              y: -ghost.speed
          }}, rectangle: boundary
        }))
        {
            //player.velocity.y = 0;
            collisions.push('up');
        }

        if(!collisions.includes('down') && circleCollideWithRectangle({
          circle: {...ghost, velocity:{
              x: 0,
              y: ghost.speed
          }}, rectangle: boundary
        }))
        {
            //player.velocity.y = 0;
            collisions.push('down');
        }

      });
      
      if(collisions.length > ghost.prevCollisions.length)
      {
          ghost.prevCollisions = collisions;
      }

      if(JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions))
      {
          //ghost.prevCollisions = collisions;

          if(ghost.velocity.x > 0)
          {
              ghost.prevCollisions.push('right');
          }
          else if(ghost.velocity.x < 0)
          {
              ghost.prevCollisions.push('left');
          }
          else if(ghost.velocity.y > 0)
          {
              ghost.prevCollisions.push('down');
          }
          else if(ghost.velocity.y < 0)
          {
              ghost.prevCollisions.push('up');
          }

         /* console.log('down1');
          console.log(collisions);
          console.log(ghost.prevCollisions);*/

          const pathways = ghost.prevCollisions.filter(function(collision){
            return !collisions.includes(collision);
          });
          //console.log(pathways, 'path');

          const direction = pathways[Math.floor(Math.random() * pathways.length)];
          //console.log('Moving there', direction);

          switch(direction)
          {
              case 'down':
                ghost.velocity.y = ghost.speed;
                ghost.velocity.x = 0;
                break;
              case 'up':
                  ghost.velocity.y = -ghost.speed;
                  ghost.velocity.x = 0;
                  break;
              case 'right':
                ghost.velocity.y = 0;
                ghost.velocity.x = ghost.speed;
                break;
              case 'left':
                  ghost.velocity.y = 0;
                  ghost.velocity.x = -ghost.speed;
                  break;
          }

          ghost.prevCollisions = [];
      }

      //console.log(collisions);
    }

    //win condition
    if(pellets.length == 0)
    {
        alert('You won!');
        cancelAnimationFrame(animation_id);
    }

    boundaries.forEach(function(boundary){
        boundary.draw();

        if(circleCollideWithRectangle({circle: player, rectangle: boundary}))
        {
            //console.log('collision');
            player.velocity = {x: 0, y: 0};
        }
    });

    /*ghosts.forEach(function(ghost){
      

    });*/

    player.update();

    if(player.velocity.x > 0) player.rotation = 0;
    else if(player.velocity.x < 0) player.rotation = Math.PI;
    else if(player.velocity.y > 0) player.rotation = Math.PI / 2;
    else if(player.velocity.y < 0) player.rotation = Math.PI * 1.5;
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

    //console.log(keys);
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

    //console.log(keys);
});