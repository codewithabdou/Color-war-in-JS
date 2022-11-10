/** Player ***************************************************/
class Player{
    constructor(x,y,color,radius,speed){
        this.position={
            x:x,
            y:y,
        };
        this.color=color;
        this.radius=radius;
        this.speed={x:5,y:5};
        this.velocity={x:0,y:0};


    }

    draw (ctx){
        ctx.beginPath();
        ctx.arc(this.position.x,this.position.y,this.radius,
            0,Math.PI*2,true);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    moveLeft(){
        this.velocity.x=-this.speed.x;

    }

    moveRight(){
        this.velocity.x=this.speed.x;
    }

    moveUp(){
        this.velocity.y=-this.speed.y;
    }

    moveDown(){
        this.velocity.y=this.speed.y;
    }

    stopUpDown(){
        this.velocity.y=0;
    }

    stopRightLeft(){
        this.velocity.x=0;
    }

    update(){
        this.position.x+=this.velocity.x;
        this.position.y+=this.velocity.y;
    }
    
}

/** Projectile ***************************************************/
class Projectile{
    constructor(x,y,color,radius,velocity){
        this.position={
            x:x,
            y:y,
        };
        this.color=color;
        this.radius=radius;
        this.velocity=velocity;

    }

    draw (ctx){
        ctx.beginPath();
        ctx.arc(this.position.x,this.position.y,this.radius,
            0,Math.PI*2,true);
        ctx.fillStyle = this.color;
        ctx.fill();

    }

    update(){
        this.position.x=this.position.x+this.velocity.x;
        this.position.y=this.position.y+this.velocity.y;
    }
    
}

/** Enemy ***************************************************/
class Enemy{
    constructor(game,x,y,color,radius){
        this.position={
            x:x,
            y:y,
        };
        this.color=color;
        this.radius=radius;
        this.game=game;
        this.angle=Math.atan2(game.player.position.y-y,game.player.position.x-x);
        this.velocity={
            x:Math.cos(this.angle)*(40/this.radius),
            y:Math.sin(this.angle)*(40/this.radius),
        };
    }

    draw (ctx){
        ctx.beginPath();
        ctx.arc(this.position.x,this.position.y,this.radius,
            0,Math.PI*2,true);
        ctx.fillStyle = this.color;
        ctx.fill();

    }

