class Ball {
    constructor(p, x, y, xv, yv, r, gravity) {
        this.p = p;
        this.x = x;
        this.xv = xv;
        this.y = y;
        this.yv = yv;
        this.r = r;
        this.gravity = gravity;
    }

    update() {
        this.x += this.xv;
        this.y += this.yv;

        if (this.x - this.r < 0 || this.x + this.r > width) {
            this.xv *= -1;
        }
        if (this.y - this.r < 0) {
            this.yv *= -1;
            this.y += 5; // just to make sure the ball doesn't go into the ground :)
        }

        this.yv -= this.gravity;
    }

    show() {
        this.p.circle(this.x, this.y, this.r * 2);
    }
}

function bouncingBall(p) {
    let canvasElement = document.createElement("canvas");
    testContainer.append(canvasElement);

    let ball;

    p.setup = () => {
        p.createCanvas(width, height, canvasElement);
        ball = new Ball(
            p,
            width / 20,
            height * 0.8,
            width / 100,
            width / -100,
            width / 20,
            width / 1500,
        );
        p.strokeWeight(5);
    };

    p.draw = () => {
        p.translate(0, height);
        p.scale(1, -1);
        p.background(100);

        ball.update();
        ball.show();
    };
}

function bouncingBalls(p) {
    let canvasElement = document.createElement("canvas");
    testContainer.append(canvasElement);

    let balls = [];

    p.setup = () => {
        p.createCanvas(width, height, canvasElement);
        for (let i = 0; i < 5; i++) {
            balls.push(
                new Ball(
                    p,
                    width / 20,
                    height * 0.8,
                    width / (i + 100),
                    width / -100,
                    width / 20,
                    width / 1500,
                ),
            );
        }

        p.strokeWeight(5);
    };

    p.draw = () => {
        p.translate(0, height);
        p.scale(1, -1);
        p.background(100);

        balls.forEach((ball) => {
            ball.update();
            ball.show();
        });
    };
}

class Thing {
    constructor(p, x, y, locked) {
        this.p = p;
        this.position = p.createVector(x, y);
        this.velocity = p.createVector(0, 0);
        this.locked = locked || false;
    }

    update(lastThing, restDistance, gravity) {
        if (!this.locked && lastThing) {
            let difference = this.position.copy();
            difference.sub(lastThing.position);

            let force = difference.copy();
            force.setMag(force.mag() - restDistance);
            force.mult(-1);

            this.velocity.add(force);

            force.mult(-1);
            if (!lastThing.locked) {
                lastThing.velocity.add(force);
            }

            let gravityVector = this.p.createVector(0, gravity);
            this.velocity.add(gravityVector);

            this.position.add(this.velocity);

            //this.velocity.mult(0.99);
        }
    }

    show() {
        this.p.stroke(255);
        this.p.strokeWeight(minLen / 75);
        this.p.fill(255, 0, 255);
        this.p.circle(this.position.x, this.position.y, minLen / 5);
    }
}

function badPendulum(p) {
    let canvasElement = document.createElement("canvas");
    testContainer.append(canvasElement);

    let anchor;
    let thing1;
    let thing2;
    
    let allThings;
    
    let grav = 0.05;
    
    p.setup = () => {
        p.createCanvas(width, height, canvasElement);
    
        minLen = p.min(width, height) / 4;
    
        anchor = new Thing(p, width / 2, height / 2, true);
        thing1 = new Thing(p, width / 2, height / 2 - minLen);
        thing2 = new Thing(p, width / 2 + minLen, height / 2 - minLen);
    
        allThings = [anchor, thing1, thing2];
    }
    
    p.draw = () => {
        p.background(0, 50, 150);
    
        for (let i = 0; i < allThings.length; i++) {
            allThings[i].update(allThings[i - 1], minLen, grav);
            allThings[i].show();
            if (allThings[i - 1]) {
                p.line(
                    allThings[i - 1].position.x,
                    allThings[i - 1].position.y,
                    allThings[i].position.x,
                    allThings[i].position.y,
                );
            }
        }
    
        if (p.mouseIsPressed) {
            thing2.position.x = p.mouseX;
            thing2.position.y = p.mouseY;
            thing2.velocity = p.createVector(0, 0);
            thing1.velocity = p.createVector(0, 0);
            grav = 0;
        } else {
            grav = 0.05;
        }
    }
}