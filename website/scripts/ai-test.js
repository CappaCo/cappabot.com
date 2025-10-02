console.log(document.currentScript.src, "is running");

class PhysicsObject {
    constructor(x, y, mass = 1) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.mass = mass;
    }

    applyForce(fx, fy) {
        this.acceleration.x += fx / this.mass;
        this.acceleration.y += fy / this.mass;
    }

    move(dt) {
        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;

        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        
        this.acceleration.x = 0;
        this.acceleration.y = 0;
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 10;

const track = {
    left: -width/3,
    right: width/3,
};
const slider = {
    pos: 0,
    velocity: 0,
    maxForce: 1_000_000,
    mass: 1,
};
const arm = {
    length: height/3,
    angle: 1,
};
const end = {
    pos: {
        x: arm.length * Math.sin(arm.angle),
        y: arm.length * Math.cos(arm.angle),
    },
    velocity: {
        x: 0,
        y: 0,
    },
    mass: 1,
};

function renderCanvas() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
}