    update(){
        this.angle=Math.atan2(this.game.player.position.y-this.position.y,this.game.player.position.x-this.position.x);
        this.velocity.x=Math.cos(this.angle)*(20/this.radius);
        this.velocity.y=Math.sin(this.angle)*(20/this.radius);
        this.position.x=this.position.x+this.velocity.x;
        this.position.y=this.position.y+this.velocity.y;
    }
    
}

function spawnEnemies(game){
    setInterval(()=>{
        let x;
        let y;
        let radius=10+Math.random()*(50-10);
        if(Math.random()>0.75){
            x=canvas.width*Math.random();
            y=0-radius;

        }
        else if(Math.random()>0.5) {
            x=canvas.width+radius;
            y=canvas.height*Math.random();

        }
        else if(Math.random()>0.25) {
            x=canvas.width*Math.random();
            y=canvas.height+radius;

        }
        else {
            x=0-radius;
            y=canvas.height*Math.random();
        }
        
        let colorNumber=Math.random()*360;
        let color=`hsl(${colorNumber},50%,50%)`;
        game.enemies.push(new Enemy(game,x,y,color,radius));
    },1000);

}

function detectCollisionEnemyAndProjectile(game){
    game.enemies.forEach((enemy,enemyIndex)=>{
        game.projectiles.forEach((projectile,projectileIndex)=>{
            const distanceBetweenCenters=Math.hypot(enemy.position.x-projectile.position.x,
            enemy.position.y-projectile.position.y);
            if(distanceBetweenCenters<=enemy.radius+projectile.radius){
                if (projectile.color==="white"){
                    if(enemy.radius>=20){
                        gsap.to(enemy,{
                            radius: enemy.radius-15,
                        });
                        enemy.velocity.x=enemy.velocity.x*1.2;
                        enemy.velocity.y=enemy.velocity.y*1.2;
                        game.score+=100;
                    } 
                    else{
                        setTimeout(() => {
                            game.enemies.splice(enemyIndex,1);
                        }, 0);
                        game.score+=250;
                    } 
                    setTimeout(() => {
                        game.projectiles.splice(projectileIndex,1);
                    }, 0);
                }
                else {
                    setTimeout(() => {
                        game.enemies.splice(enemyIndex,1);
                    }, 0);
                    game.score+=250;
                    setTimeout(() => {
                        game.projectiles.splice(projectileIndex,1);
                    }, 0);

                }

                for(let i=1;i<=enemy.radius*1.5;i++){
                    game.practicles.push(new Practicle( enemy.position.x,enemy.position.y,enemy.color,
                        Math.random()*2,
                         { x: (-1+Math.random()*2)*3, y: (-1+Math.random()*2)*3,}));
                }
            }
        });
    });

    game.enemies.forEach((enemy,enemyIndex)=>{
        game.enemies.forEach((otherenemy,otherenemyIndex)=>{
            const distanceBetweenCenters=Math.hypot(enemy.position.x-otherenemy.position.x,
            enemy.position.y-otherenemy.position.y);
            if(distanceBetweenCenters<=enemy.radius+otherenemy.radius &&
                enemy.position.x-enemy.radius>0 &&
                enemy.position.x+enemy.radius<game.gameWidth &&
                enemy.position.y-enemy.radius>0 &&
                enemy.position.y+enemy.radius<game.gameHeight &&
                otherenemy.position.x-otherenemy.radius>0 &&
                otherenemy.position.x+otherenemy.radius<game.gameWidth &&
                otherenemy.position.y-otherenemy.radius>0 &&
                otherenemy.position.y+otherenemy.radius<game.gameHeight &&
                enemyIndex!==otherenemyIndex){
                    if(enemy.radius>=20){
                        gsap.to(enemy,{
                            radius: enemy.radius-15,
                        });
                        game.score+=100;
                    } 
                    else{
                        setTimeout(() => {
                            game.enemies.splice(enemyIndex,1);
                        },0);
                        
                        game.score+=250;
                    } 

                    if(otherenemy.radius>=20){
                        gsap.to(otherenemy,{
                            radius: otherenemy.radius-15,
                        });
                        game.score+=100;
                    } 
                    else{
                        setTimeout(() => {
                            game.enemies.splice(otherenemyIndex,1); 
                        }, 0);
                        game.score+=250;
                    } 
                    for(let i=1;i<=enemy.radius*1.5;i++){
                        game.practicles.push(new Practicle( enemy.position.x,enemy.position.y,enemy.color,
                        Math.random()*2,
                         { x: (-1+Math.random()*2)*3, y: (-1+Math.random()*2)*3,}));
                    }
                    for(let i=1;i<=otherenemy.radius*1.5;i++){
                        game.practicles.push(new Practicle( otherenemy.position.x,otherenemy.position.y,otherenemy.color,
                        Math.random()*2,
                        { x: (-1+Math.random()*2)*3, y: (-1+Math.random()*2)*3,}));
                    }
            }
        });
    });
    
}

function detectCollisionEnemyAndPlayer(game){
    game.enemies.forEach(enemy=>{
            const distanceBetweenCenters=Math.hypot(enemy.position.x-game.player.position.x,
            enemy.position.y-game.player.position.y);
            if(distanceBetweenCenters<=enemy.radius+game.player.radius){
                cancelAnimationFrame(animateId);
                document.querySelector("#startGameButton").innerHTML="Play Again";
                document.querySelector(".message_Menu-1").innerHTML=game.score;
                document.querySelector(".messageContainer").style.display='flex';
                
            }
    });
}

/** Event Listenner ****************************************************/

class eventListenner{
    constructor(game){
        addEventListener("click",(event) =>{
            const angle=Math.atan2(event.clientY-game.player.position.y,
            event.clientX-game.player.position.x);
            const velocity={x:5*Math.cos(angle),y:5*Math.sin(angle)};
            let color;
            if(Math.random()>=0.8) color="red";
            else color="white";
            game.projectiles.push(new Projectile(game.player.position.x,
                game.player.position.y,color,5,velocity));
        
        });
        addEventListener("keydown",(event) =>{
            switch(event.keyCode){
                case(90):
                    game.player.moveUp();
                    break;
                case(83):
                    game.player.moveDown();
                    break;
                case(68):
                    game.player.moveRight();
                    break;
                case(81):
                    game.player.moveLeft();
                    break;
            }
        
        });

        addEventListener("keyup",(event) =>{
            switch(event.keyCode){
                case(90):
                    if(game.player.velocity.y<0) game.player.stopUpDown();
                    break;
                case(83):
                    if(game.player.velocity.y>0) game.player.stopUpDown();
                    break;
                case(68):
                    if(game.player.velocity.x>0) game.player.stopRightLeft();
                    break;
                case(81):
                    if(game.player.velocity.x<0) game.player.stopRightLeft();
                    break;
            }
        
        });
    }
}

/** Practicle ***************************************************/
class Practicle{
    constructor(x,y,color,radius,velocity){
        this.position={
            x:x,
            y:y,
        };
        this.color=color;
        this.radius=radius;
        this.velocity=velocity;
        this.alpha=1;
        this.friction=0.97;

    }



