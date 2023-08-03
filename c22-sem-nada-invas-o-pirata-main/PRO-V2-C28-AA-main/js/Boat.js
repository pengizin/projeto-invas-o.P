class Boat {
    constructor(x,y,w,h,boatPos,boatAnimation){
     this.w = w;
     this.h = h;
     this.boatPos = boatPos; 
     this.boatAnimation = boatAnimation;
     this.speed = 0.05;
     this.image = loadImage("./assets/boat.png");
     this.body = Bodies.rectangle(x,y,w,h);
     World.add(world,this.body);
    }

    animate(){
      this.speed+=0.05;  
    }

    remove(index){
    setTimeout(() => {
        Matter.World.remove(world,this.boat[index].body);
        delete boats[index]
    }, 2000);    
    }

    display(){
        var pos = this.body.position;
        var angle = this.body.angle;
        var index = floor(this.speed%this.boatAnimation.length)

        push();
        translate(pos.x,pos.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.boatAnimation[index],0,this.boatPos,this.w,this.h);
        pop();
    }
}









