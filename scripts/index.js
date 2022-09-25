//https://www.spriters-resource.com/fullview/159361/

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const scoreEl = document.querySelector("#scoreEl");
const start_game_btn = document.querySelector("#startGameBtn");
const menu_modal = document.querySelector("#menuModal");
const scores_container = document.querySelector(".scores-text");
const game_over_container = document.querySelector("#gameOverContainer");
const game_over_scores = document.querySelector("#gameOverScores");

canvas.width = window.innerWidth*1.05;
canvas.height = window.innerHeight*1.05;

const ui_manager = new UIManager(scoreEl, scores_container, menu_modal, game_over_container, game_over_scores);

//in-game state
let pellets = [];
let boundaries = [];
let powerUps = [];
let ghosts = [];
let player = new Player({position: {x: Boundary.width*1.5, y: Boundary.height*1.5}, velocity: {x: 0, y: 0}});

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

function generateGhosts()
{
  ghosts = [

    new Ghost({
      position: {x: Boundary.width*6 + Boundary.width/2, y: Boundary.height*1.5},
      velocity: {x: Ghost.speed, y: 0},
      texture: createImage(texturer.getGhostTexture()),
      scared_texture: scared_ghost_texture,
    }),
    new Ghost({
      position: {x: Boundary.width*6 + Boundary.width/2, y: Boundary.height*3 + Boundary.height/2},
      velocity: {x: Ghost.speed, y: 0},
      texture: createImage(texturer.getGhostTexture()),
      scared_texture: scared_ghost_texture,
    }),
    new Ghost({
      position: {x: Boundary.width*8 + Boundary.width/2, y: Boundary.height*5 + Boundary.height/2},
      velocity: {x: Ghost.speed, y: 0},
      texture: createImage(texturer.getGhostTexture()),
      scared_texture: scared_ghost_texture,
    }),
    new Ghost({
      position: {x: Boundary.width*8 + Boundary.width/2, y: Boundary.height*9 + Boundary.height/2},
      velocity: {x: Ghost.speed, y: 0},
      texture: createImage(texturer.getGhostTexture()),
      scared_texture: scared_ghost_texture,
    }),

  ];
}

function spawnPlayer()
{
  player.position = {x: Boundary.width*1.5, y: Boundary.height*1.5};
  player.velocity = {x: 0, y: 0};
  player.rotation = 0;
}

function circleCollideWithRectangle({circle, rectangle})
{
    const padding = Boundary.width / 2 - circle.radius - 1;
    return circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding
    && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding
    && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding
    && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width  + padding
}

let animation_id;
let is_game = false;
function animate()
{
    animation_id = requestAnimationFrame(animate);
    
    if(is_game)
    {
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
              ui_manager.updateScores(score);
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

      player.update();

      if(player.velocity.x > 0) player.rotation = 0;
      else if(player.velocity.x < 0) player.rotation = Math.PI;
      else if(player.velocity.y > 0) player.rotation = Math.PI / 2;
      else if(player.velocity.y < 0) player.rotation = Math.PI * 1.5;

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
              c.clearRect(0, 0, window.innerWidth, window.innerHeight);

              /*menu_modal.classList.remove('hidden');
              scores_container.classList.add('hidden');*/
              ui_manager.death(score);

              is_game = false;
              break;
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

            const pathways = ghost.prevCollisions.filter(function(collision){
              return !collisions.includes(collision);
            });

            const direction = pathways[Math.floor(Math.random() * pathways.length)];

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

      }
    }
}

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

animate()

//buttons triggers
start_game_btn.addEventListener('click', function(event){
  is_game = true;
  score = 0;
  ui_manager.updateScores(score);

  map.parse(boundaries, pellets, powerUps);
  generateGhosts();
  spawnPlayer();
  
  menu_modal.classList.add('hidden');
  scores_container.classList.remove('hidden');
});