    draw (ctx){
        ctx.save();
        ctx.globalAlpha=this.alpha;
        ctx.beginPath();
        ctx.arc(this.position.x,this.position.y,this.radius,
            0,Math.PI*2,true);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();

    }

    update(){
        if(this.alpha>0) this.alpha-=0.01;
        if(this.alpha<0) this.alpha=0;
        this.velocity.x*=this.friction;
        this.velocity.y*=this.friction;
        this.position.x=this.position.x+this.velocity.x;
        this.position.y=this.position.y+this.velocity.y;
    }
    
}

/** Game ****************************************************/

class Game {

    constructor(gameWidth,gameHeight){
        this.gameWidth=gameWidth;
        this.gameHeight=gameHeight;
        this.player=new Player(this.gameWidth/2,this.gameHeight/2,"white",10);
        this.projectiles=[];
        this.enemies=[];
        this.practicles=[];
        this.score=0;

    }

    draw(ctx){
        ctx.fillStyle="rgba(0,0,0,0.1)";
        ctx.fillRect(0,0,this.gameWidth,this.gameHeight);
        this.player.draw(ctx);
        this.enemies.forEach(enemy=>enemy.draw(ctx));
        this.projectiles.forEach(projectile=>projectile.draw(ctx));
        this.practicles.forEach(practicle=>practicle.draw(ctx));


    }

    update(){
        myScore.innerHTML=game.score;
        this.player.update();
        this.enemies.forEach(enemy=>enemy.update());
        this.practicles.forEach((practicle,Index)=>{
            practicle.update();
            if(practicle.alpha<=0){
                setTimeout(() => {
                    this.practicles.splice(Index,1);
                }, 0);
            }
        });
        this.projectiles.forEach((projectile,Index)=>{
            projectile.update();
            if(projectile.position.x<0+projectile.radius ||
             projectile.position.x>this.gameWidth-projectile.radius ||
             projectile.position.y<0+projectile.radius ||
             projectile.position.y>this.gameHeight-projectile.radius){
              setTimeout(() => {
                this.projectiles.splice(Index,1);
              }, 0);
                
            }
        });
        detectCollisionEnemyAndProjectile(this);
        detectCollisionEnemyAndPlayer(this);
        
    }
}

/************************************************************/
let canvas=document.querySelector("#gameScreen");
let ctx=canvas.getContext('2d');
let myScore=document.querySelector("#myScore");

canvas.width=innerWidth;
canvas.height=innerHeight;
let game;
let animateId;

document.querySelector("#startGameButton").addEventListener("click",()=>{
    game= new Game(canvas.width,canvas.height);
    gameLoop();
    const Events=new eventListenner(game);
    spawnEnemies(game);
    document.querySelector(".messageContainer").style.display='none';
});




function gameLoop(){
    animateId=requestAnimationFrame(gameLoop);
    game.draw(ctx);
    game.update();

}



