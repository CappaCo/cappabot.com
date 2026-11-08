console.log("pid-pong.js running");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gravity = 0;

class PID {
    error = 0;
    integral = 0;
    derivative = 0;

    previousError = 0;
    previousIntegral = 0;

    constructor(kp, ki, kd) {
        this.kp = kp;
        this.ki = ki;
        this.kd = kd;
    }

    compute(setpoint, currentpoint, dt) {
        this.error = setpoint - currentpoint;
        this.integral = this.previousIntegral + this.error * dt;
        this.derivative = (this.error - this.previousError) / dt;

        this.previousError = this.error;
        this.previousIntegral = this.integral;

        return this.kp * this.error + this.ki * this.integral + this.kd * this.derivative;
    }
}

class PhysicsObject {
    constructor(x, y, mass = 1) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.mass = mass;
    }

    applyForce(fx, fy) {
        // F = m * a => a = F / m
        this.acceleration.x += fx / this.mass;
        this.acceleration.y += fy / this.mass;
    }

    move(dt) {
        // Integrate acceleration to velocity
        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;
        // Integrate velocity to position
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        // Reset acceleration for next frame
        this.acceleration.x = 0;
        this.acceleration.y = 0;
    }
}

class Paddle extends PhysicsObject {
    constructor(x, y, width, height, mass = 1, maxControlForce = 5000) {
        super(x, y, mass);
        this.width = width;
        this.height = height;
        this.maxControlForce = maxControlForce; // NEW
    }

    draw() {
        ctx.fillStyle = "white";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    moveWithPID(controlForce, dt) {
        // Clamp the control force (PID output is now force, not acceleration)
        if (controlForce > this.maxControlForce) controlForce = this.maxControlForce;
        if (controlForce < -this.maxControlForce) controlForce = -this.maxControlForce;

        this.applyForce(0, controlForce); // Apply clamped control force
        this.applyForce(0, this.mass * gravity); // Gravity is not clamped
        super.move(dt);

        // Clamp to canvas
        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = 0;
        }
        if (this.position.y + this.height > canvas.height) {
            this.position.y = canvas.height - this.height;
            this.velocity.y = 0;
        }
    }
}

class Ball extends PhysicsObject {
    constructor(x, y, radius, mass = 1) {
        super(x, y, mass);
        this.radius = radius;
    }

    draw() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    move(dt) {
        // Only apply gravity if not dragging
        if (!draggingBall) {
            this.applyForce(0, this.mass * gravity);
        }
        super.move(dt);

        // Bounce off top/bottom
        if (this.position.y - this.radius < 0 || this.position.y + this.radius > canvas.height) {
            this.velocity.y = -this.velocity.y;
        }

        // Left paddle collision
        if (
            this.position.x - this.radius < leftPaddle.position.x + leftPaddle.width &&
            this.position.y > leftPaddle.position.y &&
            this.position.y < leftPaddle.position.y + leftPaddle.height
        ) {
            // Calculate hit position relative to paddle center (-1 to 1)
            const paddleCenter = leftPaddle.position.y + leftPaddle.height / 2;
            const relativeIntersectY = (this.position.y - paddleCenter) / (leftPaddle.height / 2);
            // Max bounce angle (in radians)
            const maxBounceAngle = Math.PI / 3; // 60 degrees
            const bounceAngle = relativeIntersectY * maxBounceAngle;

            // Ball speed (keep magnitude)
            const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

            // New direction
            this.velocity.x = Math.abs(speed * Math.cos(bounceAngle));
            this.velocity.y = speed * Math.sin(bounceAngle);

            // Place ball outside paddle to prevent sticking
            this.position.x = leftPaddle.position.x + leftPaddle.width + this.radius;
        }

        // Right paddle collision
        if (
            this.position.x + this.radius > rightPaddle.position.x &&
            this.position.y > rightPaddle.position.y &&
            this.position.y < rightPaddle.position.y + rightPaddle.height
        ) {
            const paddleCenter = rightPaddle.position.y + rightPaddle.height / 2;
            const relativeIntersectY = (this.position.y - paddleCenter) / (rightPaddle.height / 2);
            const maxBounceAngle = Math.PI / 3;
            const bounceAngle = relativeIntersectY * maxBounceAngle;

            const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

            this.velocity.x = -Math.abs(speed * Math.cos(bounceAngle));
            this.velocity.y = speed * Math.sin(bounceAngle);

            this.position.x = rightPaddle.position.x - this.radius;
        }

        // Reset if out of bounds
        if (this.position.x - this.radius < 0 || this.position.x + this.radius > canvas.width) {
            this.reset();
        }
    }

    reset() {
        this.position.x = canvas.width / 2;
        this.position.y = canvas.height / 2;
        const angle = (Math.random() * Math.PI / 2) - (Math.PI / 4); // -45 to +45 degrees
        const speed = 300;
        const direction = Math.random() > 0.5 ? 1 : -1;
        this.velocity.x = Math.cos(angle) * speed * direction;
        this.velocity.y = Math.sin(angle) * speed;
    }
}

const leftPaddle = new Paddle(30, canvas.height / 2 - 50, 10, 100);
const rightPaddle = new Paddle(canvas.width - 40, canvas.height / 2 - 50, 10, 100);
const ball = new Ball(canvas.width / 2, canvas.height / 2, 10, 200, 150);

ball.reset();

const leftPID = new PID(0.5, 0.01, 0.1);
const rightPID = new PID(0.5, 0.01, 0.1);

let lastTime = performance.now();

function gameLoop(currentTime) {
    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const leftOutput = leftPID.compute(ball.position.y, leftPaddle.position.y + leftPaddle.height / 2, dt);
    const rightOutput = rightPID.compute(ball.position.y, rightPaddle.position.y + rightPaddle.height / 2, dt);

    leftPaddle.moveWithPID(leftOutput, dt);
    rightPaddle.moveWithPID(rightOutput, dt);
    ball.move(dt);

    ball.draw();
    leftPaddle.draw();
    rightPaddle.draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// --- PID SLIDERS ---
function setupPIDSliders() {
    // Left paddle sliders
    const leftKp = document.getElementById("leftKp");
    const leftKi = document.getElementById("leftKi");
    const leftKd = document.getElementById("leftKd");
    const leftKpVal = document.getElementById("leftKpVal");
    const leftKiVal = document.getElementById("leftKiVal");
    const leftKdVal = document.getElementById("leftKdVal");

    leftKp.addEventListener("input", () => {
        leftPID.kp = parseFloat(leftKp.value);
        leftKpVal.textContent = leftKp.value;
    });
    leftKi.addEventListener("input", () => {
        leftPID.ki = parseFloat(leftKi.value);
        leftKiVal.textContent = leftKi.value;
    });
    leftKd.addEventListener("input", () => {
        leftPID.kd = parseFloat(leftKd.value);
        leftKdVal.textContent = leftKd.value;
    });

    // Right paddle sliders
    const rightKp = document.getElementById("rightKp");
    const rightKi = document.getElementById("rightKi");
    const rightKd = document.getElementById("rightKd");
    const rightKpVal = document.getElementById("rightKpVal");
    const rightKiVal = document.getElementById("rightKiVal");
    const rightKdVal = document.getElementById("rightKdVal");

    rightKp.addEventListener("input", () => {
        rightPID.kp = parseFloat(rightKp.value);
        rightKpVal.textContent = rightKp.value;
    });
    rightKi.addEventListener("input", () => {
        rightPID.ki = parseFloat(rightKi.value);
        rightKiVal.textContent = rightKi.value;
    });
    rightKd.addEventListener("input", () => {
        rightPID.kd = parseFloat(rightKd.value);
        rightKdVal.textContent = rightKd.value;
    });

    leftKp.dispatchEvent(new Event("input"));
    leftKi.dispatchEvent(new Event("input"));
    leftKd.dispatchEvent(new Event("input"));
    rightKp.dispatchEvent(new Event("input"));
    rightKi.dispatchEvent(new Event("input"));
    rightKd.dispatchEvent(new Event("input"));
}

setupPIDSliders();

// Gravity slider
const gravitySlider = document.getElementById("gravitySlider");
const gravityVal = document.getElementById("gravityVal");
gravitySlider.addEventListener("input", () => {
    gravity = parseFloat(gravitySlider.value);
    gravityVal.textContent = gravitySlider.value;
});
gravityVal.textContent = gravitySlider.value;

let draggingBall = false;
let justDraggedBall = false;
let dragPrev = null;
let dragPrev2 = null;

canvas.addEventListener("click", (e) => {
    if (justDraggedBall) {
        justDraggedBall = false;
        return;
    }
    ball.reset();
});

canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    draggingBall = true;
    dragPrev = { x: mouseX, y: mouseY, t: performance.now() };
    dragPrev2 = null;
});

canvas.addEventListener("mousemove", (e) => {
    if (draggingBall) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        ball.position.x = mouseX;
        ball.position.y = mouseY;
        ball.velocity.x = 0;
        ball.velocity.y = 0;
        dragPrev2 = dragPrev;
        dragPrev = { x: mouseX, y: mouseY, t: performance.now() };
    }
});

canvas.addEventListener("mouseup", () => {
    if (draggingBall && dragPrev && dragPrev2) {
        const dx = dragPrev.x - dragPrev2.x;
        const dy = dragPrev.y - dragPrev2.y;
        const dt = (dragPrev.t - dragPrev2.t) / 1000;
        if (dt > 0) {
            ball.velocity.x = dx / dt;
            ball.velocity.y = dy / dt;
        }
        justDraggedBall = true;
    }
    draggingBall = false;
    dragPrev = null;
    dragPrev2 = null;
});

// Optional: If mouse leaves canvas, stop dragging
canvas.addEventListener("mouseleave", () => {
    draggingBall = false;
    dragPrev = null;
    dragPrev2 = null;
});
